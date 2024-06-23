// src/App.tsx
import { FC, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Box } from '@mui/material';
import MenuAppBar from './components/common/MenuAppBar';
import TemporaryDrawer from './components/common/TemporaryDrawer';
import Salary from './pages/Salary';
import SalaryCalculator from './pages/SalaryCalculator';
import SalaryGrowth from './pages/SalaryGrowth';
import Notifications from './components/common/Notifications';
import { useNotification } from './context/NotificationContext';
import setupFirebaseMessaging from './firebase/FirebaseNotificationManager';
import SalaryInfo from './pages/SalaryInfo';
import ServiceTerms from './pages/ServiceTerms';
import PrivacyPolicy from './pages/PrivacyPolicy';
import AnnualLeaveCalculator from './pages/AnnualLeaveCalculator';

const App: FC = () => {
  // firebase 서비스 워커 설정
  const { addNotification } = useNotification();
  useEffect(() => {
    const unsubscribe = setupFirebaseMessaging(addNotification);

    return () => {
      unsubscribe();
    };
  }, [addNotification]);

  return (
    <Router>
      <MenuAppBar />
      <TemporaryDrawer />
      <Box
        sx={{
          padding: 2, // 원하는 패딩 값 설정
        }}
      >
        <Routes>
          <Route path="/" element={<Salary />} />
          <Route path="/salary-info" element={<SalaryInfo />} />
          <Route path="/salary-calculator" element={<SalaryCalculator />} />
          <Route path="/salary-growth" element={<SalaryGrowth />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/service-terms" element={<ServiceTerms />} />
          <Route
            path="/annual-leave-calculator"
            element={<AnnualLeaveCalculator />}
          />
        </Routes>
        <Notifications />
      </Box>
    </Router>
  );
};

export default App;
