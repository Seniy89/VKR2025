import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Alert,
  Divider,
  Paper,
  Avatar
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useRole } from '../context/RoleContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { setRole } = useRole();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const user = await login(formData.email, formData.password);
      setRole(user.role);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
          Вход в систему
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
            {error}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            autoFocus
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Пароль"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Войти
          </Button>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Нет аккаунта?
            </Typography>
            <Button
              component={Link}
              to="/register"
              variant="text"
              sx={{ mt: 1 }}
            >
              Зарегистрироваться
            </Button>
          </Box>
        </Box>

        {/* Тестовые аккаунты */}
        <Paper sx={{ mt: 4, p: 2, width: '100%', bgcolor: 'background.default' }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Тестовые аккаунты:
          </Typography>
          <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar src="https://avatars.dicebear.com/api/identicon/testcustomer.svg" sx={{ width: 24, height: 24 }} />
            <Box>
              <Typography variant="caption" color="text.secondary" display="block">
                Заказчик:
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block">
                Email: testcustomer@test.com
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block">
                Пароль: testcustomer
              </Typography>
            </Box>
          </Box>
          <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar src="https://avatars.dicebear.com/api/identicon/testexecutor.svg" sx={{ width: 24, height: 24 }} />
            <Box>
              <Typography variant="caption" color="text.secondary" display="block">
                Исполнитель:
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block">
                Email: testexecutor@test.com
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block">
                Пароль: testexecutor
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login; 