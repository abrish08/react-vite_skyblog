import React from 'react';
import { useAuth } from '../context/AuthContext';
import Posts from './Posts';
 // adjust path to your login component
import { CircularProgress, Box, Typography } from '@mui/material';
import Login from './Login';

const Home = () => {
  const { user, loading } = useAuth();

  // While auth state is initializing, show a spinner
  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return user ? (
    <Box maxWidth={800} mx="auto" p={2}>
      <Typography variant="h4" gutterBottom>
        Welcome, {user.name}!
      </Typography>
      <Posts />
    </Box>
  ) : (
    <Login />
  );
};

export default Home;
