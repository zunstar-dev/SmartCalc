import {
  createContext,
  useContext,
  useState,
  useEffect,
  FC,
  PropsWithChildren,
} from 'react';
import { useAuth } from './AuthContext';
import { loadSalaries, saveSalaries } from '../firebase/Firebase';
import { SalaryContextProps } from '../types/contexts/SalaryMode';

const SalaryContext = createContext<SalaryContextProps | undefined>(undefined);

export const SalaryProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const { user, loading } = useAuth();
  const [salaries, setSalaries] = useState<string[]>(['']);

  useEffect(() => {
    if (user && !loading) {
      loadSalaries(user.uid).then((loadedSalaries) => {
        if (loadedSalaries.length === 0) {
          setSalaries(['']);
        } else {
          setSalaries(loadedSalaries);
        }
      });
    }
  }, [user, loading]);

  const saveSalariesToFirestore = async () => {
    if (user) {
      await saveSalaries(user.uid, salaries);
    }
  };

  return (
    <SalaryContext.Provider
      value={{ salaries, setSalaries, saveSalaries: saveSalariesToFirestore }}
    >
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
