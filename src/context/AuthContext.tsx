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
import { auth, signInUser, requestAndSaveToken, updateLastAccess } from '../firebase/Firebase';
import { useLayout } from './LayoutContext';

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const { setLoading } = useLayout();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        await updateLastAccess(user.uid); // 사용자 인증이 완료된 후 마지막 접속 시간 업데이트
        requestAndSaveToken(user.uid, setLoading); // 사용자 인증이 완료된 후 토큰 저장
      } else {
        signInUser(); // 익명 로그인 시도
      }
    });
  }, [setLoading]);

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
