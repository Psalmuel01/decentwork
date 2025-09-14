import React, { useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { useXionWallet } from '../../context/xion-context';
import clsx from 'clsx';

interface ConnectionPromptProps {
  title?: string;
  description?: string;
  showLogo?: string;
  className?: string;
  compact?: boolean;
  onConnectionChange?: (isConnected: boolean) => void;
}

const ConnectionPrompt: React.FC<ConnectionPromptProps> = ({
  title = 'Not Connected',
  description = 'Please connect with Xion Abstraction to access all features and interact with blockchain contracts.',
  showLogo = true,
  className = '',
  compact = false,
  onConnectionChange,
}) => {
  const { isConnected, isConnecting, connect, disconnect, address } =
    useXionWallet();

  // Debug useEffect to monitor connection state changes
  useEffect(() => {
    console.log(
      'ConnectionPrompt: Connection state changed, isConnected:',
      isConnected,
    );
    console.log('ConnectionPrompt: Address:', address);

    // Notify parent component about connection state changes
    if (onConnectionChange) {
      onConnectionChange(isConnected);
    }
  }, [isConnected, address, onConnectionChange]);

  // Explicit connection handling functions to ensure state updates
  const handleConnect = () => {
    console.log('Attempting to connect wallet...');
    connect();
  };

  const handleDisconnect = () => {
    console.log('Attempting to disconnect wallet...');
    disconnect();
  };

  // Compact mode for inline usage in headers
  if (compact) {
    if (!isConnected) {
      return (
        <Button
          size="sm"
          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center"
          onClick={handleConnect}
          disabled={isConnecting}
        >
          {isConnecting ? (
            <>
              <span className="animate-spin mr-2">⟳</span> Connecting...
            </>
          ) : (
            <>
              <span className="text-lg mr-1">⬡</span> Connect Xion
            </>
          )}
        </Button>
      );
    } else {
      return (
        <Button
          size="sm"
          variant="outline"
          className="border-red-200 text-red-600 hover:bg-red-50"
          onClick={handleDisconnect}
        >
          <span className="mr-1">⏻</span> Disconnect
        </Button>
      );
    }
  }

  // Full notification panel mode
  return (
    <div
      className={clsx(
        !isConnected && 'bg-yellow-50 border border-yellow-200 rounded-md p-4',
        className,
      )}
    >
      {!isConnected ? (
        <>
          <p className="text-yellow-700 font-medium mb-2">{title}</p>
          <p className="text-sm text-yellow-600 mb-4">{description}</p>

          <div className="flex items-center justify-between mb-3">
            <Button
              variant="default"
              size="sm"
              className="text-white flex items-center bg-black"
              onClick={handleConnect}
              disabled={isConnecting}
            >
              {isConnecting ? (
                <>
                  <span className="animate-spin mr-2">⟳</span> Connecting...
                </>
              ) : (
                <>
                  <span className="text-lg mr-2">⬡</span> Connect with Xion
                </>
              )}
            </Button>
          </div>

          {showLogo && (
            <div className="flex items-center mt-3 pt-3 border-t border-yellow-100">
              <span className="text-xs text-gray-500">
                This app is powered by Xion Abstraction for secure wallet
                connections
              </span>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="hidden flex items-center justify-between">
            <div>
              <p className="text-green-700 font-medium mb-1">
                Wallet Connected
              </p>
              <p className="text-sm text-green-600 mb-3">
                Your wallet is now connected via Xion Abstraction. You can now
                interact with blockchain contracts.
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="border-red-200 text-red-600  shrink-0 ml-4"
              onClick={handleDisconnect}
            >
              <span className="mr-2">⏻</span> Disconnect
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default ConnectionPrompt;
