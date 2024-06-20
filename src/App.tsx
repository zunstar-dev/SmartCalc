// src/App.tsx
import { FC } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Box } from '@mui/material';
import MenuAppBar from './components/common/MenuAppBar';
import TemporaryDrawer from './components/common/TemporaryDrawer';
import Salary from './pages/Salary';
import SalaryCalculator from './pages/SalaryCalculator';
import SalaryGrowth from './pages/SalaryGrowth';
import Notifications from './components/common/Notifications';
import FirebaseNotificationManager from './firebase/FirebaseNotificationManager';
import AppProviders from './AppProviders';

const App: FC = () => {
  return (
    <AppProviders>
      <Router>
        <MenuAppBar />
        <TemporaryDrawer />
        <FirebaseNotificationManager />
        <Box
          sx={{
            padding: 2, // 원하는 패딩 값 설정
          }}
        >
          <Routes>
            <Route path="/" element={<Salary />} />
            <Route path="/salary-calculator" element={<SalaryCalculator />} />
            <Route path="/salary-growth" element={<SalaryGrowth />} />
          </Routes>
          <Notifications />
        </Box>
      </Router>
    </AppProviders>
  );
};

export default App;
