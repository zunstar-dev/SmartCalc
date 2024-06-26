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
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { format, subMonths, differenceInCalendarDays } from 'date-fns';
import { loadRetirementInfo } from '../services/RetirementService';

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

  useEffect(() => {
    const loadData = async () => {
      if (user) {
        const retirementData = await loadRetirementInfo(user.uid);
        console.log(retirementData);
        if (retirementData) {
          setStartDate(retirementData.startDate || '');
          setEndDate(retirementData.endDate || '');
          const days = differenceInCalendarDays(
            new Date(retirementData.endDate),
            new Date(retirementData.startDate)
          );
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
            days
          );

          calculateLastThreeMonths(
            new Date(retirementData.endDate),
            retirementData.monthlySalary || 0
          );
        }
      }
    };

    loadData();
  }, [user]);

  const calculateRetirementPay = (
    baseSalary: number,
    bonus: number,
    annualLeavePay: number,
    days: number
  ) => {
    const last3MonthsSalary = [
      { days: 15, base: baseSalary / 2 },
      { days: 31, base: baseSalary },
      { days: 31, base: baseSalary },
      { days: 15, base: baseSalary / 2 },
    ];

    const totalDays = last3MonthsSalary.reduce(
      (sum, period) => sum + period.days,
      0
    );
    const totalBase = last3MonthsSalary.reduce(
      (sum, period) => sum + period.base,
      0
    );

    const A = totalBase;
    const B = (bonus * 3) / 12;
    const C = (annualLeavePay * 5 * 3) / 12;

    const averageDailyWage = Math.floor((A + B + C) / totalDays);

    const retirementPay = Math.floor(averageDailyWage * 30 * (days / 365));

    setExpectedRetirementPay(retirementPay);
    setAverageDailyWage(averageDailyWage);
  };

  const calculateLastThreeMonths = (endDate: Date, baseSalary: number) => {
    const periods = [];
    let currentEndDate = endDate;

    for (let i = 0; i < 3; i++) {
      const monthEnd = currentEndDate;
      const monthStart = subMonths(currentEndDate, 1);
      differenceInCalendarDays(monthEnd, monthStart) + 1;

      periods.unshift({
        period: `${format(monthStart, 'yyyy-MM-dd')} ~ ${format(monthEnd, 'yyyy-MM-dd')}`,
        salary: baseSalary,
      });

      currentEndDate = subMonths(currentEndDate, 1);
    }
  };

  const convertToKoreanCurrency = (num: string) => {
    if (!num) return '';
    const units = ['', '만', '억', '조', '경'];
    const numArr = num.split('').reverse();
    let result = '';
    for (let i = 0; i < numArr.length; i += 4) {
      const part = numArr
        .slice(i, i + 4)
        .reverse()
        .join('');
      if (part !== '0000') {
        result = `${parseInt(part, 10).toLocaleString()}${units[Math.floor(i / 4)]} ${result}`;
      }
    }
    return result.trim();
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

    calculateRetirementPay(baseSalary, bonus, annualLeavePay, days);

    calculateLastThreeMonths(new Date(endDate), baseSalary);
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
        <CardContent>
          <Divider sx={{ my: 2 }} />
          <Box mt={2}>
            <Typography variant="h6">
              예상 퇴직금: {expectedRetirementPay.toLocaleString('ko-KR')} 원
            </Typography>
            <Typography variant="h6">
              1일 평균 임금: {averageDailyWage.toLocaleString('ko-KR')} 원
            </Typography>
          </Box>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
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
            </Grid>
            <Grid item xs={12}>
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
            </Grid>
            <Divider sx={{ my: 2 }} />
            <Grid item xs={12}>
              <TextField
                label="월 기본급"
                type="text"
                value={Number(monthlySalary).toLocaleString('ko-KR')}
                onChange={handleMonthlySalaryChange}
                onBlur={handleMonthlySalaryBlur}
                fullWidth
                margin="normal"
              />
              <Typography
                variant="body2"
                sx={{ padding: 1, width: '100%' }}
                align="right"
              >
                {convertedMonthlySalary} 원
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="연간 상여금"
                type="text"
                value={Number(annualBonus).toLocaleString('ko-KR')}
                onChange={handleAnnualBonusChange}
                onBlur={handleAnnualBonusBlur}
                fullWidth
                margin="normal"
              />
              <Typography
                variant="body2"
                sx={{ padding: 1, width: '100%' }}
                align="right"
              >
                {convertedAnnualBonus} 원
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="연차수당"
                type="text"
                value={Number(annualLeaveAllowance).toLocaleString('ko-KR')}
                onChange={handleAnnualLeaveAllowanceChange}
                onBlur={handleAnnualLeaveAllowanceBlur}
                fullWidth
                margin="normal"
              />
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
