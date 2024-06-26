import React, { FC, useEffect, useState } from 'react';
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
import { RetirementInfoData, RetirementInfoRequest } from '../types/Retirement';

const RetirementInfo: FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [retirementInfoData, setRetirementInfoData] =
    useState<RetirementInfoData>({
      startDate: '',
      endDate: '',
      employmentDays: 0,
      monthlySalary: '0',
      convertedMonthlySalary: '0',
      annualBonus: '0',
      convertedAnnualBonus: '0',
      annualLeaveAllowance: '0',
      convertedAnnualLeaveAllowance: '0',
      averageDailyWage: 0,
      normalDailyWage: 0,
      retirementPay: 0,
      retirementOption: true,
    });

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
        calculatedMonthlySalary = retirementInfoData.retirementOption
          ? recentSalary / 12
          : recentSalary / 13;
      }

      setRetirementInfoData({
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
      setLoading(false);
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
          setRetirementInfoData((prevInfo) => ({
            ...prevInfo,
            retirementOption: retirementData.retirementOption ?? true,
          }));
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
          calculatedMonthlySalary = retirementInfoData.retirementOption
            ? recentSalary / 12
            : recentSalary / 13;
        }

        setRetirementInfoData((prevInfo) => ({
          ...prevInfo,
          startDate: start,
          endDate: end,
          employmentDays: retirementData?.employmentDays || 0,
          monthlySalary:
            retirementData?.monthlySalary?.toString() ||
            calculatedMonthlySalary.toString(),
          convertedMonthlySalary: convertToKoreanCurrency(
            retirementData?.monthlySalary?.toString() ||
              calculatedMonthlySalary.toString()
          ),
          annualBonus: retirementData?.annualBonus?.toString() || '0',
          convertedAnnualBonus: convertToKoreanCurrency(
            retirementData?.annualBonus?.toString() || '0'
          ),
          annualLeaveAllowance:
            retirementData?.annualLeaveAllowance?.toString() || '0',
          convertedAnnualLeaveAllowance: convertToKoreanCurrency(
            retirementData?.annualLeaveAllowance?.toString() || '0'
          ),
          averageDailyWage: retirementData?.averageDailyWage || 0,
          normalDailyWage: retirementData?.normalDailyWage || 0,
          retirementPay: retirementData?.retirementPay || 0,
        }));
        setLoading(false);
      }
    };

    loadData();
  }, [user, retirementInfoData.retirementOption]);

  const handleSave = async () => {
    if (user) {
      const retirementInfoRequest: RetirementInfoRequest = {
        startDate: retirementInfoData.startDate,
        endDate: retirementInfoData.endDate,
        employmentDays: retirementInfoData.employmentDays,
        monthlySalary: Number(retirementInfoData.monthlySalary),
        annualBonus: Number(retirementInfoData.annualBonus),
        annualLeaveAllowance: Number(retirementInfoData.annualLeaveAllowance),
        averageDailyWage: retirementInfoData.averageDailyWage,
        normalDailyWage: retirementInfoData.normalDailyWage,
        retirementPay: retirementInfoData.retirementPay,
        retirementOption: retirementInfoData.retirementOption,
      };
      await saveRetirementInfo(user.uid, retirementInfoRequest);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numberValue = value.replace(/\D/g, '');

    setRetirementInfoData((prevInfo) => ({
      ...prevInfo,
      [name]: numberValue,
      [`converted${name.charAt(0).toUpperCase() + name.slice(1)}`]:
        convertToKoreanCurrency(numberValue),
    }));
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (value === '') {
      setRetirementInfoData((prevInfo) => ({
        ...prevInfo,
        [name]: '0',
        [`converted${name.charAt(0).toUpperCase() + name.slice(1)}`]: '0',
      }));
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
          <CardContent sx={{ padding: '16px !important' }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6}>
                {loading ? (
                  <Skeleton variant="rectangular" width="100%" height={46} />
                ) : (
                  <TextField
                    label="입사일자"
                    type="date"
                    name="startDate"
                    value={retirementInfoData.startDate}
                    onChange={(e) =>
                      setRetirementInfoData((prevInfo) => ({
                        ...prevInfo,
                        startDate: e.target.value,
                      }))
                    }
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
                    name="endDate"
                    value={retirementInfoData.endDate}
                    onChange={(e) =>
                      setRetirementInfoData((prevInfo) => ({
                        ...prevInfo,
                        endDate: e.target.value,
                      }))
                    }
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
                      name="monthlySalary"
                      value={
                        retirementInfoData.monthlySalary
                          ? Number(
                              retirementInfoData.monthlySalary
                            ).toLocaleString('ko-KR')
                          : ''
                      }
                      onChange={handleInputChange}
                      onBlur={handleInputBlur}
                      fullWidth
                      margin="normal"
                      inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                    />
                    <Typography
                      variant="body2"
                      sx={{ padding: 1, width: '100%' }}
                      align="right"
                    >
                      {retirementInfoData.convertedMonthlySalary} 원
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
                      name="annualBonus"
                      value={
                        retirementInfoData.annualBonus
                          ? Number(
                              retirementInfoData.annualBonus
                            ).toLocaleString('ko-KR')
                          : ''
                      }
                      onChange={handleInputChange}
                      onBlur={handleInputBlur}
                      fullWidth
                      margin="normal"
                      inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                    />
                    <Typography
                      variant="body2"
                      sx={{ padding: 1, width: '100%' }}
                      align="right"
                    >
                      {retirementInfoData.convertedAnnualBonus} 원
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
                      name="annualLeaveAllowance"
                      value={
                        retirementInfoData.annualLeaveAllowance
                          ? Number(
                              retirementInfoData.annualLeaveAllowance
                            ).toLocaleString('ko-KR')
                          : ''
                      }
                      onChange={handleInputChange}
                      onBlur={handleInputBlur}
                      fullWidth
                      margin="normal"
                      inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                    />
                    <Typography
                      variant="body2"
                      sx={{ padding: 1, width: '100%' }}
                      align="right"
                    >
                      {retirementInfoData.convertedAnnualLeaveAllowance} 원
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
