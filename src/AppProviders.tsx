import { FC, PropsWithChildren } from 'react';
import { LayoutModeProvider } from './context/LayoutModeContext';
import { NotificationProvider } from './context/NotificationContext';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './context/AuthContext';
import { SalaryProvider } from './context/SalaryContext';

const providers = [
  HelmetProvider,
  LayoutModeProvider,
  NotificationProvider,
  AuthProvider,
  SalaryProvider,
];

const AppProviders: FC<PropsWithChildren<{}>> = ({ children }) => {
  return (
    <>
      {providers.reduceRight((AccumulatedProviders, CurrentProvider) => {
        return <CurrentProvider>{AccumulatedProviders}</CurrentProvider>;
      }, children)}
    </>
  );
};

export default AppProviders;
