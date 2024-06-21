import React, { FC, useState, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Fab,
  Tooltip,
  IconButton,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteIcon from '@mui/icons-material/Delete';
import { Helmet } from 'react-helmet-async';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, loadSalaries, saveSalaries } from '../firebase/Firebase';

const Salary: FC = () => {
  const [salaries, setSalaries] = useState<string[]>(['']);
  const [userId, setUserId] = useState<string | null>(null);
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        loadSalaries(user.uid).then((loadedSalaries) => {
          if (loadedSalaries.length === 0) {
            setSalaries(['']);
          } else {
            setSalaries(loadedSalaries);
          }
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSalaryChange = (index: number, value: string) => {
    const formattedValue = value.replace(/\D/g, '');
    const newSalaries = [...salaries];
    newSalaries[index] = formattedValue;
    setSalaries(newSalaries);
  };

  const handleRefresh = () => {
    setSalaries(['']);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (userId) {
      await saveSalaries(userId, salaries);
    }
    setSalaries(['', ...salaries]);
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDelete = async (index: number) => {
    const newSalaries = salaries.filter((_, i) => i !== index);
    setSalaries(newSalaries);
    if (userId) {
      await saveSalaries(userId, newSalaries);
    }
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
        ref={topRef}
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          margin: 'auto',
        }}
      >
        {salaries.map((salary, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
            <TextField
              label={`내 연봉 ${index + 1}`}
              value={salary ? Number(salary).toLocaleString('ko-KR') : ''}
              onChange={(e) => handleSalaryChange(index, e.target.value)}
              fullWidth
              type="text"
            />
            <IconButton onClick={() => handleDelete(index)}>
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}
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
