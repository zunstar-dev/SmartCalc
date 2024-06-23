import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../context/AuthContext'; // assuming you have an AuthContext
import { saveSalaryInfo, loadSalaryInfo } from '../firebase/Firebase';

const SalaryInfo: React.FC = () => {
  const { user } = useAuth(); // get current user info from context
  const [retirementOption, setRetirementOption] = useState<boolean>(true); // true: 별도, false: 포함
  const [dependents, setDependents] = useState<number>(1); // 기본값 1명
  const [children, setChildren] = useState<number>(0);
  const [nonTaxableAmount, setNonTaxableAmount] = useState<string>('200000');
  const [taxReduction, setTaxReduction] = useState<boolean>(false); // true: 예, false: 아니오

  useEffect(() => {
    if (user) {
      loadSalaryInfo(user.uid).then((data) => {
        if (data) {
          setRetirementOption(data.retirementOption ?? true); // 기본값 true (별도)
          setDependents(data.dependents ?? 1); // 기본값 1명
          setChildren(data.children ?? 0);
          setNonTaxableAmount(data.nonTaxableAmount?.toString() ?? '200000');
          setTaxReduction(data.taxReduction ?? false); // 기본값 true (예)
        }
      });
    }
  }, [user]);

  const handleSave = async () => {
    if (user) {
      const salaryInfo = {
        retirementOption,
        dependents,
        children,
        nonTaxableAmount: Number(nonTaxableAmount) || 0,
        taxReduction,
      };
      await saveSalaryInfo(user.uid, salaryInfo);
    }
  };

  const increaseDependents = () => {
    setDependents(dependents + 1);
  };

  const decreaseDependents = () => {
    if (dependents > 1) {
      setDependents(dependents - 1);
      if (children > dependents - 1) {
        setChildren(dependents - 1); // 자녀수가 부양가족수를 초과하지 않도록 조정
      }
    }
  };

  const increaseChildren = () => {
    if (children < dependents - 1) {
      // 자녀수가 부양가족수와 같지 않도록 함
      setChildren(children + 1);
    }
  };

  const decreaseChildren = () => {
    if (children > 0) {
      setChildren(children - 1);
    }
  };

  const handleNonTaxableAmountChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    if (value === '') {
      setNonTaxableAmount(''); // 빈 문자열을 허용
    } else {
      const numberValue = Number(value.replace(/\D/g, '')); // 숫자가 아닌 문자는 제거
      setNonTaxableAmount(numberValue.toString());
    }
  };

  const handleNonTaxableAmountBlur = () => {
    if (nonTaxableAmount === '') {
      setNonTaxableAmount('0'); // 입력 필드가 포커스를 잃을 때 기본값 설정
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
          <CardContent>
            <Box>
              <FormControl component="fieldset">
                <FormLabel component="legend">
                  <Typography variant="body2">퇴직금</Typography>
                </FormLabel>
                <RadioGroup
                  row
                  value={retirementOption ? 'true' : 'false'}
                  onChange={(e) =>
                    setRetirementOption(e.target.value === 'true')
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
              </FormControl>
            </Box>
            <Box>
              <FormControl component="fieldset">
                <FormLabel component="legend">
                  <Typography variant="body2">소득세 감면 대상자</Typography>
                </FormLabel>
                <RadioGroup
                  row
                  value={taxReduction ? 'true' : 'false'}
                  onChange={(e) => setTaxReduction(e.target.value === 'true')}
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
              </FormControl>
            </Box>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <Typography variant="body2">부양가족수:</Typography>
              </Grid>
              <Grid item>
                <IconButton
                  color="primary"
                  disabled={dependents <= 1} // 1명 이하로 줄일 수 없음
                  onClick={decreaseDependents}
                >
                  <RemoveIcon />
                </IconButton>
                <Typography variant="body2" display="inline">
                  {dependents}
                </Typography>
                <IconButton color="primary" onClick={increaseDependents}>
                  <AddIcon />
                </IconButton>
              </Grid>
            </Grid>

            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <Typography variant="body2">20세 이하 자녀수:</Typography>
              </Grid>
              <Grid item>
                <IconButton
                  color="primary"
                  disabled={children <= 0}
                  onClick={decreaseChildren}
                >
                  <RemoveIcon />
                </IconButton>
                <Typography variant="body2" display="inline">
                  {children}
                </Typography>
                <IconButton
                  color="primary"
                  disabled={children >= dependents - 1} // 자녀수가 부양가족수를 초과할 수 없음
                  onClick={increaseChildren}
                >
                  <AddIcon />
                </IconButton>
              </Grid>
            </Grid>

            <TextField
              label="비과세액(식대포함)(월)"
              type="text"
              value={nonTaxableAmount}
              onChange={handleNonTaxableAmountChange}
              onBlur={handleNonTaxableAmountBlur}
              fullWidth
              margin="normal"
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            />

            <Grid container spacing={2} sx={{ marginTop: 2 }}>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSave}
                  fullWidth
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
