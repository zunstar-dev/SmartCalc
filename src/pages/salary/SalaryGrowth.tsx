import { FC, useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Skeleton,
  Button,
  Card,
  CardContent,
} from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { loadSalaries } from '../../services/SalaryService';

const SalaryGrowth: FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [salaries, setSalaries] = useState<string[]>([]);

  const navigate = useNavigate();

  const calculateGrowthRate = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const handleNavigate = () => {
    navigate('/');
  };

  useEffect(() => {
    if (user) {
      loadSalaries(user.uid).then((loadedSalaries) => {
        if (loadedSalaries) {
          setSalaries(loadedSalaries);
          setLoading(false);
        }
      });
    }
  }, [user]);

  return (
    <>
      <Helmet>
        <title>연봉 상승률 | 나의 연봉 계산기</title>
        <meta name="description" content="연봉 상승률을 계산하여 보여줍니다." />
        <meta property="og:title" content="연봉 상승률 | 나의 연봉 계산기" />
        <meta
          property="og:description"
          content="연봉 상승률을 계산하여 보여줍니다."
        />
      </Helmet>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          margin: 'auto',
          maxWidth: 600,
        }}
      >
        {loading ? (
          <>
            {[...Array(3)].map((_, index) => (
              <Box
                key={index}
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={56}
                  animation="wave"
                />
              </Box>
            ))}
          </>
        ) : salaries.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              marginTop: 4,
            }}
          >
            <Typography variant="h6" gutterBottom>
              등록된 연봉이 없습니다
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleNavigate}
            >
              연봉 등록하러가기
            </Button>
          </Box>
        ) : (
          salaries.map((salary, index) => (
            <Card key={index}>
              <CardContent
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px !important',
                }}
              >
                <Typography>
                  {salary ? Number(salary).toLocaleString('ko-KR') : '0'}
                </Typography>
                {index < salaries.length - 1 && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography>
                      {calculateGrowthRate(
                        Number(salaries[index]),
                        Number(salaries[index + 1])
                      ).toFixed(2)}
                      %
                    </Typography>
                    {calculateGrowthRate(
                      Number(salaries[index]),
                      Number(salaries[index + 1])
                    ) > 0 ? (
                      <ArrowUpwardIcon sx={{ color: 'red' }} />
                    ) : (
                      <ArrowDownwardIcon sx={{ color: 'blue' }} />
                    )}
                  </Box>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </Box>
    </>
  );
};

export default SalaryGrowth;
