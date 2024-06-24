import { FC, PropsWithChildren } from 'react';
import { LayoutModeProvider } from './context/LayoutContext';
import { NotificationProvider } from './context/NotificationContext';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './context/AuthContext';

const providers = [
  HelmetProvider,
  LayoutModeProvider,
  NotificationProvider,
  AuthProvider,
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
