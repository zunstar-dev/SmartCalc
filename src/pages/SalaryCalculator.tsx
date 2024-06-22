import { FC, useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Skeleton,
  Card,
  CardContent,
  Grid,
  Button,
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { useSalary } from '../context/SalaryContext';
import { useLayout } from '../context/LayoutContext';
import { useNavigate } from 'react-router-dom';

const SalaryCalculator: FC = () => {
  const { salaries } = useSalary();
  const { loading, setLoading } = useLayout();
  const [takeHomeSalary, setTakeHomeSalary] = useState<number | null>(null); // 실수령액 상태
  const [breakdown, setBreakdown] = useState<any>(null); // 급여 내역 상태
  const [taxTable, setTaxTable] = useState<any>(null); // 세금 테이블 상태
  const [nonTaxableAmount] = useState<number>(200000); // 비과세액 상태
  const navigate = useNavigate();

  // 컴포넌트가 마운트될 때 세금 테이블을 가져옴
  useEffect(() => {
    fetch('/taxTable.json')
      .then((response) => response.json())
      .then((data) => setTaxTable(data))
      .catch((error) => console.error('Error loading tax table:', error));
  }, []);

  // 연봉과 세금 테이블이 준비되었을 때 계산 함수 호출
  useEffect(() => {
    if (salaries.length > 0 && taxTable && !loading) {
      const recentSalary = Number(salaries[0]);
      calculateTakeHomeSalary(recentSalary, 1, 0); // 자녀 수를 0명으로 가정
      setLoading(false);
    }
  }, [salaries, taxTable, loading, setLoading]);

  // 실수령액 계산 함수
  const calculateTakeHomeSalary = (
    annualSalary: number,
    numDependents: number,
    numChildren: number
  ) => {
    const monthlySalary = Math.floor(annualSalary / 12); // 월 급여 계산
    const taxableIncome = Math.floor(
      (annualSalary - nonTaxableAmount * 12) / 12
    ); // 과세 소득 계산

    // 국민연금, 건강보험, 장기요양보험, 고용보험 계산
    const nationalPension = Math.floor(Math.min(taxableIncome * 0.045, 548100));
    const healthInsurance = Math.floor(taxableIncome * 0.03545);
    const longTermCare = Math.floor(healthInsurance * 0.1295);
    const employmentInsurance = Math.floor(taxableIncome * 0.009);

    // 총 보험료 계산
    const totalInsurance =
      nationalPension + healthInsurance + longTermCare + employmentInsurance;

    // 소득세 및 지방소득세 계산
    const { incomeTax, localIncomeTax } = calculateTax(
      taxableIncome,
      numDependents,
      numChildren
    );

    // 실수령액 계산
    const takeHomeSalary =
      monthlySalary - totalInsurance - incomeTax - localIncomeTax;

    // 상태 업데이트
    setTakeHomeSalary(takeHomeSalary);
    setBreakdown({
      monthlySalary,
      nationalPension,
      healthInsurance,
      longTermCare,
      employmentInsurance,
      incomeTax,
      localIncomeTax,
    });
  };

  // 소득세 및 지방소득세 계산 함수
  const calculateTax = (
    taxableIncome: number,
    numDependents: number,
    numChildren: number
  ) => {
    if (!taxTable || taxableIncome < 1060000) {
      return { incomeTax: 0, localIncomeTax: 0 };
    }

    // 월 급여를 치환 규칙에 따라 변환 (월급 100000000 원까지는 데이터 가능)
    const adjustedIncome = adjustIncome(taxableIncome);
    const taxData = taxTable[adjustedIncome] || {};

    let incomeTax = taxData[numDependents] || 0;

    // 자녀 공제 적용
    const childDeduction = calculateChildDeduction(numChildren);
    incomeTax = Math.max(0, incomeTax - childDeduction);

    const localIncomeTax = Math.floor(incomeTax * 0.1);

    return {
      incomeTax,
      localIncomeTax,
    };
  };

  // 월 급여를 치환 규칙에 따라 변환하는 함수
  const adjustIncome = (income: number) => {
    if (income < 1060000) return income;
    if (income < 1500000) return Math.floor(income / 5000) * 5000;
    if (income < 3000000) return Math.floor(income / 10000) * 10000;
    return Math.floor(income / 20000) * 20000;
  };

  // 자녀 공제 계산 함수
  const calculateChildDeduction = (numChildren: number) => {
    if (numChildren === 1) return 12500;
    if (numChildren === 2) return 29160;
    if (numChildren > 2) return 29160 + (numChildren - 2) * 25000;
    return 0;
  };

  return (
    <>
      <Helmet>
        <title>연봉 실수령액 | 나의 연봉 계산기</title>
        <meta
          name="description"
          content="연봉 계산기를 통해 실수령액을 계산하세요."
        />
        <meta property="og:title" content="연봉 실수령액 | 나의 연봉 계산기" />
        <meta
          property="og:description"
          content="연봉 계산기를 통해 실수령액을 계산하세요."
        />
      </Helmet>
      <Box>
        {loading ? (
          <Skeleton variant="rectangular" width="100%" height={300} />
        ) : salaries.length > 0 ? (
          <>
            <Card
              sx={{
                maxWidth: 600,
                margin: 'auto',
                marginBottom: 2,
              }}
            >
              <CardContent
                sx={{
                  paddingBottom: '16px !important',
                }}
              >
                <Box>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography
                        variant="body2"
                        sx={{ fontSize: 16, fontWeight: 'bold' }}
                      >
                        연봉
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        variant="body2"
                        align="right"
                        sx={{ fontSize: 16, fontWeight: 'bold' }}
                      >
                        {Number(salaries[0]).toLocaleString('ko-KR')} 원
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            </Card>
            <Card sx={{ maxWidth: 600, margin: 'auto' }}>
              <CardContent>
                {takeHomeSalary !== null && breakdown && (
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography
                        variant="body2"
                        sx={{ fontSize: 16, fontWeight: 'bold' }}
                      >
                        월 예상 실수령액
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        variant="body2"
                        align="right"
                        sx={{ fontSize: 16, fontWeight: 'bold' }}
                      >
                        {takeHomeSalary.toLocaleString()} 원
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2">비과세</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" align="right">
                        {nonTaxableAmount} 원
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2">국민연금</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" align="right">
                        {breakdown.nationalPension.toLocaleString()} 원
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2">건강보험</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" align="right">
                        {breakdown.healthInsurance.toLocaleString()} 원
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2">장기요양보험</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" align="right">
                        {breakdown.longTermCare.toLocaleString()} 원
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2">고용보험</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" align="right">
                        {breakdown.employmentInsurance.toLocaleString()} 원
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2">소득세</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" align="right">
                        {breakdown.incomeTax.toLocaleString()} 원
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2">지방소득세</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" align="right">
                        {breakdown.localIncomeTax.toLocaleString()} 원
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography sx={{ fontSize: 16, fontWeight: 'bold' }}>
                        합계 금액
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        sx={{ fontSize: 16, fontWeight: 'bold' }}
                        align="right"
                      >
                        {(
                          breakdown.nationalPension +
                          breakdown.healthInsurance +
                          breakdown.longTermCare +
                          breakdown.employmentInsurance +
                          breakdown.incomeTax +
                          breakdown.localIncomeTax
                        ).toLocaleString()}{' '}
                        원
                      </Typography>
                    </Grid>
                  </Grid>
                )}
              </CardContent>
            </Card>
          </>
        ) : (
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
              onClick={() => navigate('/')}
            >
              연봉 등록하러가기
            </Button>
          </Box>
        )}
      </Box>
    </>
  );
};

export default SalaryCalculator;
