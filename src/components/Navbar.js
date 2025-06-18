import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useAuth } from '../context/AuthContext';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'rgba(26, 26, 26, 0.8)',
  backdropFilter: 'blur(10px)',
  borderBottom: '1px solid rgba(255, 107, 0, 0.2)',
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #FF6B00 30%, #FF8E53 90%)',
  color: 'white',
  '&:hover': {
    background: 'linear-gradient(45deg, #FF8E53 30%, #FF6B00 90%)',
  },
}));

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Ошибка при выходе:', error);
    }
    handleClose();
  };

  const handleProfile = () => {
    navigate('/profile');
    handleClose();
  };

  return (
    <StyledAppBar position="fixed">
      <Toolbar>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'white',
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #FF6B00 30%, #FF8E53 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Digital Design Platform
        </Typography>

        {user ? (
          <>
            <IconButton
              onClick={handleMenu}
              sx={{ ml: 2 }}
            >
              <Avatar
                src={user.avatar}
                alt={user.firstName}
                sx={{
                  width: 40,
                  height: 40,
                  border: '2px solid #FF6B00',
                }}
              />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              PaperProps={{
                sx: {
                  background: 'rgba(45, 45, 45, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 107, 0, 0.2)',
                  mt: 1,
                }
              }}
            >
              <MenuItem onClick={handleProfile} sx={{ color: 'white' }}>
                Профиль
              </MenuItem>
              <MenuItem onClick={handleLogout} sx={{ color: 'white' }}>
                Выйти
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              component={RouterLink}
              to="/login"
              sx={{ color: 'white' }}
            >
              Войти
            </Button>
            <GradientButton
              component={RouterLink}
              to="/register"
              variant="contained"
            >
              Регистрация
            </GradientButton>
          </Box>
        )}
      </Toolbar>
    </StyledAppBar>
  );
};

export default Navbar; 