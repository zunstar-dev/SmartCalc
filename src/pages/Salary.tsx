import React, { FC, useState, useEffect } from 'react';
import { Box, Button, TextField, Fab, Tooltip, Skeleton } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Helmet } from 'react-helmet-async';
import { useSalary } from '../context/SalaryContext';
import { useAuth } from '../context/AuthContext';
import { saveSalaries } from '../firebase/Firebase';
import DeleteButton from '../components/button/DeleteButton';

const Salary: FC = () => {
  const { user } = useAuth();
  const { salaries, setSalaries } = useSalary();
  const [localSalaries, setLocalSalaries] = useState<string[]>([]);
  const [firstSalary, setFirstSalary] = useState<string>('');

  useEffect(() => {
    if (salaries.length > 0) {
      setLocalSalaries(salaries);
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
  };

  const handleRefresh = () => {
    setFirstSalary('');
    setLocalSalaries(salaries);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const updatedSalaries = firstSalary
      ? [firstSalary, ...localSalaries]
      : localSalaries;
    setSalaries(updatedSalaries);
    await saveSalaries(user.uid, updatedSalaries);
    setFirstSalary('');
  };

  const handleDelete = async (index: number) => {
    const newSalaries = localSalaries.filter((_, i) => i !== index);
    setLocalSalaries(newSalaries);
    setSalaries(newSalaries);
    await saveSalaries(user.uid, newSalaries);
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
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            label="내 연봉"
            value={
              firstSalary ? Number(firstSalary).toLocaleString('ko-KR') : ''
            }
            onChange={(e) => handleFirstSalaryChange(e.target.value)}
            fullWidth
            type="text"
          />
        </Box>
        {localSalaries.length > 0 ? (
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
        ) : (
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
                  variant="circular"
                  width={40}
                  height={40}
                  animation="wave"
                />
              </Box>
            ))}
          </>
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
