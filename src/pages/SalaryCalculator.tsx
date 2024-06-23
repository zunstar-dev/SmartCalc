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
import { useAuth } from '../context/AuthContext';
import { loadSalaryInfo } from '../firebase/Firebase';

const SalaryCalculator: FC = () => {
  const { salaries } = useSalary();
  const { loading, setLoading } = useLayout();
  const { user } = useAuth();
  const [takeHomeSalary, setTakeHomeSalary] = useState<number | null>(null);
  const [breakdown, setBreakdown] = useState<any>(null);
  const [taxTable, setTaxTable] = useState<any>(null);
  const [nonTaxableAmount, setNonTaxableAmount] = useState<number>(200000);
  const [retirementOption, setRetirementOption] = useState<boolean>(true);
  const [dependents, setDependents] = useState<number>(1);
  const [children, setChildren] = useState<number>(0);
  const [taxReduction, setTaxReduction] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/taxTable.json')
      .then((response) => response.json())
      .then((data) => setTaxTable(data))
      .catch((error) => console.error('Error loading tax table:', error));
  }, []);

  useEffect(() => {
    if (user) {
      loadSalaryInfo(user.uid).then((data) => {
        if (data) {
          setRetirementOption(data.retirementOption ?? true);
          setDependents(data.dependents ?? 1);
          setChildren(data.children ?? 0);
          setNonTaxableAmount(data.nonTaxableAmount ?? 200000);
          setTaxReduction(data.taxReduction ?? false);
        }
      });
    }
  }, [user]);

  useEffect(() => {
    if (salaries.length > 0 && taxTable && !loading) {
      const recentSalary = Number(salaries[0]);
      calculateTakeHomeSalary(recentSalary);
      setLoading(false);
    }
  }, [salaries, taxTable, loading, setLoading]);

  const calculateTakeHomeSalary = (annualSalary: number) => {
    const months = retirementOption ? 12 : 13;
    const monthlySalary = Math.floor(annualSalary / months);
    const taxableIncome = Math.floor(
      (annualSalary - nonTaxableAmount * months) / months
    );
    const upperLimit = 6170000;
    const lowerLimit = 3900000;

    const nationalPension = Math.floor(
      Math.min(
        Math.max(taxableIncome * 0.045, lowerLimit * 0.045),
        upperLimit * 0.045
      )
    );

    const healthInsurance = Math.floor(taxableIncome * 0.03545);
    const longTermCare = Math.floor(healthInsurance * 0.1295);
    const employmentInsurance = Math.floor(taxableIncome * 0.009);

    const totalInsurance =
      nationalPension + healthInsurance + longTermCare + employmentInsurance;

    const { incomeTax, localIncomeTax } = calculateTax(
      monthlySalary,
      dependents,
      children
    );

    const takeHomeSalary =
      monthlySalary - totalInsurance - incomeTax - localIncomeTax;

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

  const calculateTax = (
    monthlySalary: number,
    numDependents: number,
    numChildren: number
  ) => {
    let incomeTax = 0;
    let localIncomeTax = 0;

    if (monthlySalary <= 10000000) {
      const taxableIncome = adjustIncome(monthlySalary);
      const taxData = taxTable[taxableIncome] || {};
      incomeTax = taxData[numDependents] || 0;

      const childDeduction = calculateChildDeduction(numChildren);
      incomeTax = Math.max(0, incomeTax - childDeduction);

      if (taxReduction) {
        incomeTax = Math.floor(incomeTax * 0.1);
      }

      localIncomeTax = Math.floor(incomeTax * 0.1);
    } else {
      if (monthlySalary > 87000000) {
        incomeTax =
          31034600 + Math.floor((monthlySalary - 87000000) * 0.45 * 0.98);
      } else if (monthlySalary > 45000000) {
        incomeTax =
          13394600 + Math.floor((monthlySalary - 45000000) * 0.42 * 0.98);
      } else if (monthlySalary > 30000000) {
        incomeTax =
          7394600 + Math.floor((monthlySalary - 30000000) * 0.4 * 0.98);
      } else if (monthlySalary > 28000000) {
        incomeTax =
          6610600 + Math.floor((monthlySalary - 28000000) * 0.4 * 0.98);
      } else if (monthlySalary > 14000000) {
        incomeTax =
          1397000 + Math.floor((monthlySalary - 14000000) * 0.38 * 0.98);
      } else if (monthlySalary > 10000000) {
        incomeTax =
          25000 + Math.floor((monthlySalary - 10000000) * 0.98 * 0.35);
      }

      const defaultTaxData = taxTable[10000000] || {};
      const defaultIncomeTax = defaultTaxData[numDependents] || 0;
      const childDeduction = calculateChildDeduction(numChildren);

      incomeTax = incomeTax + defaultIncomeTax - childDeduction;
      localIncomeTax = Math.floor(incomeTax * 0.1);
    }

    return {
      incomeTax,
      localIncomeTax,
    };
  };

  const adjustIncome = (income: number) => {
    if (income < 1060000) return income;
    if (income < 1500000) return Math.floor(income / 5000) * 5000;
    if (income < 3000000) return Math.floor(income / 10000) * 10000;
    return Math.floor(income / 20000) * 20000;
  };

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
                        {nonTaxableAmount.toLocaleString()} 원
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
