import { useState } from 'react';
import { useXionWallet } from '../context/xion-context';

/**
 * Enhanced hook for safely interacting with Xion contracts
 * with added validation and error handling
 */
export const useXionContractSafety = (contractAddress: string) => {
  const { queryContract, executeContract, isConnected, address } =
    useXionWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Validate contract address to prevent errors
  const isValidContractAddress =
    contractAddress &&
    contractAddress.startsWith('xion') &&
    contractAddress.length > 10;

  // Enhanced query function with validation
  const query = async <T>(queryMsg: Record<string, any>): Promise<T | null> => {
    // Reset previous errors
    setError(null);

    // Validate wallet connection
    if (!isConnected) {
      const connectionError = new Error(
        'Xion Abstraction wallet not connected',
      );
      setError(connectionError);
      return null;
    }

    // Validate contract address
    if (!isValidContractAddress) {
      const addressError = new Error('Invalid Xion contract address');
      setError(addressError);
      return null;
    }

    setIsLoading(true);

    try {
      const result = await queryContract(contractAddress, queryMsg);
      return result as T;
    } catch (err) {
      const formattedError =
        err instanceof Error
          ? err
          : new Error(`Xion contract query failed: ${String(err)}`);

      setError(formattedError);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced execute function with validation
  const execute = async (executeMsg: Record<string, any>, funds?: any) => {
    // Reset previous errors
    setError(null);

    // Validate wallet connection
    if (!isConnected) {
      const connectionError = new Error(
        'Xion Abstraction wallet not connected',
      );
      setError(connectionError);
      return null;
    }

    // Validate address exists
    if (!address) {
      const addressError = new Error(
        'No wallet address available from Xion Abstraction',
      );
      setError(addressError);
      return null;
    }

    // Validate contract address
    if (!isValidContractAddress) {
      const addressError = new Error('Invalid Xion contract address');
      setError(addressError);
      return null;
    }

    setIsLoading(true);

    try {
      const result = await executeContract(contractAddress, executeMsg);
      return result;
    } catch (err) {
      const formattedError =
        err instanceof Error
          ? err
          : new Error(`Xion contract execution failed: ${String(err)}`);

      setError(formattedError);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Return values with added safety checks
  return {
    query,
    execute,
    isLoading,
    error,
    isConnected,
    isValidContract: isValidContractAddress,
    walletAddress: address,
  };
};
