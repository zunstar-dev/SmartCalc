import { useState, useEffect, FC } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Tooltip,
  IconButton,
  Modal,
  Skeleton,
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../context/AuthContext';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import CloseButton from '../components/button/CloseButton';
import { loadCompanyInfo } from '../services/CompanyInfoService';
import {
  format,
  addMonths,
  addYears,
  subDays,
  differenceInCalendarDays,
  startOfYear,
  endOfYear,
  addDays,
} from 'date-fns';

const AnnualLeaveCalculator: FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>(() => {
    const today = new Date();
    return format(today, 'yyyy-MM-dd');
  });
  const [results, setResults] = useState<
    { description: string; period: string; leave: number }[]
  >([]);
  const [accountingResults, setAccountingResults] = useState<
    { description: string; period: string; leave: number }[]
  >([]);
  const [totalLeave, setTotalLeave] = useState<number>(0);
  const [totalAccountingLeave, setTotalAccountingLeave] = useState<number>(0);

  const [open, setOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');

  const handleOpen = (content: string) => {
    setModalContent(content);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  useEffect(() => {
    if (user) {
      loadCompanyInfo(user.uid).then((companyInfo) => {
        if (companyInfo.joinDate) {
          setStartDate(companyInfo.joinDate);
        }
        setLoading(false);
      });
    }
  }, [user]);

  useEffect(() => {
    if (startDate) {
      handleCalculate();
    }
  }, [startDate]);

  const calculateByJoiningDate = (start: Date, end: Date) => {
    let leave = 0;
    const details: { description: string; period: string; leave: number }[] =
      [];

    // 1년 미만 연차 계산
    const firstYearEnd = subDays(addYears(start, 1), 1);
    let current = addMonths(start, 1);

    let firstYearLeave = 0;
    while (current <= end && current <= firstYearEnd) {
      firstYearLeave += 1;
      leave += 1;
      current = addMonths(current, 1);
    }

    if (firstYearLeave > 0) {
      details.push({
        description: '1년 미만',
        period: `${format(start, 'yyyy. MM. dd')} ~ ${format(firstYearEnd, 'yyyy. MM. dd')}`,
        leave: firstYearLeave,
      });
    }

    let yearCount = 2;
    let nextYearStart = addDays(firstYearEnd, 1);
    let nextYearEnd = subDays(addYears(nextYearStart, 1), 1);

    while (nextYearStart <= end) {
      const periodEnd = nextYearEnd > end ? end : nextYearEnd;
      let yearLeave = 15;
      if (yearCount >= 3) {
        yearLeave = Math.min(15 + Math.floor((yearCount - 2) / 2), 25);
      }
      details.push({
        description: `${yearCount}년`,
        period: `${format(nextYearStart, 'yyyy. MM. dd')} ~ ${format(periodEnd, 'yyyy. MM. dd')}`,
        leave: yearLeave,
      });
      leave += yearLeave;
      yearCount += 1;
      nextYearStart = addDays(nextYearEnd, 1);
      nextYearEnd = subDays(addYears(nextYearStart, 1), 1);
    }

    setResults(details);
    setTotalLeave(leave);
  };

  const calculateByAccountingDate = (start: Date, end: Date) => {
    let leave = 0;
    const details: { description: string; period: string; leave: number }[] =
      [];

    // 첫 해 월차 계산
    const firstAccountingYearEnd = endOfYear(start);
    let current = addMonths(start, 1);

    let firstYearLeave = 0;
    while (
      current <= end &&
      current <= firstAccountingYearEnd &&
      firstYearLeave < 11
    ) {
      firstYearLeave += 1;
      leave += 1;
      current = addMonths(current, 1);
    }

    details.push({
      description: '입사년(월차)',
      period: `${format(start, 'yyyy. MM. dd')} ~ ${format(firstAccountingYearEnd, 'yyyy. MM. dd')}`,
      leave: firstYearLeave,
    });

    // 두 번째 해 연차 계산
    if (start.getFullYear() !== end.getFullYear()) {
      const daysWorkedInFirstYear =
        differenceInCalendarDays(firstAccountingYearEnd, start) + 1;
      const firstYearAnnualLeave = parseFloat(
        ((15 * daysWorkedInFirstYear) / 366).toFixed(1)
      );

      if (firstYearAnnualLeave > 0) {
        details.push({
          description: '2년차(연차)',
          period: `${format(startOfYear(addYears(firstAccountingYearEnd, 1)), 'yyyy. MM. dd')} ~ ${format(endOfYear(addYears(firstAccountingYearEnd, 1)), 'yyyy. MM. dd')}`,
          leave: firstYearAnnualLeave,
        });
        leave += firstYearAnnualLeave;
      }

      // 두 번째 해 월차 계산
      const secondYearEnd = subDays(addYears(start, 1), 1);
      let secondYearLeave = 0;
      current = startOfYear(addYears(start, 1));

      while (
        current <= end &&
        current <= secondYearEnd &&
        firstYearLeave + secondYearLeave < 11
      ) {
        secondYearLeave += 1;
        leave += 1;
        current = addMonths(current, 1);
      }

      details.push({
        description: '2년차(월차)',
        period: `${format(startOfYear(addYears(start, 1)), 'yyyy. MM. dd')} ~ ${format(secondYearEnd, 'yyyy. MM. dd')}`,
        leave: secondYearLeave,
      });
    }

    // 세 번째 해부터 연차 계산
    let yearCount = 3; // 3년차부터 시작
    let firstAnnualIncreaseYear = 2;

    if (start.getMonth() !== 0 || start.getDate() !== 1) {
      firstAnnualIncreaseYear = 3;
    }

    let nextYearStart = startOfYear(addYears(start, 2));
    let nextYearEnd = endOfYear(addYears(start, 2));

    while (nextYearStart <= end) {
      let yearLeave = 15;
      if (yearCount >= firstAnnualIncreaseYear) {
        yearLeave = Math.min(
          15 + Math.floor((yearCount - firstAnnualIncreaseYear) / 2),
          25
        );
      }
      details.push({
        description: `${yearCount}년`,
        period: `${format(nextYearStart, 'yyyy. MM. dd')} ~ ${format(nextYearEnd, 'yyyy. MM. dd')}`,
        leave: yearLeave,
      });
      leave += yearLeave;
      yearCount += 1;
      nextYearStart = startOfYear(addYears(nextYearStart, 1));
      nextYearEnd = endOfYear(addYears(nextYearEnd, 1));
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
          <CardContent sx={{ padding: '16px !important' }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12}>
                {loading ? (
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height={46}
                    animation="wave"
                  />
                ) : (
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
                )}
              </Grid>
              <Grid item xs={12}>
                {loading ? (
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height={46}
                    animation="wave"
                  />
                ) : (
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
                )}
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
                  <Tooltip title="입사일 기준에 대한 설명" arrow>
                    <IconButton
                      size="small"
                      onClick={() =>
                        handleOpen(
                          '노동자의 입사일을 기준으로 계산합니다. (근로기준법에 따른 원칙)'
                        )
                      }
                    >
                      <HelpOutlineIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
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
                    <Typography variant="body2" sx={{ width: '25%' }}>
                      {result.description}
                    </Typography>
                    <Typography
                      variant="body2"
                      align="left"
                      sx={{ width: '60%' }}
                    >
                      {result.period}
                    </Typography>
                    <Typography
                      variant="body2"
                      align="right"
                      sx={{ width: '15%' }}
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
                  <Typography variant="body2" sx={{ width: '25%' }}>
                    <strong>합계</strong>
                  </Typography>
                  <Typography
                    variant="body2"
                    align="left"
                    sx={{ width: '60%' }}
                  >
                    {startDate} ~ {endDate}
                  </Typography>
                  <Typography
                    variant="body2"
                    align="right"
                    sx={{ width: '15%' }}
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
                  <Tooltip title="회계일 기준에 대한 설명" arrow>
                    <IconButton
                      size="small"
                      onClick={() =>
                        handleOpen(
                          '회사의 회계기준일(1.1)로 계산.(판례ㆍ노동부 행정해석에 따라 가능)'
                        )
                      }
                    >
                      <HelpOutlineIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
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
                    <Typography variant="body2" sx={{ width: '25%' }}>
                      {result.description}
                    </Typography>
                    <Typography
                      variant="body2"
                      align="left"
                      sx={{ width: '60%' }}
                    >
                      {result.period}
                    </Typography>
                    <Typography
                      variant="body2"
                      align="right"
                      sx={{ width: '15%' }}
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
                  <Typography variant="body2" sx={{ width: '25%' }}>
                    <strong>합계</strong>
                  </Typography>
                  <Typography
                    variant="body2"
                    align="left"
                    sx={{ width: '60%' }}
                  >
                    {startDate} ~ {endDate}
                  </Typography>
                  <Typography
                    variant="body2"
                    align="right"
                    sx={{ width: '15%' }}
                  >
                    {totalAccountingLeave}일
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}
      </Box>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100%',
            maxWidth: 300,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 2,
          }}
        >
          <Typography
            sx={{
              fontSize: 14,
            }}
          >
            {modalContent}
          </Typography>
          <CloseButton onClick={handleClose} />
        </Box>
      </Modal>
    </>
  );
};

export default AnnualLeaveCalculator;
