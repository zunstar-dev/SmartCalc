// src/pages/CompanyInfo.tsx
import { useState, useEffect, FC } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Skeleton,
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../context/AuthContext';
import {
  loadCompanyInfo,
  saveCompanyInfo,
} from '../services/CompanyInfoService';

const CompanyInfo: FC = () => {
  const { user } = useAuth();
  const [joinDate, setJoinDate] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (user) {
      loadCompanyInfo(user.uid).then((data) => {
        if (data) {
          setJoinDate(data.joinDate || '');
          setLoading(false);
        }
      });
    }
  }, [user]);

  const handleSave = async () => {
    if (user) {
      const companyInfo = {
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
          <CardContent sx={{ padding: '16px !important' }}>
            <Grid item xs={12} sm={6}>
              {loading ? (
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={46}
                  animation="wave"
                />
              ) : (
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
              )}

              <Grid item xs={12} mt={1}>
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
