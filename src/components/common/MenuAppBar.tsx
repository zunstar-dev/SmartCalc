import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { FC, useContext } from 'react';
import CustomizedSwitches from './CustomizedSwitches';
import { LayoutModeContext } from '../../context/LayoutModeContext';

const MenuAppBar: FC = () => {
  const { toggleDrawer } = useContext(LayoutModeContext);

  const handleDrawerOpen = () => {
    toggleDrawer(true);
  };
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={handleDrawerOpen}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} />
          <CustomizedSwitches />
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default MenuAppBar;
