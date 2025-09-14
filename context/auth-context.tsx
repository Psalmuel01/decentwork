'use client';

import { ApplicationRoutes } from '@/config/routes';
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from 'react';

type AuthContextProps = {
  isNewFreelanceUser: boolean;
  setIsNewFreelanceUser: Dispatch<SetStateAction<boolean>>;
  hasJob: boolean;
  setHasJob: Dispatch<SetStateAction<boolean>>;
  isLoggedIn: boolean;
};

type AuthProviderProps = {
  children?: React.ReactNode;
};

export const AuthContext = createContext<AuthContextProps | null>(null);

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isNewFreelanceUser, setIsNewFreelanceUser] = useState(true);
  const [hasJob, setHasJob] = useState(false);
  const isLoggedIn = true;

  return (
    <AuthContext.Provider
      value={{
        isNewFreelanceUser,
        setIsNewFreelanceUser,
        hasJob,
        setHasJob,
        isLoggedIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const {
    isLoggedIn,
    isNewFreelanceUser,
    setIsNewFreelanceUser,
    hasJob,
    setHasJob,
  } = context;

  return {
    logout: () => {
      window.location.replace(ApplicationRoutes.HOME);
    },
    isLoggedIn,
    isNewFreelanceUser,
    setIsNewFreelanceUser,
    hasJob,
    setHasJob,
  };
};

export default AuthProvider;
