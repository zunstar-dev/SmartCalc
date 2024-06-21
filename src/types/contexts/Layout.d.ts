export interface LayoutContextType {
  toggleColorMode: () => void;
  toggleDrawer: (newOpen: boolean) => void;
  setLoading: (loading: boolean) => void; // 추가된 부분
  mode: 'light' | 'dark';
  open: boolean;
  loading: boolean; // 추가된 부분
}
