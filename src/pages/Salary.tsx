import React, { FC, useState, useRef, useEffect } from 'react';
import { Box, Button, TextField, Fab, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Helmet } from 'react-helmet-async';

const SalaryForm: FC = () => {
  const [salaries, setSalaries] = useState<string[]>(['']);
  const bottomRef = useRef<HTMLDivElement>(null);

  const handleSalaryChange = (index: number, value: string) => {
    const formattedValue = value.replace(/\D/g, ''); // Remove non-numeric characters
    const newSalaries = [...salaries];
    newSalaries[index] = formattedValue;
    setSalaries(newSalaries);
  };

  const handleAddSalaryInput = () => {
    setSalaries(['', ...salaries]); // 새로운 입력 창을 배열의 맨 앞에 추가
  };

  const handleRefresh = () => {
    setSalaries(['']);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log({ salaries });
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    // 여기서 연봉 데이터를 처리하는 로직을 추가하세요
  };

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [salaries]);

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
        {salaries.map((salary, index) => (
          <TextField
            key={index}
            label={`내 연봉 ${index + 1}`}
            value={salary ? Number(salary).toLocaleString('ko-KR') : ''}
            onChange={(e) => handleSalaryChange(index, e.target.value)}
            fullWidth
            type="text"
          />
        ))}
        <Button type="submit" variant="contained" color="primary">
          등록
        </Button>
        <Tooltip title="새로고침">
          <Fab
            color="secondary"
            aria-label="refresh"
            onClick={handleRefresh}
            sx={{
              position: 'fixed',
              bottom: 80,
              right: 16,
              color: 'white',
            }}
          >
            <RefreshIcon />
          </Fab>
        </Tooltip>
        <Tooltip title="추가">
          <Fab
            color="primary"
            aria-label="add"
            onClick={handleAddSalaryInput}
            sx={{
              position: 'fixed',
              bottom: 16,
              right: 16,
              color: 'white',
            }}
          >
            <AddIcon />
          </Fab>
        </Tooltip>
        <div ref={bottomRef} />
      </Box>
    </>
  );
};

export default SalaryForm;
