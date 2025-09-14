'use client';

import { ReactNode } from 'react';
import Navbar from '@/components/Navbar';
import { Theme } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';
import FreelancerProvider from '@/context/freelancer-context';
import AuthProvider from '@/context/auth-context';
import MiddlewareProvider, {
  hasFooter,
  isClientRoute,
  isFreelancerRoute,
} from '@/app/middleware';
import { Toaster } from 'sonner';
import FooterMain from '@/components/footer/footer-main';
import { usePathname } from 'next/navigation';
import { ClientProvider } from '@/context/client-context';
import { AbstraxionProvider } from '@burnt-labs/abstraxion';
import { XionWalletProvider } from '@/context/xion-context';
import FreelancerNavbar from '@/components/FreelancerNavbar';
import ClientNavbar from '@/components/ClientNavbar';

const Provider = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();

  // Treasury configuration using environment variables
  const treasuryConfig = {
    treasury: process.env.NEXT_PUBLIC_XION_TREASURY_ADDRESS,
    rpcUrl: process.env.NEXT_PUBLIC_XION_RPC_URL,
    restUrl: process.env.NEXT_PUBLIC_XION_REST_URL,
  };

  return (
    <AbstraxionProvider config={treasuryConfig}>
      <XionWalletProvider>
        <Theme radius="large">
          <AuthProvider>
            <FreelancerProvider>
              <ClientProvider>
                <MiddlewareProvider>
                  <div className="w-screen bg-muted flex justify-center">
                    <div className="px-[20px] w-full 2xl:w-[1500px] md:px-10 xl:px-36 bg-muted h-screen overflow-auto">
                      <div className="w-full">
                        {/* <HeaderMain /> */}
                        {isClientRoute(pathname) ? (
                          <ClientNavbar />
                        ) : isFreelancerRoute(pathname) ? (
                          <FreelancerNavbar />
                        ) : (
                          <Navbar />
                        )}
                      </div>

                      {/* {isPrivateRoute(currentPath) ? (
                  <DashboardLayout>{children}</DashboardLayout>
                ) : (
                  <>{children}</>
                )} */}

                      <main className="mx-auto mt-8 mb-20">
                        <div className="">{children}</div>
                      </main>

                      {hasFooter(pathname) && <FooterMain />}
                    </div>
                  </div>
                </MiddlewareProvider>
                <Toaster />
                {/*<Toast />*/}
              </ClientProvider>
            </FreelancerProvider>
          </AuthProvider>
        </Theme>
      </XionWalletProvider>
    </AbstraxionProvider>
  );
};

export default Provider;
