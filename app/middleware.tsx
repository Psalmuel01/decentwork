'use client';

import { ReactNode, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { ApplicationRoutes } from '@/config/routes';

// Define private routes that require authentication
export const privateRoutes: string[] = [
  // ApplicationRoutes.DASHBOARD,
];

// Check if a path matches any of the private routes
export const isPrivateRoute = (path: string) => {
  return privateRoutes.some((route) => {
    // Convert route patterns to regex patterns if needed
    const routePattern = route.replace(/:\w+/g, '[^/]+');
    const regex = new RegExp(`^${routePattern}$`);
    return regex.test(path);
  });
};

// Helper function to check if a route should display footer
export const hasFooter = (path: string) => {
  const routesWithFooter = [ApplicationRoutes.HOME];
  return routesWithFooter.includes(path);
};

export const clientRoutes = {
  DASHBOARD: '/client/dashboard',
  PROJECTS: '/client/projects',
  PROPOSALS: '/client/proposals',
};

export const isClientRoute = (path: string) => {
  return Object.values(clientRoutes).some((route) => {
    const routePattern = route.replace(/:\w+/g, '[^/]+');
    const regex = new RegExp(`^${routePattern}$`);
    return regex.test(path);
  });
}

export const freelancerRoutes = {
  DEFAULT: '/freelancer',
  WORKROOM: '/freelancer/workroom',
  PROJECTS: '/freelancer/projects',
  PROPOSALS: '/freelancer/proposals',
  SUBMIT_PROPOSAL: '/freelancer/submit-proposal',
}

export const isFreelancerRoute = (path: string) => {
  return Object.values(freelancerRoutes).some((route) => {
    const routePattern = route.replace(/:\w+/g, '[^/]+');
    const regex = new RegExp(`^${routePattern}$`);
    return regex.test(path);
  });
}

// Client-side middleware provider component
const MiddlewareProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    // Check if current route is private and user is not logged in
    if (isPrivateRoute(pathname) && !isLoggedIn) {
      router.push(ApplicationRoutes.HOME);
    }
  }, [pathname, isLoggedIn, router]);

  return <>{children}</>;
};

export default MiddlewareProvider;
