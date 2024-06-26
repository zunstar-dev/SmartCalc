import { useState, useEffect, FC } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  IconButton,
  Skeleton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Helmet } from 'react-helmet-async';
import { loadSalaryInfo, saveSalaryInfo } from '../../services/SalaryService';
import { useAuth } from '../../context/AuthContext';
import { SalaryData } from '../../types/salary';
import { convertToKoreanCurrency } from '../../helpers/common';

const SalaryInfo: FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [salaryData, setSalaryData] = useState<SalaryData>({
    retirementOption: true,
    dependents: 1,
    children: 0,
    nonTaxableAmount: '200000',
    convertedNonTaxableAmount: '200000',
    taxReduction: false,
  });

  useEffect(() => {
    if (user) {
      loadSalaryInfo(user.uid).then((data) => {
        if (data) {
          setSalaryData({
            retirementOption: data.retirementOption ?? true,
            dependents: data.dependents ?? 1,
            children: data.children ?? 0,
            nonTaxableAmount: data.nonTaxableAmount?.toString() ?? '200000',
            convertedNonTaxableAmount: convertToKoreanCurrency(
              data.nonTaxableAmount?.toString() ?? '200000'
            ),
            taxReduction: data.taxReduction ?? false,
          });
        }
        setLoading(false);
      });
    }
  }, [user]);

  const handleSave = async () => {
    if (user) {
      const {
        retirementOption,
        dependents,
        children,
        nonTaxableAmount,
        taxReduction,
      } = salaryData;
      const infoToSave = {
        retirementOption,
        dependents,
        children,
        nonTaxableAmount: Number(nonTaxableAmount) || 0,
        taxReduction,
      };
      await saveSalaryInfo(user.uid, infoToSave);
    }
  };

  const increaseDependents = () => {
    setSalaryData((prevInfo) => ({
      ...prevInfo,
      dependents: prevInfo.dependents + 1,
    }));
  };

  const decreaseDependents = () => {
    setSalaryData((prevInfo) => {
      const newDependents =
        prevInfo.dependents > 1 ? prevInfo.dependents - 1 : 1;
      const newChildren =
        prevInfo.children >= newDependents
          ? newDependents - 1
          : prevInfo.children;
      return {
        ...prevInfo,
        dependents: newDependents,
        children: newChildren,
      };
    });
  };

  const increaseChildren = () => {
    setSalaryData((prevInfo) => {
      if (prevInfo.children < prevInfo.dependents - 1) {
        return {
          ...prevInfo,
          children: prevInfo.children + 1,
        };
      }
      return prevInfo;
    });
  };

  const decreaseChildren = () => {
    setSalaryData((prevInfo) => ({
      ...prevInfo,
      children: prevInfo.children > 0 ? prevInfo.children - 1 : 0,
    }));
  };

  const handleNonTaxableAmountChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    if (value === '') {
      setSalaryData((prevInfo) => ({
        ...prevInfo,
        nonTaxableAmount: '',
        convertedNonTaxableAmount: '',
      }));
    } else {
      const numberValue = Number(value.replace(/\D/g, ''));
      setSalaryData((prevInfo) => ({
        ...prevInfo,
        nonTaxableAmount: numberValue.toString(),
        convertedNonTaxableAmount: convertToKoreanCurrency(
          numberValue.toString()
        ),
      }));
    }
  };

  const handleNonTaxableAmountBlur = () => {
    if (salaryData.nonTaxableAmount === '') {
      setSalaryData((prevInfo) => ({
        ...prevInfo,
        nonTaxableAmount: '0',
        convertedNonTaxableAmount: '0',
      }));
    }
  };

  return (
    <>
      <Helmet>
        <title>연봉 정보 | 나의 연봉 계산기</title>
        <meta name="description" content="연봉 정보를 확인하세요." />
        <meta property="og:title" content="연봉 정보 | 나의 연봉 계산기" />
        <meta property="og:description" content="연봉 정보를 확인하세요." />
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
            <Box mb={2}>
              <FormControl component="fieldset" fullWidth>
                <FormLabel component="legend">
                  <Typography variant="body2">퇴직금</Typography>
                </FormLabel>
                {loading ? (
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height={46}
                    animation="wave"
                  />
                ) : (
                  <RadioGroup
                    row
                    value={salaryData.retirementOption ? 'true' : 'false'}
                    onChange={(e) =>
                      setSalaryData((prevInfo) => ({
                        ...prevInfo,
                        retirementOption: e.target.value === 'true',
                      }))
                    }
                  >
                    <FormControlLabel
                      value="true"
                      control={<Radio />}
                      label="별도"
                    />
                    <FormControlLabel
                      value="false"
                      control={<Radio />}
                      label="포함"
                    />
                  </RadioGroup>
                )}
              </FormControl>
            </Box>
            <Box mb={2}>
              <FormControl component="fieldset" fullWidth>
                <FormLabel component="legend">
                  <Typography variant="body2">소득세 감면 대상자</Typography>
                </FormLabel>
                {loading ? (
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height={46}
                    animation="wave"
                  />
                ) : (
                  <RadioGroup
                    row
                    value={salaryData.taxReduction ? 'true' : 'false'}
                    onChange={(e) =>
                      setSalaryData((prevInfo) => ({
                        ...prevInfo,
                        taxReduction: e.target.value === 'true',
                      }))
                    }
                  >
                    <FormControlLabel
                      value="true"
                      control={<Radio />}
                      label="예"
                    />
                    <FormControlLabel
                      value="false"
                      control={<Radio />}
                      label="아니오"
                    />
                  </RadioGroup>
                )}
              </FormControl>
            </Box>
            <Box mb={2}>
              <FormControl component="fieldset" fullWidth>
                <FormLabel component="legend">
                  <Typography variant="body2">부양가족수</Typography>
                </FormLabel>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  {loading ? (
                    <Skeleton
                      variant="rectangular"
                      width="100%"
                      height={46}
                      animation="wave"
                    />
                  ) : (
                    <>
                      <IconButton
                        color="primary"
                        disabled={salaryData.dependents <= 1} // 1명 이하로 줄일 수 없음
                        onClick={decreaseDependents}
                      >
                        <RemoveIcon />
                      </IconButton>
                      <Typography variant="body2" display="inline">
                        {salaryData.dependents}
                      </Typography>
                      <IconButton color="primary" onClick={increaseDependents}>
                        <AddIcon />
                      </IconButton>
                    </>
                  )}
                </Box>
              </FormControl>
            </Box>
            <Box mb={2}>
              <FormControl component="fieldset" fullWidth>
                <FormLabel component="legend">
                  <Typography variant="body2">20세 이하 자녀수</Typography>
                </FormLabel>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  {loading ? (
                    <Skeleton
                      variant="rectangular"
                      width="100%"
                      height={46}
                      animation="wave"
                    />
                  ) : (
                    <>
                      <IconButton
                        color="primary"
                        disabled={salaryData.children <= 0}
                        onClick={decreaseChildren}
                      >
                        <RemoveIcon />
                      </IconButton>
                      <Typography variant="body2" display="inline">
                        {salaryData.children}
                      </Typography>
                      <IconButton
                        color="primary"
                        disabled={
                          salaryData.children >= salaryData.dependents - 1
                        } // 자녀수가 부양가족수를 초과할 수 없음
                        onClick={increaseChildren}
                      >
                        <AddIcon />
                      </IconButton>
                    </>
                  )}
                </Box>
              </FormControl>
            </Box>
            {loading ? (
              <Skeleton
                variant="rectangular"
                width="100%"
                height={46}
                animation="wave"
              />
            ) : (
              <Box mb={2}>
                <TextField
                  label="비과세액(식대포함)(월)"
                  type="text"
                  value={
                    salaryData.nonTaxableAmount
                      ? Number(salaryData.nonTaxableAmount).toLocaleString(
                          'ko-KR'
                        )
                      : ''
                  }
                  onChange={handleNonTaxableAmountChange}
                  onBlur={handleNonTaxableAmountBlur}
                  fullWidth
                  margin="normal"
                  inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                />
                <Typography
                  variant="body2"
                  sx={{ padding: 1, width: '100%' }}
                  align="right"
                >
                  {salaryData.convertedNonTaxableAmount} 원
                </Typography>
              </Box>
            )}

            <Grid container spacing={2} sx={{ marginTop: 1 }}>
              <Grid item xs={12}>
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
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </>
  );
};

export default SalaryInfo;
