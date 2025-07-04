import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  useMediaQuery,
  useTheme,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box
} from '@mui/material';
import {
  AccountCircle,
  Login,
  HowToReg,
  ExitToApp,
  PostAdd,
  Person,
  Close as CloseIcon
} from '@mui/icons-material';

const Navbar = () => {
  const { user, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [anchorEl, setAnchorEl] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const openMenu = Boolean(anchorEl);

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = async () => {
    handleMenuClose();
    await logout();
  };

  const handleOpenProfile = () => {
    handleMenuClose();
    setProfileOpen(true);
  };
  const handleCloseProfile = () => setProfileOpen(false);

  return (
    <>
      <AppBar position="static" elevation={0} sx={{ bgcolor: 'primary.main' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Brand */}
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              textDecoration: 'none',
              color: 'inherit',
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            Sky Blog
          </Typography>

          {/* Avatar / Account Icon */}
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleMenuOpen}
            size={isMobile ? 'large' : 'medium'}
          >
            {user ? (
              <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32 }}>
                {user.name.charAt(0).toUpperCase()}
              </Avatar>
            ) : (
              <AccountCircle fontSize={isMobile ? 'large' : 'medium'} />
            )}
          </IconButton>

          {/* Dropdown Menu */}
          <Menu
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            PaperProps={{ sx: { mt: 1, minWidth: 160 } }}
          >
            {user ? (
              <>
                <MenuItem onClick={handleOpenProfile}>
                  <ListItemIcon>
                    <Person fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Profile</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleMenuClose} component={Link} to="/posts">
                  <ListItemIcon>
                    <PostAdd fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Posts</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <ExitToApp fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Logout</ListItemText>
                </MenuItem>
              </>
            ) : (
              <>
                <MenuItem onClick={handleMenuClose} component={Link} to="/login">
                  <ListItemIcon>
                    <Login fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Login</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleMenuClose} component={Link} to="/register">
                  <ListItemIcon>
                    <HowToReg fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Register</ListItemText>
                </MenuItem>
              </>
            )}
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Profile Dialog */}
      <Dialog open={profileOpen} onClose={handleCloseProfile}>
        <DialogTitle>
          Your Profile
          <IconButton
            aria-label="close"
            onClick={handleCloseProfile}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <Avatar sx={{ bgcolor: 'secondary.main', width: 56, height: 56 }}>
              {user?.name.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h6">{user?.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.email}
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLogout} startIcon={<ExitToApp />}>
            Logout
          </Button>
          <Button onClick={handleCloseProfile}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Navbar;
