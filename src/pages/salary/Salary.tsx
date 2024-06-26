import React, { FC, useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Fab,
  Tooltip,
  Skeleton,
  Typography,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../../context/AuthContext';
import { loadSalaries, saveSalaries } from '../../services/SalaryService';
import DeleteButton from '../../components/button/DeleteButton';
import { SaveSalariesRequest } from '../../types/salary';
import { convertToKoreanCurrency } from '../../helpers/common';

const Salary: FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [salaries, setSalaries] = useState<number[]>([]);
  const [firstSalary, setFirstSalary] = useState<string>('');
  const [convertedFirstSalary, setConvertedFirstSalary] = useState<string>('');
  const [localSalaries, setLocalSalaries] = useState<string[]>([]);

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

  useEffect(() => {
    if (salaries.length > 0) {
      setLocalSalaries(salaries.map((salary) => salary.toString()));
    }
  }, [salaries]);

  const formatSalary = (value: string) => value.replace(/\D/g, '');

  const handleSalaryChange = (index: number, value: string) => {
    const formattedValue = formatSalary(value);
    const newSalaries = [...localSalaries];
    newSalaries[index] = formattedValue;
    setLocalSalaries(newSalaries);
  };

  const handleFirstSalaryChange = (value: string) => {
    const formattedValue = formatSalary(value);
    setFirstSalary(formattedValue);
    setConvertedFirstSalary(convertToKoreanCurrency(formattedValue));
  };

  const handleRefresh = () => {
    setFirstSalary('');
    setConvertedFirstSalary('');
    setLocalSalaries(salaries.map((salary) => salary.toString()));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const updatedSalaries = firstSalary
      ? [firstSalary, ...localSalaries]
      : localSalaries;

    // 문자열 배열을 숫자 배열로 변환
    const numericSalaries: SaveSalariesRequest = {
      salaries: updatedSalaries.map((salary) => parseInt(salary, 10)),
    };

    setSalaries(numericSalaries.salaries);
    await saveSalaries(user.uid, numericSalaries.salaries);
    setFirstSalary('');
    setConvertedFirstSalary('');
  };

  const handleDelete = async (index: number) => {
    const newSalaries = localSalaries.filter((_, i) => i !== index);
    setLocalSalaries(newSalaries);
  };

  return (
    <>
      <Helmet>
        <title>내 연봉 등록 | 나의 연봉 계산기</title>
        <meta
          name="description"
          content="연봉 계산기를 통해 내 연봉을 등록하고 계산하세요."
        />
        <meta property="og:title" content="내 연봉 등록 | 나의 연봉 계산기" />
        <meta
          property="og:description"
          content="연봉 계산기를 통해 내 연봉을 등록하고 계산하세요."
        />
      </Helmet>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          margin: 'auto',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          <TextField
            label="내 연봉"
            value={
              firstSalary ? Number(firstSalary).toLocaleString('ko-KR') : ''
            }
            onChange={(e) => handleFirstSalaryChange(e.target.value)}
            fullWidth
            type="text"
            inputProps={{ maxLength: 26 }}
          />
          <Typography
            variant="body2"
            sx={{ padding: 1, width: '100%' }}
            align="right"
          >
            {convertedFirstSalary} 원
          </Typography>
        </Box>
        {loading ? (
          <>
            {[...Array(3)].map((_, index) => (
              <Box
                key={index}
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={56}
                  animation="wave"
                />
                <Skeleton
                  variant="rectangular"
                  width={40}
                  height={40}
                  animation="wave"
                />
              </Box>
            ))}
          </>
        ) : (
          localSalaries.map((salary, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
              <TextField
                label={`내 연봉 ${index + 1}`}
                value={salary ? Number(salary).toLocaleString('ko-KR') : ''}
                onChange={(e) => handleSalaryChange(index, e.target.value)}
                fullWidth
                type="text"
                sx={{ marginRight: 1 }}
              />
              <DeleteButton onClick={() => handleDelete(index)} />
            </Box>
          ))
        )}
        <Button type="submit" variant="contained" color="primary">
          등록
        </Button>
        <Tooltip title="새로고침">
          <Fab
            color="primary"
            aria-label="refresh"
            onClick={handleRefresh}
            sx={{
              position: 'fixed',
              bottom: 24,
              right: 16,
              color: 'white',
            }}
          >
            <RefreshIcon />
          </Fab>
        </Tooltip>
      </Box>
    </>
  );
};

export default Salary;
