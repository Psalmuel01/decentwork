'use client';

import { Flex } from '@radix-ui/themes';
import Link from 'next/link';
import { ApplicationRoutes } from '@/config/routes';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { UserTypeModal } from '@/components/UserTypeModal';

// ---------- Types ----------
interface AuthResponse {
  success: boolean;
  token?: string;
  error?: string;
  user?: {
    id: string;
    walletAddress: string;
    publicKey: string;
    createdAt: string;
  };
}

// Update your types to match the actual backend Session type
interface SessionResponse {
  _id: string;
  walletAddress: string;
  token: string;
  createdAt: string;
}

// Extend Window interface for Arweave wallet
declare global {
  interface Window {
    arweaveWallet?: {
      connect: (permissions: string[]) => Promise<void>;
      getActiveAddress: () => Promise<string>;
      getActivePublicKey: () => Promise<string>;
      signature: (
        data: Uint8Array,
        options: { name: string; saltLength: number },
      ) => Promise<ArrayBuffer>;
      sign?: (transaction: any) => Promise<any>;
    };
  }
}

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [authError, setAuthError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState<string>('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  const isClientDashboardRoute = pathname.endsWith(
    ApplicationRoutes.CLIENT_DASHBOARD,
  );
  const isClientProjectsRoute = pathname.endsWith(
    ApplicationRoutes.CLIENT_PROJECTS,
  );
  const isClientProposalRoute = pathname.endsWith(
    ApplicationRoutes.CLIENT_PROPOSALS,
  );

  useEffect(() => {
    router.prefetch(ApplicationRoutes.CLIENT_DASHBOARD);
    router.prefetch(ApplicationRoutes.CLIENT_PROJECTS);
    router.prefetch(ApplicationRoutes.CLIENT_PROPOSALS);

    if (isClientDashboardRoute) setTabValue('dashboard');
    else if (isClientProjectsRoute) setTabValue('project');
    else if (isClientProposalRoute) setTabValue('proposal');
    else setTabValue('');
  }, [
    router,
    pathname,
    isClientDashboardRoute,
    isClientProjectsRoute,
    isClientProposalRoute,
  ]);

  const authenticate = async (
    walletAddress: string,
    publicKey: string,
    signature: string,
  ): Promise<AuthResponse> => {
    try {
      console.log('Attempting connectWallet with data:', {
        walletAddress,
        publicKey,
        signatureLength: signature.length,
      });

      const response = await fetch('https://decentwork.onrender.com/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            mutation ConnectWallet(
              $walletAddress: String!
              $publicKey: String!
              $signature: String!
            ) {
              connectWallet(
                walletAddress: $walletAddress
                publicKey: $publicKey
                signature: $signature
              ) {
                _id
                walletAddress
                token
                createdAt
              }
            }
          `,
          variables: {
            walletAddress,
            publicKey,
            signature,
          },
        }),
      });

      const result = await response.json();
      console.log('ConnectWallet response:', result);

      if (result.errors) {
        console.error('ConnectWallet GraphQL errors:', result.errors);
        throw new Error(result.errors[0].message);
      }

      const session = result.data.connectWallet as SessionResponse;

      // Convert Session response to AuthResponse format
      return {
        success: true,
        token: session.token,
        user: {
          id: session._id,
          walletAddress: session.walletAddress,
          publicKey: publicKey,
          createdAt: session.createdAt,
        },
      } as AuthResponse;
    } catch (error) {
      console.error('ConnectWallet mutation failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Authentication failed',
      } as AuthResponse;
    }
  };

  const handleConnect = async () => {
    try {
      setAuthError(null);
      setIsAuthenticating(true);

      if (!window?.arweaveWallet) {
        throw new Error(
          'Arweave wallet extension not detected. Please install ArConnect.',
        );
      }

      // Step 1: Connect to wallet and get address/publicKey
      console.log('Connecting to Arweave wallet...');
      await window.arweaveWallet.connect([
        'ACCESS_ADDRESS',
        'SIGNATURE',
        'ACCESS_PUBLIC_KEY',
      ]);

      const walletAddress = await window.arweaveWallet.getActiveAddress();
      const publicKey = await window.arweaveWallet.getActivePublicKey();

      console.log('Wallet connected:', { walletAddress, publicKey });

      // Step 2: Generate message to sign locally

      // const message = `Login to DecentWork\nAddress: ${walletAddress}\nTimestamp: ${Date.now()}`;
      // const message = `Login request. Nonce: 205022`;

      // pass walletAddress into getSignMessage to get message
      const response = await fetch('https://decentwork.onrender.com/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            query Query($walletAddress: String!) {
              getSignMessage(walletAddress: $walletAddress)
            }
          `,
          variables: {
            walletAddress,
          },
        }),
      });
      const result = await response.json();
      const message = result.data.getSignMessage;
      console.log('Generated message to sign:', message);

      // Step 3: Sign the message
      const data = new TextEncoder().encode(message);
      console.log('Requesting signature from wallet...');

      const rawSignature = await window.arweaveWallet.signature(data, {
        name: 'RSA-PSS',
        saltLength: 32,
      });

      const signatureBase64 = btoa(
        String.fromCharCode(...new Uint8Array(rawSignature)),
      );

      console.log(
        'Message signed successfully, signature length:',
        signatureBase64.length,
      );

      console.log('Calling backend authentication...');
      const authResponse = await authenticate(
        walletAddress,
        publicKey,
        signatureBase64,
      );

      if (authResponse.success) {
        if (authResponse.token) {
          localStorage.setItem('authToken', authResponse.token);
        }
        if (authResponse.user) {
          localStorage.setItem('userData', JSON.stringify(authResponse.user));
        }

        setIsWalletConnected(true);
        console.log('Authentication successful:', authResponse.user);
      } else {
        throw new Error(authResponse.error || 'Authentication failed');
      }
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      setAuthError(error.message || 'Failed to connect to wallet.');
      setIsWalletConnected(false);
    } finally {
      setIsAuthenticating(false);
    }
  };

  // ---------- Auto-Login ----------
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('userData');
      if (token && userData) setIsWalletConnected(true);
    }
  }, []);

  // ---------- Logout ----------
  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
    }
    setIsWalletConnected(false);
    setAuthError(null);
  };

  return (
    <Flex
      position="sticky"
      top="0"
      left="0"
      right="0"
      style={{ width: '100%' }}
      className="py-4 z-50 bg-[#ffffff1A] backdrop-blur-[7px]"
      align="center"
      justify="between"
    >
      <Link href={'/'} className="text-blue-400 font-bold text-2xl">
        DecentWork
      </Link>

      <div className="hidden md:flex items-center gap-12">
        <Link href={ApplicationRoutes.ABOUT}>About</Link>
        <Link href={ApplicationRoutes.SERVICES}>Services</Link>
        <Link href={ApplicationRoutes.HOW_IT_WORKS}>How it works</Link>
      </div>

      <Flex align="center" gap="5">
        {authError && (
          <div className="text-red-500 text-sm max-w-xs">{authError}</div>
        )}

        {!isWalletConnected ? (
          <Button
            onClick={handleConnect}
            className="text-white"
            disabled={isAuthenticating}
          >
            {isAuthenticating ? 'Connecting...' : 'Login with Wallet'}
          </Button>
        ) : (
          <Flex align="center" gap="3">
            <UserTypeModal />
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-white"
            >
              Logout
            </Button>
          </Flex>
        )}
      </Flex>
    </Flex>
  );
}
