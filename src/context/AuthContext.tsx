// src/context/AuthContext.tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  FC,
  PropsWithChildren,
} from 'react';
import { User } from 'firebase/auth';
import { AuthContextProps } from '../types/contexts/Auth';
import {
  signInUser,
  updateUserData,
  listenToAuthChanges,
} from '../services/AuthService';
import { requestAndSaveToken } from '../firebase/Firebase';

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = listenToAuthChanges(async (user) => {
      if (user) {
        setUser(user);
        await updateUserData(user.uid);
        requestAndSaveToken(user.uid);
      } else {
        signInUser();
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
