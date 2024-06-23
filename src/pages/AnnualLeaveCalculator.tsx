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
  const [accountingResults, setAccountingResults] = useState<
    { description: string; period: string; leave: number }[]
  >([]);
  const [totalLeave, setTotalLeave] = useState<number>(0);
  const [totalAccountingLeave, setTotalAccountingLeave] = useState<number>(0);

  const calculateByJoiningDate = (start: Date, end: Date) => {
    let leave = 0;
    const details: { description: string; period: string; leave: number }[] = [];

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
        period: `${start.getFullYear()}. ${start.getMonth() + 2}. ${start.getDate()} ~ ${firstYearEnd.getFullYear()}. ${firstYearEnd.getMonth() + 1}. ${firstYearEnd.getDate()}`,
        leave: firstYearLeave,
      });
    }

    let yearCount = 2;
    let nextYearStart = new Date(firstYearEnd);
    nextYearStart.setDate(nextYearStart.getDate());
    let nextYearEnd = new Date(nextYearStart);
    nextYearEnd.setFullYear(nextYearEnd.getFullYear() + 1);
    nextYearEnd.setDate(nextYearEnd.getDate() );

    while (nextYearStart <= end) {
      const periodEnd = nextYearEnd > end ? end : nextYearEnd;
      let yearLeave = 15;
      if(yearCount === 2){
        nextYearStart.setDate(nextYearStart.getDate() + 1);
      }else if (yearCount >= 3) {
        yearLeave = Math.min(15 + Math.floor((yearCount - 2) / 2), 25); // 3년차부터 2년마다 1개씩 증가, 최대 25개
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
  };

  const calculateByAccountingDate = (start: Date, end: Date) => {
    let leave = 0;
    const details: { description: string; period: string; leave: number }[] = [];

    // 첫 해 월차 계산
    const firstAccountingYearEnd = new Date(start.getFullYear(), 11, 31); // 첫 회계년도 끝: 해당 년도 12월 31일
    let current = new Date(start);
    current.setMonth(current.getMonth() + 1);

    let firstYearLeave = 0;
    while (current <= end && current <= firstAccountingYearEnd) {
      firstYearLeave += 1;
      leave += 1;
      current.setMonth(current.getMonth() + 1);
    }

    if (firstYearLeave > 0) {
      details.push({
        description: `입사년 (월차)`,
        period: `${start.getFullYear()}. ${start.getMonth() + 2}. ${start.getDate()} ~ ${firstAccountingYearEnd.getFullYear()}. 12. ${start.getDate()}`,
        leave: firstYearLeave,
      });
    }

    // 두 번째 해 연차 계산
    const daysWorkedInFirstYear = (firstAccountingYearEnd.getTime() - start.getTime()) / (1000 * 60 * 60 * 24) + 1;
    const firstYearAnnualLeave = parseFloat(((15 * daysWorkedInFirstYear) / 366).toFixed(1));  // 소수점 첫째 자리까지 반올림

    if (firstYearAnnualLeave > 0) {
      details.push({
        description: `2년차 (연차)`,
        period: `${firstAccountingYearEnd.getFullYear() + 1}. 1. 1 ~ ${firstAccountingYearEnd.getFullYear() + 1}. 12. 31`,
        leave: firstYearAnnualLeave,
      });
      leave += firstYearAnnualLeave;
    }

    // 두 번째 해 월차 계산
    const secondYearEnd = new Date(start);
    secondYearEnd.setFullYear(start.getFullYear() + 1);
    secondYearEnd.setDate(secondYearEnd.getDate() - 1);

    let secondYearLeave = 0;
    current = new Date(start.getFullYear() + 1, 0, 1);  // 1월 1일
    current.setMonth(current.getMonth() + 1);

    while (current <= end && current <= secondYearEnd) {
      secondYearLeave += 1;
      leave += 1;
      current.setMonth(current.getMonth() + 1);
    }

    if (secondYearLeave > 0) {
      details.push({
        description: `2년차 (월차)`,
        period: `${start.getFullYear() + 1}. 1. 1 ~ ${secondYearEnd.getFullYear()}. ${secondYearEnd.getMonth() + 1}. ${secondYearEnd.getDate()}`,
        leave: secondYearLeave,
      });
    }

    // 세 번째 해부터 연차 계산 (2년마다 1개씩 증가, 최대 25일까지)
    let yearCount = 2;
    if (start.getMonth() === 0 && start.getDate() === 1) {
      yearCount = 3; // 입사일이 1월 1일인 경우
    }
    let nextYearStart = new Date(firstAccountingYearEnd);
    nextYearStart.setFullYear(nextYearStart.getFullYear() + 1);
    nextYearStart.setDate(nextYearStart.getDate() + 1);
    let nextYearEnd = new Date(nextYearStart);
    nextYearEnd.setFullYear(nextYearEnd.getFullYear() + 1);
    nextYearEnd.setDate(nextYearEnd.getDate() - 1);

    while (nextYearStart <= end) {
      let yearLeave = 15;
      if (yearCount >= 3) {
        yearLeave = Math.min(15 + Math.floor((yearCount - 2) / 2), 25); // 3년차부터 2년마다 1개씩 증가, 최대 25개
      }
      details.push({
        description: `${yearCount}년`,
        period: `${nextYearStart.getFullYear()}. 1. 1 ~ ${nextYearEnd.getFullYear()}. 12. 31`,
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

    setAccountingResults(details);
    setTotalAccountingLeave(leave);
  };


  const handleCalculate = () => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (start >= end) {
        setResults([]);
        setTotalLeave(0);
        setAccountingResults([]);
        setTotalAccountingLeave(0);
        return;
      }

      calculateByJoiningDate(start, end);
      calculateByAccountingDate(start, end);
    } else {
      setResults([]);
      setTotalLeave(0);
      setAccountingResults([]);
      setTotalAccountingLeave(0);
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
                      mb: 2,
                    }}
                  >
                    <Typography variant="body2" sx={{ width: '20%' }}>
                      {result.description}
                    </Typography>
                    <Typography
                      variant="body2"
                      align="center"
                      sx={{ width: '60%' }}
                    >
                      {result.period}
                    </Typography>
                    <Typography
                      variant="body2"
                      align="right"
                      sx={{ width: '20%' }}
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
                  <Typography variant="body2" sx={{ width: '20%' }}>
                    <strong>합계</strong>
                  </Typography>
                  <Typography
                    variant="body2"
                    align="center"
                    sx={{ width: '60%' }}
                  >
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
        {accountingResults.length > 0 && (
          <Card>
            <CardContent
              sx={{
                p: '12px !important',
              }}
            >
              <Box>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  <strong>회계일 기준</strong>
                </Typography>
                {accountingResults.map((result, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      mb: 2,
                    }}
                  >
                    <Typography variant="body2" sx={{ width: '20%' }}>
                      {result.description}
                    </Typography>
                    <Typography
                      variant="body2"
                      align="center"
                      sx={{ width: '60%' }}
                    >
                      {result.period}
                    </Typography>
                    <Typography
                      variant="body2"
                      align="right"
                      sx={{ width: '20%' }}
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
                  <Typography variant="body2" sx={{ width: '20%' }}>
                    <strong>합계</strong>
                  </Typography>
                  <Typography
                    variant="body2"
                    align="center"
                    sx={{ width: '60%' }}
                  >
                    {startDate} ~ {endDate}
                  </Typography>
                  <Typography
                    variant="body2"
                    align="right"
                    sx={{ width: '20%' }}
                  >
                    {totalAccountingLeave}일
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
