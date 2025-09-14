import { useState } from 'react';
import { useXionWallet } from '../context/xion-context';

export const useXionContract = (contractAddress: string) => {
  const { queryContract, executeContract, isConnected } = useXionWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Generic query function
  const query = async <T>(queryMsg: Record<string, any>): Promise<T | null> => {
    if (!isConnected) {
      setError(new Error('Not connected'));
      return null;
    }

    setError(null);
    setIsLoading(true);
    try {
      const result = await queryContract(contractAddress, queryMsg);
      return result as T;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Generic execute function
  const execute = async (executeMsg: Record<string, any>) => {
    if (!isConnected) {
      setError(new Error('Wallet not connected'));
      return null;
    }

    setError(null);
    setIsLoading(true);
    try {
      return await executeContract(contractAddress, executeMsg);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    query,
    execute,
    isLoading,
    error,
    isConnected,
  };
};
