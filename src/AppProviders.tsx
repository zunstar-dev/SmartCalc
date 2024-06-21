// src/AppProviders.tsx
import { FC, PropsWithChildren } from 'react';
import { LayoutModeProvider } from './context/LayoutModeContext';
import { NotificationProvider } from './context/NotificationContext';
import { HelmetProvider } from 'react-helmet-async';

const providers = [HelmetProvider, LayoutModeProvider, NotificationProvider];

const AppProviders: FC<PropsWithChildren<{}>> = ({ children }) => {
  return (
    <>
      {providers.reduce((AccumulatedProviders, CurrentProvider) => {
        return <CurrentProvider>{AccumulatedProviders}</CurrentProvider>;
      }, children)}
    </>
  );
};

export default AppProviders;
