import { FC, useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  Divider,
  Button,
  Skeleton,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import {
  subMonths,
  differenceInCalendarDays,
  endOfMonth,
  startOfMonth,
} from 'date-fns';
import { loadRetirementInfo } from '../services/RetirementService';
import { convertToKoreanCurrency } from '../helpers/common';
import { LoadRetirementInfoResponse } from '../types/Retirement';

const RetirementCalculator: FC = () => {
  const { user } = useAuth();
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [monthlySalary, setMonthlySalary] = useState<string>('0');
  const [convertedMonthlySalary, setConvertedMonthlySalary] =
    useState<string>('0');
  const [annualBonus, setAnnualBonus] = useState<string>('0');
  const [convertedAnnualBonus, setConvertedAnnualBonus] = useState<string>('0');
  const [annualLeaveAllowance, setAnnualLeaveAllowance] = useState<string>('0');
  const [convertedAnnualLeaveAllowance, setConvertedAnnualLeaveAllowance] =
    useState<string>('0');
  const [expectedRetirementPay, setExpectedRetirementPay] = useState<number>(0);
  const [averageDailyWage, setAverageDailyWage] = useState<number>(0);
  const [totalEmploymentDays, setTotalEmploymentDays] = useState<number>(0);
  const [threeMonthEmploymentDays, setThreeMonthEmploymentDays] =
    useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      if (user) {
        const retirementData: LoadRetirementInfoResponse =
          await loadRetirementInfo(user.uid);
        if (retirementData) {
          setStartDate(retirementData.startDate || '');
          setEndDate(retirementData.endDate || '');
          const employmentDays = differenceInCalendarDays(
            new Date(retirementData.endDate),
            new Date(retirementData.startDate)
          );
          setTotalEmploymentDays(employmentDays);
          setMonthlySalary(retirementData.monthlySalary?.toString() || '0');
          setConvertedMonthlySalary(
            convertToKoreanCurrency(
              retirementData.monthlySalary?.toString() || '0'
            )
          );

          setAnnualBonus(retirementData.annualBonus?.toString() || '0');
          setConvertedAnnualBonus(
            convertToKoreanCurrency(
              retirementData.annualBonus?.toString() || '0'
            )
          );
          setAnnualLeaveAllowance(
            retirementData.annualLeaveAllowance?.toString() || '0'
          );
          setConvertedAnnualLeaveAllowance(
            convertToKoreanCurrency(
              retirementData.annualLeaveAllowance?.toString() || '0'
            )
          );

          calculateRetirementPay(
            retirementData.monthlySalary || 0,
            retirementData.annualBonus || 0,
            retirementData.annualLeaveAllowance || 0,
            employmentDays,
            new Date(retirementData.endDate)
          );

          calculateLastThreeMonths(new Date(retirementData.endDate));
        }
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  const calculateRetirementPay = (
    baseSalary: number,
    bonus: number,
    annualLeavePay: number,
    employmentDays: number,
    endDate: Date
  ) => {
    const threeMonthEmploymentDays = calculateLastThreeMonths(endDate);

    const A = baseSalary * 3;
    const B = bonus * (3 / 12);
    const C = annualLeavePay * (3 / 12);

    // 1일 평균임금 = 퇴직일 이전 3개월간에 지급받은 임금 총액 (A+B+C)/퇴직일 이전 3개월간의 총 일수
    const averageDailyWage = (A + B + C) / threeMonthEmploymentDays;

    // 1일 평균임금 × 30(일) × (재직일수/365)
    const retirementPay = averageDailyWage * 30 * (employmentDays / 365);

    setExpectedRetirementPay(retirementPay);
    setAverageDailyWage(averageDailyWage);
    setThreeMonthEmploymentDays(threeMonthEmploymentDays);
  };

  const calculateLastThreeMonths = (endDate: Date) => {
    let totalDays = 0;

    for (let i = 2; i >= 0; i--) {
      const monthEnd = endOfMonth(subMonths(endDate, i));
      const monthStart = startOfMonth(subMonths(endDate, i));
      const daysInMonth = differenceInCalendarDays(monthEnd, monthStart) + 1;

      totalDays += daysInMonth;
    }

    return totalDays;
  };

  const handleMonthlySalaryChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value.replace(/\D/g, '');
    setMonthlySalary(value);
    setConvertedMonthlySalary(convertToKoreanCurrency(value));
  };

  const handleMonthlySalaryBlur = () => {
    setConvertedMonthlySalary(convertToKoreanCurrency(monthlySalary));
  };

  const handleAnnualBonusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setAnnualBonus(value);
    setConvertedAnnualBonus(convertToKoreanCurrency(value));
  };

  const handleAnnualBonusBlur = () => {
    setConvertedAnnualBonus(convertToKoreanCurrency(annualBonus));
  };

  const handleAnnualLeaveAllowanceChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value.replace(/\D/g, '');
    setAnnualLeaveAllowance(value);
    setConvertedAnnualLeaveAllowance(convertToKoreanCurrency(value));
  };

  const handleAnnualLeaveAllowanceBlur = () => {
    setConvertedAnnualLeaveAllowance(
      convertToKoreanCurrency(annualLeaveAllowance)
    );
  };

  const handleSearch = () => {
    const baseSalary = Number(monthlySalary.replace(/,/g, ''));
    const bonus = Number(annualBonus.replace(/,/g, ''));
    const annualLeavePay = Number(annualLeaveAllowance.replace(/,/g, ''));

    const days = differenceInCalendarDays(
      new Date(endDate),
      new Date(startDate)
    );

    setTotalEmploymentDays(days);

    calculateRetirementPay(
      baseSalary,
      bonus,
      annualLeavePay,
      days,
      new Date(endDate)
    );

    calculateLastThreeMonths(new Date(endDate));
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        margin: 'auto',
        maxWidth: 800,
      }}
    >
      <Card>
        <CardContent sx={{ padding: '16px !important' }}>
          <Box>
            {loading ? (
              <Skeleton
                variant="rectangular"
                width="100%"
                height={24}
                animation="wave"
              />
            ) : (
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2">예상 퇴직금</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" align="right">
                    {expectedRetirementPay.toLocaleString('ko-KR')} 원
                  </Typography>
                </Grid>
              </Grid>
            )}
            {loading ? (
              <Skeleton
                variant="rectangular"
                width="100%"
                height={24}
                animation="wave"
              />
            ) : (
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2">1일 평균 임금</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" align="right">
                    {averageDailyWage.toLocaleString('ko-KR')} 원
                  </Typography>
                </Grid>
              </Grid>
            )}
            {loading ? (
              <Skeleton
                variant="rectangular"
                width="100%"
                height={24}
                animation="wave"
              />
            ) : (
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2">총 재직일수</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" align="right">
                    {totalEmploymentDays} 일
                  </Typography>
                </Grid>
              </Grid>
            )}
            {loading ? (
              <Skeleton
                variant="rectangular"
                width="100%"
                height={24}
                animation="wave"
              />
            ) : (
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography variant="body2">
                    퇴직일 이전 3개월간의 총 일수
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body2" align="right">
                    {threeMonthEmploymentDays} 일
                  </Typography>
                </Grid>
              </Grid>
            )}
          </Box>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Grid container spacing={2}>
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
                  label="입사일자"
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
                  label="퇴사일자"
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
            <Divider sx={{ my: 2 }} />
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
                  label="월 기본급"
                  type="text"
                  value={Number(monthlySalary).toLocaleString('ko-KR')}
                  onChange={handleMonthlySalaryChange}
                  onBlur={handleMonthlySalaryBlur}
                  fullWidth
                  margin="normal"
                />
              )}
              <Typography
                variant="body2"
                sx={{ padding: 1, width: '100%' }}
                align="right"
              >
                {convertedMonthlySalary} 원
              </Typography>
            </Grid>
            <Grid item xs={6}>
              {loading ? (
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={46}
                  animation="wave"
                />
              ) : (
                <TextField
                  label="연간 상여금"
                  type="text"
                  value={Number(annualBonus).toLocaleString('ko-KR')}
                  onChange={handleAnnualBonusChange}
                  onBlur={handleAnnualBonusBlur}
                  fullWidth
                  margin="normal"
                />
              )}
              <Typography
                variant="body2"
                sx={{ padding: 1, width: '100%' }}
                align="right"
              >
                {convertedAnnualBonus} 원
              </Typography>
            </Grid>
            <Grid item xs={6}>
              {loading ? (
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={46}
                  animation="wave"
                />
              ) : (
                <TextField
                  label="연차수당"
                  type="text"
                  value={Number(annualLeaveAllowance).toLocaleString('ko-KR')}
                  onChange={handleAnnualLeaveAllowanceChange}
                  onBlur={handleAnnualLeaveAllowanceBlur}
                  fullWidth
                  margin="normal"
                />
              )}
              <Typography
                variant="body2"
                sx={{ padding: 1, width: '100%' }}
                align="right"
              >
                {convertedAnnualLeaveAllowance} 원
              </Typography>
            </Grid>
          </Grid>
          <Box mt={2} display="flex" justifyContent="center" gap={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSearch}
              fullWidth
              disabled={loading}
            >
              조회
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default RetirementCalculator;
