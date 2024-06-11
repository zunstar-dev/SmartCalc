import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

interface ColorModeContextType {
  toggleColorMode: () => void;
  mode: 'light' | 'dark';
}

export const ColorModeContext = React.createContext<ColorModeContextType>({
  toggleColorMode: () => {},
  mode: 'light',
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

export const ColorModeProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const [mode, setMode] = React.useState<'light' | 'dark'>(getInitialMode);

  React.useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
      mode,
    }),
    [mode]
  );

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            light: '#FF8A50',
            main: '#FF6D00',
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
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};
