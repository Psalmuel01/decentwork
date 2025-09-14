'use client';

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import {
  useAbstraxionAccount,
  useAbstraxionSigningClient,
  useAbstraxionClient,
  useModal,
  Abstraxion,
} from '@burnt-labs/abstraxion';
import { ExecuteResult } from '@cosmjs/cosmwasm-stargate';

interface WalletContextProps {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  connect: () => void;
  disconnect: () => void;
  executeContract: (
    contractAddress: string,
    msg: Record<string, any>,
  ) => Promise<ExecuteResult | null>;
  queryContract: <T = any>(
    contractAddress: string,
    query: Record<string, any>,
  ) => Promise<T | null>;
}

const XionWalletContext = createContext<WalletContextProps>({
  address: null,
  isConnected: false,
  isConnecting: false,
  connect: () => {},
  disconnect: () => {},
  executeContract: async () => null,
  queryContract: async () => null,
});

export const useXionWallet = () => useContext(XionWalletContext);

export const XionWalletProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { data, isConnected, isConnecting } = useAbstraxionAccount();
  const { client, signArb, logout } = useAbstraxionSigningClient();
  const { client: queryClient } = useAbstraxionClient();
  const [, setShowModal] = useModal();
  const [walletConnected, setWalletConnected] = useState(false);

  // Track connection state changes
  useEffect(() => {
    console.log('XionWalletProvider: Connection state changed:', isConnected);
    console.log('XionWalletProvider: Address:', data?.bech32Address);
    setWalletConnected(isConnected);
  }, [isConnected, data]);

  // Connect wallet function
  const connect = () => {
    console.log('Showing connection modal');
    setShowModal(true);
  };

  // Disconnect wallet function
  const disconnect = () => {
    console.log('Attempting to disconnect wallet');
    if (logout) {
      logout();
      console.log('Logout function called');
    }
  };

  // Execute a contract transaction
  const executeContract = async (
    contractAddress: string,
    msg: Record<string, any>,
  ): Promise<ExecuteResult | null> => {
    if (!client || !data.bech32Address) {
      console.error('Client not initialized or user not connected');
      return null;
    }

    try {
      const result = await client.execute(
        data.bech32Address,
        contractAddress,
        msg,
        'auto',
      );

      console.log('Transaction result:', result);
      return result;
    } catch (error) {
      console.error('Transaction failed:', error);
      throw error;
    }
  };

  // Query a contract
  const queryContract = async <T = any,>(
    contractAddress: string,
    query: Record<string, any>,
  ): Promise<T | null> => {
    if (!queryClient) {
      console.error('Query client not initialized');
      return null;
    }

    try {
      return await queryClient.queryContractSmart(contractAddress, query);
    } catch (error) {
      console.error('Query failed:', error);
      throw error;
    }
  };

  return (
    <XionWalletContext.Provider
      value={{
        address: data?.bech32Address || null,
        isConnected: isConnected || walletConnected,
        isConnecting,
        connect,
        disconnect,
        executeContract,
        queryContract,
      }}
    >
      {children}
      <Abstraxion onClose={() => setShowModal(false)} />
    </XionWalletContext.Provider>
  );
};
