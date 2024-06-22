// src/context/AuthContext.tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  FC,
  PropsWithChildren,
} from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { AuthContextProps } from '../types/contexts/Auth';
import { auth, signInUser, requestAndSaveToken } from '../firebase/Firebase';
import { useLayout } from './LayoutContext';

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const { setLoading } = useLayout();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        requestAndSaveToken(user.uid, setLoading); // 사용자 인증이 완료된 후 토큰 저장
      } else {
        signInUser(); // 익명 로그인 시도
      }
    });
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
