"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useXionWallet } from '@/context/xion-context';
import XionBalance from './XionBalance';
import ConnectionPrompt from './ConnectionPrompt';

interface XionWalletConnectProps {
  className?: string;
  variant?: 'default' | 'outline' | 'secondary';
  showBalance?: boolean;
  simpleMode?: boolean; // New prop for simpler display
}

const XionWalletConnect: React.FC<XionWalletConnectProps> = ({
  className = '',
  variant = 'default',
  showBalance = false,
  simpleMode = false,
}) => {
  const { address, isConnected, isConnecting, connect, disconnect } = useXionWallet();
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Clear error when connection status changes
  useEffect(() => {
    if (isConnected) {
      setConnectionError(null);
    }
  }, [isConnected]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle connection with proper error catching
  const handleConnect = () => {
    try {
      setConnectionError(null);
      connect(); // This will trigger the Abstraxion modal via the context
    } catch (error) {
      console.error('Connection error:', error);
      setConnectionError(
        'Failed to connect to Xion Abstraction. Please try again.',
      );
    }
  };

  // Format address for display
  const formatAddress = (addr: string | null) => {
    if (!addr) return '';
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  // When connecting is in progress
  if (isConnecting) {
    return (
      <Button className={className} variant={variant} disabled>
        <span className="mr-2 animate-spin">⟳</span> Connecting via Xion
        Abstraction...
      </Button>
    );
  }

  // If simpleMode, use the ConnectionPrompt component
  if (simpleMode) {
    return <ConnectionPrompt compact={true} />;
  }


  // When connected
  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2 relative" ref={dropdownRef}>
        <div
          className="bg-green-50 border border-green-200 rounded px-3 py-1.5 relative cursor-pointer"
          onClick={() => setShowDropdown(!showDropdown)}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <div className="flex items-center">
            <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
            <span className="text-sm font-medium">
              {formatAddress(address)}
            </span>
            <div
              className="flex items-center ml-2 bg-blue-50 px-1 rounded"
              title="Connected via Xion Abstraction"
            >
              <span className="text-xs text-blue-700">XION</span>
            </div>
            <span className="ml-1 text-xs">▼</span>
          </div>
          {showBalance && (
            <XionBalance className="mt-0.5 text-xs text-green-700" />
          )}

          {showTooltip && !showDropdown && (
            <div className="absolute -bottom-10 left-0 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
              Connected via Xion Abstraction
            </div>
          )}
        </div>

        {showDropdown && (
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-20 w-56">
            <div className="p-3 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">Connected Address</div>
                <div className="bg-blue-100 text-blue-700 text-xs px-1.5 py-0.5 rounded">
                  Xion
                </div>
              </div>
              <div className="text-sm font-medium truncate mt-1">{address}</div>
              {showBalance && (
                <div className="mt-2">
                  <XionBalance className="text-xs text-green-700" />
                </div>
              )}
            </div>
            <div className="p-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={() => {
                  disconnect();
                  setShowDropdown(false);
                }}
              >
                <span className="mr-2">⏻</span>
                Disconnect Wallet
              </Button>
            </div>
            <div className="px-3 py-2 bg-gray-50 text-xs text-gray-500 rounded-b-md">
              <div className="flex items-center justify-between">
                <span>Secured by Xion Abstraction</span>
                <span className="text-green-600">✓ Active</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // When not connected
  return (
    <div className="flex flex-col">
      <Button
        className={`${className} flex items-center gap-2`}
        variant={variant}
        onClick={handleConnect}
      >
        <span className="text-lg mr-1">⬡</span>
        Connect with Xion Abstraction
      </Button>

      {connectionError && (
        <div className="mt-2 text-xs text-red-600 max-w-xs">
          {connectionError}
        </div>
      )}
    </div>
  );
};

export default XionWalletConnect;
