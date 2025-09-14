import { useState, useEffect } from 'react';
import { useXionWallet } from '../../context/xion-context';

interface XionBalanceProps {
  className?: string;
}

interface BalanceResponse {
  amount: string;
  denom: string;
}

const XionBalance: React.FC<XionBalanceProps> = ({ className = '' }) => {
  const { address, isConnected } = useXionWallet();
  const [balance, setBalance] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!isConnected || !address) return;

      setIsLoading(true);
      try {
        // Use the REST URL from environment variables
        const response = await fetch(
          `${
            process.env.NEXT_PUBLIC_XION_REST_URL
          }/cosmos/bank/v1beta1/balances/${address}`,
        );
        const data = await response.json();

        if (data && data.balances) {
          const xionBalance = data.balances.find(
            (b: BalanceResponse) => b.denom === 'uxion',
          );
          if (xionBalance) {
            // Convert from uxion to XION (10^6 units)
            const formattedBalance = (
              parseInt(xionBalance.amount) / 1000000
            ).toFixed(2);
            setBalance(`${formattedBalance} XION`);
          } else {
            setBalance('0 XION');
          }
        }
      } catch (error) {
        console.error('Failed to fetch balance:', error);
        setBalance('Error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalance();
  }, [address, isConnected]);

  if (!isConnected) return null;

  return (
    <div className={`text-sm font-medium ${className}`}>
      {isLoading ? 'Loading...' : balance || 'No balance'}
    </div>
  );
};

export default XionBalance;
