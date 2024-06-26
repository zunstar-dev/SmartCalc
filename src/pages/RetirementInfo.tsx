import React, { useState, useEffect, FC } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Divider,
  Skeleton,
  Typography,
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../context/AuthContext';
import {
  saveRetirementInfo,
  loadRetirementInfo,
  deleteRetirementInfo,
} from '../services/RetirementService';
import { loadCompanyInfo } from '../services/CompanyInfoService';
import { loadSalaries } from '../services/SalaryService';
import { format, addYears, subDays } from 'date-fns';
import { RetirementInfoRequest } from '../types/Retirement';

interface RetirementInfo {
  startDate: string;
  endDate: string;
  employmentDays: number;
  monthlySalary: string;
  convertedMonthlySalary: string;
  annualBonus: string;
  convertedAnnualBonus: string;
  annualLeaveAllowance: string;
  convertedAnnualLeaveAllowance: string;
  averageDailyWage: number;
  normalDailyWage: number;
  retirementPay: number;
  retirementOption: boolean;
}

const RetirementInfo: FC = () => {
  const { user } = useAuth();
  const [retirementInfo, setRetirementInfo] = useState<RetirementInfo>({
    startDate: '',
    endDate: '',
    employmentDays: 0,
    monthlySalary: '',
    convertedMonthlySalary: '',
    annualBonus: '',
    convertedAnnualBonus: '',
    annualLeaveAllowance: '',
    convertedAnnualLeaveAllowance: '',
    averageDailyWage: 0,
    normalDailyWage: 0,
    retirementPay: 0,
    retirementOption: true,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [employmentDays, setEmploymentDays] = useState<number>(0);
  const [monthlySalary, setMonthlySalary] = useState<string>('0');
  const [convertedMonthlySalary, setConvertedMonthlySalary] =
    useState<string>('0');
  const [annualBonus, setAnnualBonus] = useState<string>('0');
  const [convertedAnnualBonus, setConvertedAnnualBonus] = useState<string>('0');
  const [annualLeaveAllowance, setAnnualLeaveAllowance] = useState<string>('0');
  const [convertedAnnualLeaveAllowance, setConvertedAnnualLeaveAllowance] =
    useState<string>('0');
  const [averageDailyWage, setAverageDailyWage] = useState<number>(0);
  const [normalDailyWage, setNormalDailyWage] = useState<number>(0);
  const [retirementPay, setRetirementPay] = useState<number>(0);
  const [retirementOption, setRetirementOption] = useState<boolean>(true); // true: 별도, false: 포함

  const resetFields = async () => {
    if (user) {
      await deleteRetirementInfo(user.uid);

      let start = '';
      const companyData = await loadCompanyInfo(user.uid);
      if (companyData?.joinDate) {
        start = companyData.joinDate;
      } else {
        const now = new Date();
        start = format(now, 'yyyy-MM-dd');
      }

      const oneYearLater = subDays(addYears(new Date(start), 1), 1);
      let calculatedMonthlySalary = 0;
      const salaries = await loadSalaries(user.uid);
      if (salaries.length > 0) {
        const recentSalary = salaries[0];
        calculatedMonthlySalary = retirementOption
          ? recentSalary / 12
          : recentSalary / 13;
      }

      setRetirementInfo({
        startDate: start,
        endDate: format(oneYearLater, 'yyyy-MM-dd'),
        employmentDays: 0,
        monthlySalary: calculatedMonthlySalary.toString(),
        convertedMonthlySalary: convertToKoreanCurrency(
          calculatedMonthlySalary.toString()
        ),
        annualBonus: '0',
        convertedAnnualBonus: '0',
        annualLeaveAllowance: '0',
        convertedAnnualLeaveAllowance: '0',
        averageDailyWage: 0,
        normalDailyWage: 0,
        retirementPay: 0,
        retirementOption: true,
      });
    }
  };

  useEffect(() => {
    const loadData = async () => {
      if (user) {
        let start: string = '';
        let end: string = '';
        let calculatedMonthlySalary = 0;

        // 1순위: 퇴직 정보에서 시작 날짜 및 퇴직 날짜 가져오기
        const retirementData = await loadRetirementInfo(user.uid);
        if (retirementData) {
          start = retirementData.startDate || start;
          end = retirementData.endDate || end;
          setRetirementOption(retirementData.retirementOption ?? true);
        }

        // 2순위: 회사 정보에서 입사일 가져오기
        if (!start) {
          const companyData = await loadCompanyInfo(user.uid);
          if (companyData?.joinDate) {
            start = companyData.joinDate;
          }
        }

        // 3순위: 현재 날짜 설정
        if (!start) {
          const now = new Date();
          start = format(now, 'yyyy-MM-dd');
        }

        // 현재 날짜에서 1년 후의 날짜 설정
        if (!end) {
          end = format(subDays(addYears(new Date(start), 1), 1), 'yyyy-MM-dd');
        }

        const salaries = await loadSalaries(user.uid);
        if (salaries.length > 0) {
          const recentSalary = salaries[0];
          calculatedMonthlySalary = retirementOption
            ? recentSalary / 12
            : recentSalary / 13;
        }

        setStartDate(start);
        setEndDate(end);
        setEmploymentDays(retirementData?.employmentDays || 0);
        setMonthlySalary(
          retirementData?.monthlySalary?.toString() ||
            calculatedMonthlySalary.toString()
        );
        setConvertedMonthlySalary(
          convertToKoreanCurrency(
            retirementData?.monthlySalary?.toString() ||
              calculatedMonthlySalary.toString()
          )
        );
        setAnnualBonus(retirementData?.annualBonus?.toString() || '0');
        setConvertedAnnualBonus(
          convertToKoreanCurrency(
            retirementData?.annualBonus?.toString() || '0'
          )
        );
        setAnnualLeaveAllowance(
          retirementData?.annualLeaveAllowance?.toString() || '0'
        );
        setConvertedAnnualLeaveAllowance(
          convertToKoreanCurrency(
            retirementData?.annualLeaveAllowance?.toString() || '0'
          )
        );
        setAverageDailyWage(retirementData?.averageDailyWage || 0);
        setNormalDailyWage(retirementData?.normalDailyWage || 0);
        setRetirementPay(retirementData?.retirementPay || 0);
        setLoading(false);
      }
    };

    loadData();
  }, [user, retirementOption]);

  const handleSave = async () => {
    if (user) {
      const retirementInfo: RetirementInfoRequest = {
        startDate,
        endDate,
        employmentDays,
        monthlySalary: Number(monthlySalary),
        annualBonus: Number(annualBonus),
        annualLeaveAllowance: Number(annualLeaveAllowance),
        averageDailyWage,
        normalDailyWage,
        retirementPay,
        retirementOption,
      };
      await saveRetirementInfo(user.uid, retirementInfo);
    }
  };

  const handleMonthlySalaryChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    if (value === '') {
      setMonthlySalary(''); // 빈 문자열을 허용
      setConvertedMonthlySalary('');
    } else {
      const numberValue = Number(value.replace(/\D/g, '')); // 숫자가 아닌 문자는 제거
      setMonthlySalary(numberValue.toString());
      setConvertedMonthlySalary(
        convertToKoreanCurrency(numberValue.toString())
      );
    }
  };

  const handleAnnualBonusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      setAnnualBonus(''); // 빈 문자열을 허용
      setConvertedAnnualBonus('');
    } else {
      const numberValue = Number(value.replace(/\D/g, '')); // 숫자가 아닌 문자는 제거
      setAnnualBonus(numberValue.toString());
      setConvertedAnnualBonus(convertToKoreanCurrency(numberValue.toString()));
    }
  };

  const handleAnnualLeaveAllowanceChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    if (value === '') {
      setAnnualLeaveAllowance(''); // 빈 문자열을 허용
      setConvertedAnnualLeaveAllowance('');
    } else {
      const numberValue = Number(value.replace(/\D/g, '')); // 숫자가 아닌 문자는 제거
      setAnnualLeaveAllowance(numberValue.toString());
      setConvertedAnnualLeaveAllowance(
        convertToKoreanCurrency(numberValue.toString())
      );
    }
  };

  const handleMonthlySalaryBlur = () => {
    if (monthlySalary === '') {
      setMonthlySalary('0'); // 입력 필드가 포커스를 잃을 때 기본값 설정
      setConvertedMonthlySalary('0');
    }
  };

  const handleAnnualBonusBlur = () => {
    if (annualBonus === '') {
      setAnnualBonus('0'); // 입력 필드가 포커스를 잃을 때 기본값 설정
      setConvertedAnnualBonus('0');
    }
  };

  const handleAnnualLeaveAllowanceBlur = () => {
    if (annualLeaveAllowance === '') {
      setAnnualLeaveAllowance('0'); // 입력 필드가 포커스를 잃을 때 기본값 설정
      setConvertedAnnualLeaveAllowance('0');
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

  return (
    <>
      <Helmet>
        <title>퇴직 정보 입력 | 나의 연봉 계산기</title>
        <meta name="description" content="퇴직 정보를 입력하세요." />
        <meta property="og:title" content="퇴직 정보 입력 | 나의 연봉 계산기" />
        <meta property="og:description" content="퇴직 정보를 입력하세요." />
      </Helmet>
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
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6}>
                {loading ? (
                  <Skeleton variant="rectangular" width="100%" height={46} />
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
              <Grid item xs={12} sm={6}>
                {loading ? (
                  <Skeleton variant="rectangular" width="100%" height={46} />
                ) : (
                  <TextField
                    label="퇴직일자"
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
            </Grid>
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12}>
                {loading ? (
                  <Skeleton variant="rectangular" width="100%" height={46} />
                ) : (
                  <Box mb={2}>
                    <TextField
                      label="월급 (세전)"
                      type="text"
                      value={
                        monthlySalary
                          ? Number(monthlySalary).toLocaleString('ko-KR')
                          : ''
                      }
                      onChange={handleMonthlySalaryChange}
                      onBlur={handleMonthlySalaryBlur}
                      fullWidth
                      margin="normal"
                      inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                    />
                    <Typography
                      variant="body2"
                      sx={{ padding: 1, width: '100%' }}
                      align="right"
                    >
                      {convertedMonthlySalary} 원
                    </Typography>
                  </Box>
                )}
              </Grid>
              <Grid item xs={6}>
                {loading ? (
                  <Skeleton variant="rectangular" width="100%" height={46} />
                ) : (
                  <Box mb={2}>
                    <TextField
                      label="연간 상여금"
                      type="text"
                      value={
                        annualBonus
                          ? Number(annualBonus).toLocaleString('ko-KR')
                          : ''
                      }
                      onChange={handleAnnualBonusChange}
                      onBlur={handleAnnualBonusBlur}
                      fullWidth
                      margin="normal"
                      inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                    />
                    <Typography
                      variant="body2"
                      sx={{ padding: 1, width: '100%' }}
                      align="right"
                    >
                      {convertedAnnualBonus} 원
                    </Typography>
                  </Box>
                )}
              </Grid>
              <Grid item xs={6}>
                {loading ? (
                  <Skeleton variant="rectangular" width="100%" height={46} />
                ) : (
                  <Box mb={2}>
                    <TextField
                      label="연차수당"
                      type="text"
                      value={
                        annualLeaveAllowance
                          ? Number(annualLeaveAllowance).toLocaleString('ko-KR')
                          : ''
                      }
                      onChange={handleAnnualLeaveAllowanceChange}
                      onBlur={handleAnnualLeaveAllowanceBlur}
                      fullWidth
                      margin="normal"
                      inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                    />
                    <Typography
                      variant="body2"
                      sx={{ padding: 1, width: '100%' }}
                      align="right"
                    >
                      {convertedAnnualLeaveAllowance} 원
                    </Typography>
                  </Box>
                )}
              </Grid>
            </Grid>
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={6}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSave}
                  fullWidth
                  disabled={loading}
                >
                  저장
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={resetFields}
                  fullWidth
                  disabled={loading}
                >
                  초기화
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </>
  );
};

export default RetirementInfo;
