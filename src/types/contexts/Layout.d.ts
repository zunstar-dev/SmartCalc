export interface LayoutContextType {
  toggleColorMode: () => void;
  toggleDrawer: (newOpen: boolean) => void;
  mode: 'light' | 'dark';
  open: boolean;
}
