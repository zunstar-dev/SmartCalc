// src/pages/CompanyInfo.tsx
import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Grid, TextField, Button } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../context/AuthContext'; // Assuming you have an AuthContext
import {
  loadCompanyInfo,
  saveCompanyInfo,
} from '../services/CompanyInfoService';

const CompanyInfo: React.FC = () => {
  const { user } = useAuth(); // get current user info from context
  const [companyName, setCompanyName] = useState<string>('');
  const [joinDate, setJoinDate] = useState<string>('');

  useEffect(() => {
    if (user) {
      loadCompanyInfo(user.uid).then((data) => {
        if (data) {
          setCompanyName(data.companyName || '');
          setJoinDate(data.joinDate || '');
        }
      });
    }
  }, [user]);

  const handleSave = async () => {
    if (user) {
      const companyInfo = {
        companyName,
        joinDate,
      };
      await saveCompanyInfo(user.uid, companyInfo);
    }
  };

  return (
    <>
      <Helmet>
        <title>회사 정보 등록 | 나의 연봉 계산기</title>
        <meta name="description" content="회사 정보를 등록하세요." />
        <meta property="og:title" content="회사 정보 등록 | 나의 연봉 계산기" />
        <meta property="og:description" content="회사 정보를 등록하세요." />
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
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12}>
                <TextField
                  label="입사일"
                  type="date"
                  value={joinDate}
                  onChange={(e) => setJoinDate(e.target.value)}
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  margin="normal"
                />
              </Grid>
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

export default CompanyInfo;
