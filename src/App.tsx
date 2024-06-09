import React, { useEffect } from 'react';
import { Container, Typography, Button, AppBar, Toolbar } from '@mui/material';
import { analytics } from './firebase';

const App: React.FC = () => {
  useEffect(() => {
    if (analytics) {
      console.log('Firebase Analytics is initialized');
      // analytics 관련 작업 수행
    }
  }, []);

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">My MUI Project</Typography>
        </Toolbar>
      </AppBar>
      <Container>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome to My MUI Project
        </Typography>
        <Button variant="contained" color="primary">
          Hello World
        </Button>
      </Container>
    </div>
  );
};

export default App;
