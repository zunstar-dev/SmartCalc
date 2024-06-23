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
import { useLayout } from '../../context/LayoutContext';

const menuListTop: MenuItem[] = [
  {
    text: '내 연봉 등록',
    path: '/',
  },
  {
    text: '연봉 정보 등록',
    path: '/salary-info',
  },
  {
    text: '연봉 실수령액',
    path: '/salary-calculator',
  },
  {
    text: '연봉 상승률',
    path: '/salary-growth',
  },
];

const menuListBottom: MenuItem[] = [
  {
    text: '개인 정보 처리방침',
    path: '/privacy-policy',
  },
  {
    text: '서비스 이용 약관',
    path: '/service-terms',
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
        <List>
          {menuListBottom.map((data, index) => (
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
      </Box>
    </Drawer>
  );
};

export default TemporaryDrawer;
