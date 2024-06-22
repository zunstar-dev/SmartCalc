import { FC } from 'react';
import { Box, Typography, Skeleton } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { Helmet } from 'react-helmet-async';
import { useSalary } from '../context/SalaryContext';
import { useLayout } from '../context/LayoutContext';

const SalaryGrowth: FC = () => {
  const { salaries } = useSalary();
  const { loading } = useLayout();

  const calculateGrowthRate = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

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
                <Skeleton
                  variant="circular"
                  width={40}
                  height={40}
                  animation="wave"
                />
              </Box>
            ))}
          </>
        ) : (
          salaries.map((salary, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Typography sx={{ marginRight: 1 }}>
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
            </Box>
          ))
        )}
      </Box>
    </>
  );
};

export default SalaryGrowth;
