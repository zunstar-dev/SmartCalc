import React, { FC, useState, useRef } from 'react';
import { Box, Button, TextField, Fab, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Helmet } from 'react-helmet-async';

const SalaryForm: FC = () => {
  const [salaries, setSalaries] = useState<string[]>(['']);
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const handleSalaryChange = (index: number, value: string) => {
    const formattedValue = value.replace(/\D/g, ''); // Remove non-numeric characters
    const newSalaries = [...salaries];
    newSalaries[index] = formattedValue;
    setSalaries(newSalaries);
  };

  const handleAddSalaryInput = () => {
    setSalaries(['', ...salaries]); // 새로운 입력 창을 배열의 맨 앞에 추가
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleRefresh = () => {
    setSalaries(['']);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log({ salaries });
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
          paddingBottom: '80px', // 고정된 등록 버튼 공간 확보
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
        <div ref={bottomRef} />
      </Box>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        sx={{
          position: 'fixed',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'calc(100% - 32px)',
          maxWidth: '600px', // 최대 너비 설정
        }}
        onClick={handleSubmit}
      >
        등록
      </Button>
      <Tooltip title="새로고침">
        <Fab
          color="secondary"
          aria-label="refresh"
          onClick={handleRefresh}
          sx={{
            position: 'fixed',
            bottom: 144,
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
            bottom: 78,
            right: 16,
            color: 'white',
          }}
        >
          <AddIcon />
        </Fab>
      </Tooltip>
    </>
  );
};

export default SalaryForm;
