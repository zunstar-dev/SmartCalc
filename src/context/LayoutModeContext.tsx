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
import { LayoutModeContextType } from '../types/contexts/LayoutMode';

export const LayoutModeContext = createContext<LayoutModeContextType>({
  toggleColorMode: () => {},
  toggleDrawer: () => {},
  mode: 'light',
  open: false,
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
  const [open, setOpen] = useState(false);

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
      mode,
      open,
    }),
    [mode, open]
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
    <LayoutModeContext.Provider value={Layout}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </LayoutModeContext.Provider>
  );
};

export const useLayout = (): LayoutModeContextType => {
  const context = useContext(LayoutModeContext);
  if (!context) {
    throw new Error('useLayout must be used within a LayoutModeContext');
  }
  return context;
};
