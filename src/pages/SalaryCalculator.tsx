import { FC, useEffect, useState } from 'react';
import { Box, Typography, Skeleton } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { useSalary } from '../context/SalaryContext';
import { useLayout } from '../context/LayoutContext';

const SalaryCalculator: FC = () => {
  const { salaries } = useSalary();
  const { loading, setLoading } = useLayout();
  const [takeHomeSalary, setTakeHomeSalary] = useState<number | null>(null); // 실수령액 상태
  const [breakdown, setBreakdown] = useState<any>(null); // 급여 내역 상태
  const [taxTable, setTaxTable] = useState<any>(null); // 세금 테이블 상태

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
    const nonTaxableAmount = 200000; // 비과세액 (기본 20만 원)
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
            {takeHomeSalary !== null && breakdown && (
              <>
                <Typography variant="h6">
                  가장 최근 연봉: {Number(salaries[0]).toLocaleString('ko-KR')}{' '}
                  원
                </Typography>

                <Box sx={{ marginTop: 4 }}>
                  <Typography variant="h6">계산 결과</Typography>
                  <Typography variant="h6">
                    월 예상 실수령액: {takeHomeSalary.toLocaleString()} 원
                  </Typography>
                  <Typography>
                    국민연금: {breakdown.nationalPension.toLocaleString()} 원
                  </Typography>
                  <Typography>
                    건강보험: {breakdown.healthInsurance.toLocaleString()} 원
                  </Typography>
                  <Typography>
                    장기요양보험: {breakdown.longTermCare.toLocaleString()} 원
                  </Typography>
                  <Typography>
                    고용보험: {breakdown.employmentInsurance.toLocaleString()}{' '}
                    원
                  </Typography>
                  <Typography>
                    소득세: {breakdown.incomeTax.toLocaleString()} 원
                  </Typography>
                  <Typography>
                    지방소득세: {breakdown.localIncomeTax.toLocaleString()} 원
                  </Typography>
                  <Typography variant="h6">
                    합계 금액:{' '}
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
                </Box>
              </>
            )}
          </>
        ) : (
          <Typography variant="h6">
            연봉 정보가 없습니다. 연봉을 등록해주세요.
          </Typography>
        )}
      </Box>
    </>
  );
};

export default SalaryCalculator;
