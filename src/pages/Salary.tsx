import React, { FC, useState, useRef, useEffect } from 'react';
import { Box, Button, TextField, Fab, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';

const SalaryForm: FC = () => {
  const [salaries, setSalaries] = useState<string[]>(['']);
  const bottomRef = useRef<HTMLDivElement>(null);

  const handleSalaryChange = (index: number, value: string) => {
    const newSalaries = [...salaries];
    newSalaries[index] = value;
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
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        maxWidth: 400,
        margin: 'auto',
        mt: 5,
      }}
    >
      {salaries.map((salary, index) => (
        <TextField
          key={index}
          label={`내 연봉 ${index + 1}`}
          value={salary}
          onChange={(e) => handleSalaryChange(index, e.target.value)}
          fullWidth
          type="number"
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
  );
};

export default SalaryForm;
