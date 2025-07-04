import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Box,
  Typography,
  TextField,
  Button,
  Container,
  Paper,
  Link as MuiLink,
  IconButton,
  InputAdornment,
  Fade,
  Alert,
  CircularProgress,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff,
  LockOutlined,
  EmailOutlined
} from '@mui/icons-material';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setError('');
  
  try {
    const { success, error } = await login({ email, password });
    
    if (success) {
      // Wait briefly to ensure state is updated
      await new Promise(resolve => setTimeout(resolve, 100));
      navigate('/posts');
    } else {
      setError(error || 'Login failed');
    }
  } catch (err) {
    setError( 'An unexpected error occurred');
  } finally {
    setIsLoading(false);
    
  }
};
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container maxWidth="xs" sx={{ py: isMobile ? 2 : 4 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: isMobile ? 3 : 4,
          borderRadius: 4,
          background: 'linear-gradient(to bottom right, #f5f5f5, #ffffff)'
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <LockOutlined 
            sx={{ 
              fontSize: 40, 
              color: 'primary.main',
              bgcolor: 'primary.light',
              p: 1,
              borderRadius: '50%'
            }} 
          />
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              mt: 2,
              fontWeight: 700,
              background: 'linear-gradient(to right, #1976d2, #2196f3)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Welcome Back
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Please enter your credentials to login
          </Typography>
        </Box>

        {error && (
          <Fade in={!!error}>
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          </Fade>
        )}

        <Box 
          component="form" 
          onSubmit={handleSubmit}
          sx={{ 
            '& .MuiTextField-root': { mb: 2 },
            '& .MuiButton-root': { py: 1.5, borderRadius: 2 }
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailOutlined color="primary" />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
          />

          <TextField
            fullWidth
            variant="outlined"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlined color="primary" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
          />

          <Box sx={{ textAlign: 'right', mb: 2 }}>
            <MuiLink 
              component={Link} 
              to="/forgot-password" 
              variant="body2"
              sx={{ textDecoration: 'none' }}
            >
              Forgot password?
            </MuiLink>
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isLoading}
            sx={{
              mt: 1,
              background: 'linear-gradient(to right, #1976d2, #2196f3)',
              '&:hover': {
                background: 'linear-gradient(to right, #1565c0, #1e88e5)',
              }
            }}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Sign In'
            )}
          </Button>
        </Box>

        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Don't have an account?{' '}
            <MuiLink 
              component={Link} 
              to="/register" 
              sx={{ 
                fontWeight: 600,
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              Sign up
            </MuiLink>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;