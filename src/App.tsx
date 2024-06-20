import { FC } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Box } from '@mui/material';
import MenuAppBar from './components/common/MenuAppBar';
import TemporaryDrawer from './components/common/TemporaryDrawer';
import Salary from './pages/Salary';
import SalaryCalculator from './pages/SalaryCalculator';
import SalaryGrowth from './pages/SalaryGrowth';

const App: FC = () => {
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
          <Route path="/salary-calculator" element={<SalaryCalculator />} />
          <Route path="/salary-growth" element={<SalaryGrowth />} />
        </Routes>
      </Box>
    </Router>
  );
};

export default App;
