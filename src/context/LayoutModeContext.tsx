import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import {
  createContext,
  FC,
  PropsWithChildren,
  useEffect,
  useMemo,
  useState,
} from 'react';

interface LayoutModeContextType {
  toggleColorMode: () => void;
  toggleDrawer: (newOpen: boolean) => void;
  mode: 'light' | 'dark';
  open: boolean;
}

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
            main: '#ebbd36',
            dark: '#BF360C',
            contrastText: '#FFFFFF',
          },
          secondary: {
            light: '#FFD740',
            main: '#FFC107',
            dark: '#FF8F00',
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
