import {
  createContext,
  useContext,
  useState,
  useEffect,
  FC,
  PropsWithChildren,
} from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { AuthContextProps } from '../types/contexts/AuthMode';
import { auth, signInUser } from '../firebase/Firebase';

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    signInUser(); // Ensure user is signed in anonymously

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
