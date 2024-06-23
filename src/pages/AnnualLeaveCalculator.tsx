// src/pages/AnnualLeaveCalculator.tsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
} from '@mui/material';
import { Helmet } from 'react-helmet-async';

const AnnualLeaveCalculator: React.FC = () => {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [results, setResults] = useState<
    { description: string; period: string; leave: number }[]
  >([]);
  const [totalLeave, setTotalLeave] = useState<number>(0);

  const handleCalculate = () => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (start >= end) {
        setResults([]);
        setTotalLeave(0);
        return;
      }

      let leave = 0;
      const details: { description: string; period: string; leave: number }[] =
        [];

      // 1년 미만 연차 계산
      const firstYearEnd = new Date(start);
      firstYearEnd.setFullYear(firstYearEnd.getFullYear() + 1);
      firstYearEnd.setDate(firstYearEnd.getDate() - 1);

      let current = new Date(start);
      current.setMonth(current.getMonth() + 1);

      let firstYearLeave = 0;

      while (current <= end && current <= firstYearEnd) {
        firstYearLeave += 1;
        leave += 1;
        current.setMonth(current.getMonth() + 1);
      }

      if (firstYearLeave > 0) {
        details.push({
          description: `1년 미만`,
          period: `${start.getFullYear()}. ${start.getMonth() + 1}. ${start.getDate()} ~ ${firstYearEnd.getFullYear()}. ${firstYearEnd.getMonth() + 1}. ${firstYearEnd.getDate()}`,
          leave: firstYearLeave,
        });
      }

      // 1년차 이후 연차 계산
      let yearCount = 1;
      let nextYearStart = new Date(firstYearEnd);
      nextYearStart.setDate(nextYearStart.getDate() + 1);
      let nextYearEnd = new Date(nextYearStart);
      nextYearEnd.setFullYear(nextYearEnd.getFullYear() + 1);
      nextYearEnd.setDate(nextYearEnd.getDate() - 1);

      while (nextYearStart <= end) {
        const periodEnd = nextYearEnd > end ? end : nextYearEnd;
        let yearLeave = 15;
        if (yearCount >= 3) {
          yearLeave = Math.min(15 + yearCount - 2, 25); // 3년차부터 1개씩 증가, 최대 25개
        }
        details.push({
          description: `${yearCount}년`,
          period: `${nextYearStart.getFullYear()}. ${nextYearStart.getMonth() + 1}. ${nextYearStart.getDate()} ~ ${periodEnd.getFullYear()}. ${periodEnd.getMonth() + 1}. ${periodEnd.getDate()}`,
          leave: yearLeave,
        });
        leave += yearLeave;
        yearCount += 1;
        nextYearStart = new Date(nextYearEnd);
        nextYearStart.setDate(nextYearStart.getDate() + 1);
        nextYearEnd = new Date(nextYearStart);
        nextYearEnd.setFullYear(nextYearEnd.getFullYear() + 1);
        nextYearEnd.setDate(nextYearEnd.getDate() - 1);
      }

      setResults(details);
      setTotalLeave(leave);
    } else {
      setResults([]);
      setTotalLeave(0);
    }
  };

  return (
    <>
      <Helmet>
        <title>연차 계산기 | 나의 연차 계산기</title>
        <meta
          name="description"
          content="입사일과 퇴사일을 기준으로 연차를 계산하세요."
        />
        <meta property="og:title" content="연차 계산기 | 나의 연차 계산기" />
        <meta
          property="og:description"
          content="입사일과 퇴사일을 기준으로 연차를 계산하세요."
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
        <Card>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12}>
                <TextField
                  label="입사일"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="퇴사일"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleCalculate}
                  fullWidth
                >
                  계산하기
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        {results.length > 0 && (
          <Card>
            <CardContent
              sx={{
                p: '12px !important',
              }}
            >
              <Box>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  <strong>입사일 기준</strong>
                </Typography>
                {results.map((result, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Typography variant="body2" sx={{ width: '20%' }}>
                      {result.description}
                    </Typography>
                    <Typography variant="body2" align="center" sx={{ width: '60%' }}>
                      {result.period}
                    </Typography>
                    <Typography
                      variant="body2"
                      align="right"
                      sx={{width: '20%' }}
                    >
                      {result.leave}일
                    </Typography>
                  </Box>
                ))}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mt: 2,
                  }}
                >
                  <Typography variant="body2" sx={{  width: '20%' }}>
                    <strong>합계</strong>
                  </Typography>
                  <Typography variant="body2" align="center" sx={{  width: '60%' }}>
                    {startDate} ~ {endDate}
                  </Typography>
                  <Typography
                    variant="body2"
                    align="right"
                    sx={{ width: '20%' }}
                  >
                    {totalLeave}일
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}
      </Box>
    </>
  );
};

export default AnnualLeaveCalculator;
