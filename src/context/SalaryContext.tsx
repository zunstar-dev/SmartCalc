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
import { SalaryContextProps } from '../types/contexts/SalaryMode';

const SalaryContext = createContext<SalaryContextProps | undefined>(undefined);

export const SalaryProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const { user } = useAuth();
  const [salaries, setSalaries] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      loadSalaries(user.uid).then((loadedSalaries) => {
        if (loadedSalaries) {
          setSalaries(loadedSalaries);
        }
      });
    }
  }, [user]);

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
