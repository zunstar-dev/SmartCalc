// src/context/SalaryContext.tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  FC,
  PropsWithChildren,
} from 'react';
import { useAuth } from './AuthContext';
import { loadSalaries } from '../firebase/Firebase';
import { SalaryContextProps } from '../types/contexts/Salary';
import { useLayout } from './LayoutContext';

const SalaryContext = createContext<SalaryContextProps | undefined>(undefined);

export const SalaryProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const { user } = useAuth();
  const { loading, setLoading } = useLayout();
  const [salaries, setSalaries] = useState<string[]>([]);

  useEffect(() => {
    if (user && !loading) {
      loadSalaries(user.uid).then((loadedSalaries) => {
        if (loadedSalaries) {
          setSalaries(loadedSalaries);
        }
        setLoading(false);
      });
    }
  }, [user, loading, setLoading]);

  return (
    <SalaryContext.Provider value={{ salaries, setSalaries }}>
      {children}
    </SalaryContext.Provider>
  );
};

export const useSalary = () => {
  const context = useContext(SalaryContext);
  if (context === undefined) {
    throw new Error('useSalary must be used within a SalaryProvider');
  }
  return context;
};
