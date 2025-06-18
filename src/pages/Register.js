import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Alert,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useRole } from '../context/RoleContext';
import { ROLES } from '../context/RoleContext';

const testUsers = [
  {
    role: 'Заказчик',
    email: 'admin1@test.com',
    password: 'admin1',
    description: 'Тестовый аккаунт заказчика'
  },
  {
    role: 'Исполнитель',
    email: 'admin2@test.com',
    password: 'admin2',
    description: 'Тестовый аккаунт исполнителя'
  }
];

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register } = useAuth();
  const { setRole } = useRole();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    role: location.state?.defaultRole || ''
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

    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    if (!formData.role) {
      setError('Пожалуйста, выберите роль');
      return;
    }

    try {
      await register(formData.email, formData.password, formData.name);
      setRole(formData.role);
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
          Регистрация
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
            id="name"
            label="Имя"
            name="name"
            autoComplete="name"
            autoFocus
            value={formData.name}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
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
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Подтвердите пароль"
            type="password"
            id="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          <FormControl fullWidth margin="normal" required>
            <InputLabel id="role-select-label">Роль</InputLabel>
            <Select
              labelId="role-select-label"
              id="role"
              name="role"
              value={formData.role}
              label="Роль"
              onChange={handleChange}
            >
              <MenuItem value={ROLES.CUSTOMER}>Заказчик</MenuItem>
              <MenuItem value={ROLES.EXECUTOR}>Исполнитель</MenuItem>
            </Select>
          </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Зарегистрироваться
          </Button>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Уже есть аккаунт?
            </Typography>
            <Button
              component={Link}
              to="/login"
              variant="text"
              sx={{ mt: 1 }}
            >
              Войти в систему
            </Button>
          </Box>
        </Box>

        {/* Тестовые аккаунты */}
        <Paper sx={{ mt: 4, p: 2, width: '100%', bgcolor: 'background.default' }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Тестовые аккаунты:
          </Typography>
          {testUsers.map((user, index) => (
            <Box key={index} sx={{ mb: 1 }}>
              <Typography variant="caption" color="text.secondary" display="block">
                {user.role}:
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block">
                Email: {user.email}
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block">
                Пароль: {user.password}
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                {user.description}
              </Typography>
            </Box>
          ))}
        </Paper>
      </Box>
    </Container>
  );
};

export default Register; 