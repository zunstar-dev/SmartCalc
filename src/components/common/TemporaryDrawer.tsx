import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { FC } from 'react';
import { MenuItem } from '../../types/menu';
import { Link } from 'react-router-dom';
import { useLayout } from '../../context/LayoutModeContext';

const menuListTop: MenuItem[] = [
  {
    text: '내 연봉 등록',
    path: '/',
  },
  {
    text: '2024 실수령액',
    path: '/salary-calculator',
  },
  {
    text: '연봉 상승률',
    path: '/salary-growth',
  },
];

const TemporaryDrawer: FC = () => {
  const { open, toggleDrawer } = useLayout();

  const handleDrawer = () => {
    toggleDrawer(!open);
  };

  return (
    <Drawer open={open} onClose={handleDrawer}>
      <Box sx={{ width: 250 }} role="presentation">
        <List>
          {menuListTop.map((data, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton
                component={Link}
                to={data.path}
                onClick={handleDrawer}
              >
                <ListItemText primary={data.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
      </Box>
    </Drawer>
  );
};

export default TemporaryDrawer;
