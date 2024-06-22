// src/context/LayoutContext.tsx
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { LayoutContextType } from '../types/contexts/Layout';

export const LayoutContext = createContext<LayoutContextType>({
  toggleColorMode: () => {},
  toggleDrawer: () => {},
  setLoading: () => {},
  mode: 'light',
  open: false,
  loading: true,
});

const getInitialMode = () => {
  const savedMode = localStorage.getItem('themeMode');
  if (savedMode) {
    return savedMode as 'light' | 'dark';
  }
  const prefersDarkMode = window.matchMedia(
    '(prefers-color-scheme: dark)'
  ).matches;
  return prefersDarkMode ? 'dark' : 'light';
};

export const LayoutModeProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const [mode, setMode] = useState<'light' | 'dark'>(getInitialMode);
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  const Layout = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
      toggleDrawer: (newOpen: boolean) => {
        setOpen(newOpen);
      },
      setLoading: (loading: boolean) => {
        setLoading(loading);
      },
      mode,
      open,
      loading,
    }),
    [mode, open, loading]
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            light: '#ebbd36',
            main: mode === 'dark' ? '#737373' : '#ebbd36',
            dark: '#737373',
            contrastText: '#FFFFFF',
          },
          secondary: {
            light: '#ff9200',
            main: mode === 'dark' ? '#9a9999' : '#ff9200',
            dark: '#9a9999',
            contrastText: '#000000',
          },
          background: {
            default: mode === 'dark' ? '#303030' : '#fafafa',
            paper: mode === 'dark' ? '#424242' : '#ffffff',
          },
          text: {
            primary: mode === 'dark' ? '#FFFFFF' : '#000000',
            secondary: mode === 'dark' ? '#BDBDBD' : '#757575',
          },
        },
      }),
    [mode]
  );

  return (
    <LayoutContext.Provider value={Layout}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </LayoutContext.Provider>
  );
};

export const useLayout = (): LayoutContextType => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within a LayoutModeContext');
  }
  return context;
};
