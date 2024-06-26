import { FC, useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Skeleton,
  Card,
  CardContent,
  Grid,
  Button,
  Tooltip,
  IconButton,
  Modal,
} from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { loadSalaries, loadSalaryInfo } from '../../services/SalaryService';
import { useAuth } from '../../context/AuthContext';
import CloseButton from '../../components/button/CloseButton';

const SalaryCalculator: FC = () => {
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

  const [open, setOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');

  const [loading, setLoading] = useState<boolean>(true);
  const [salaries, setSalaries] = useState<number[]>([]);

  useEffect(() => {
    if (user) {
      loadSalaries(user.uid).then((loadedSalaries: number[]) => {
        if (loadedSalaries) {
          setSalaries(loadedSalaries);
          setLoading(false);
        }
      });
    }
  }, [user]);

  const handleOpen = (content: string) => {
    setModalContent(content);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

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
      taxableIncome,
      dependents,
      children
    );

    const takeHomeSalary =
      monthlySalary - totalInsurance - incomeTax - localIncomeTax;

    setTakeHomeSalary(takeHomeSalary);
    setBreakdown({
      monthlySalary,
      taxableIncome,
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
              <CardContent sx={{ padding: '16px !important' }}>
                {takeHomeSalary !== null && breakdown && (
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{ fontSize: 16, fontWeight: 'bold' }}
                        >
                          월 예상 실수령액
                        </Typography>
                        <Tooltip title="월 예상 실수령액에 대한 설명" arrow>
                          <IconButton
                            size="small"
                            onClick={() =>
                              handleOpen(
                                '월 예상 실수령액은 세금 및 공제 후의 월간 순소득입니다.'
                              )
                            }
                          >
                            <HelpOutlineIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        variant="body2"
                        align="right"
                        sx={{
                          fontSize: 16,
                          fontWeight: 'bold',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                        }}
                      >
                        {takeHomeSalary.toLocaleString()} 원
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <Typography variant="body2">급여</Typography>
                        <Tooltip title="급여에 대한 설명" arrow>
                          <IconButton
                            size="small"
                            onClick={() =>
                              handleOpen(
                                '급여는 퇴직금 별도일 경우 연봉을 12로 나눈 금액이며, 퇴직금 포함일 경우 연봉을 13으로 나눈 금액입니다.'
                              )
                            }
                          >
                            <HelpOutlineIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        variant="body2"
                        align="right"
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                        }}
                      >
                        {breakdown.monthlySalary.toLocaleString()} 원
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <Typography variant="body2">월 소득액</Typography>
                        <Tooltip title="월 소득액에 대한 설명" arrow>
                          <IconButton
                            size="small"
                            onClick={() =>
                              handleOpen(
                                '월 소득액은 급여 에서 비과세 항목을 제외한 월간 소득입니다.'
                              )
                            }
                          >
                            <HelpOutlineIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        variant="body2"
                        align="right"
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                        }}
                      >
                        {breakdown.taxableIncome.toLocaleString()} 원
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <Typography variant="body2">비과세</Typography>
                        <Tooltip title="비과세 항목에 대한 설명" arrow>
                          <IconButton
                            size="small"
                            onClick={() =>
                              handleOpen(
                                '비과세 항목은 세금이 부과되지 않는 항목으로, 주로 식대, 교통비 등이 포함됩니다.'
                              )
                            }
                          >
                            <HelpOutlineIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        variant="body2"
                        align="right"
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                        }}
                      >
                        {nonTaxableAmount.toLocaleString()} 원
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <Typography variant="body2">국민연금</Typography>
                        <Tooltip title="국민연금에 대한 설명" arrow>
                          <IconButton
                            size="small"
                            onClick={() =>
                              handleOpen(
                                '국민연금은 소득의 4.5%를 공제하여 납부합니다. 2024년 7월 1일부터 적용되는 상한액과 하한액은 다음과 같습니다. 상한액은 6,170,000원, 하한액은 390,000원입니다. 소득이 상한액을 초과할 경우 상한액을 기준으로, 하한액 미만일 경우 하한액을 기준으로 국민연금을 계산합니다.'
                              )
                            }
                          >
                            <HelpOutlineIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        variant="body2"
                        align="right"
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                        }}
                      >
                        {breakdown.nationalPension.toLocaleString()} 원
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <Typography variant="body2">건강보험</Typography>
                        <Tooltip title="건강보험에 대한 설명" arrow>
                          <IconButton
                            size="small"
                            onClick={() =>
                              handleOpen(
                                '건강보험은 소득의 3.545%를 공제하여 납부합니다.'
                              )
                            }
                          >
                            <HelpOutlineIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        variant="body2"
                        align="right"
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                        }}
                      >
                        {breakdown.healthInsurance.toLocaleString()} 원
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <Typography variant="body2">장기요양보험</Typography>
                        <Tooltip title="장기요양보험에 대한 설명" arrow>
                          <IconButton
                            size="small"
                            onClick={() =>
                              handleOpen(
                                '장기요양보험은 건강보험료의 12.95%를 추가로 공제하여 납부합니다.'
                              )
                            }
                          >
                            <HelpOutlineIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        variant="body2"
                        align="right"
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                        }}
                      >
                        {breakdown.longTermCare.toLocaleString()} 원
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <Typography variant="body2">고용보험</Typography>
                        <Tooltip title="고용보험에 대한 설명" arrow>
                          <IconButton
                            size="small"
                            onClick={() =>
                              handleOpen(
                                '고용보험은 소득의 0.9%를 공제하여 납부합니다.'
                              )
                            }
                          >
                            <HelpOutlineIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        variant="body2"
                        align="right"
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                        }}
                      >
                        {breakdown.employmentInsurance.toLocaleString()} 원
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <Typography variant="body2">
                          근로 소득세
                          <Tooltip title="소득세에 대한 설명" arrow>
                            <IconButton
                              size="small"
                              onClick={() =>
                                handleOpen(
                                  '근로 소득세는 간이세액 기준표를 근거로 산정됩니다. 또한, 8세 이상 20세 이하의 자녀 수에 따라 세액 공제가 적용됩니다.'
                                )
                              }
                            >
                              <HelpOutlineIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        variant="body2"
                        align="right"
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                        }}
                      >
                        {breakdown.incomeTax.toLocaleString()} 원
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <Typography variant="body2">
                          지방소득세
                          <Tooltip title="지방소득세에 대한 설명" arrow>
                            <IconButton
                              size="small"
                              onClick={() =>
                                handleOpen(
                                  '지방소득세는 소득세의 10%를 추가로 납부합니다.'
                                )
                              }
                            >
                              <HelpOutlineIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        variant="body2"
                        align="right"
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                        }}
                      >
                        {breakdown.localIncomeTax.toLocaleString()} 원
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <Typography sx={{ fontSize: 16, fontWeight: 'bold' }}>
                          합계 금액
                          <Tooltip title="합계 금액에 대한 설명" arrow>
                            <IconButton
                              size="small"
                              onClick={() =>
                                handleOpen(
                                  '합계 금액은 국민연금, 건강보험, 장기요양보험, 고용보험, 소득세, 지방소득세의 합계입니다.'
                                )
                              }
                            >
                              <HelpOutlineIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        align="right"
                        sx={{
                          fontSize: 16,
                          fontWeight: 'bold',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                        }}
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

export default SalaryCalculator;
