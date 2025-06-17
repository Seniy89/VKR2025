import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, MenuItem } from '@mui/material';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('client');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: добавить логику регистрации
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Typography variant="h5" align="center" gutterBottom>Регистрация</Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          label="Имя"
          fullWidth
          margin="normal"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <TextField
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <TextField
          label="Пароль"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <TextField
          select
          label="Роль"
          fullWidth
          margin="normal"
          value={role}
          onChange={e => setRole(e.target.value)}
        >
          <MenuItem value="client">Заказчик</MenuItem>
          <MenuItem value="designer">Исполнитель</MenuItem>
        </TextField>
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
          Зарегистрироваться
        </Button>
      </Box>
    </Container>
  );
};

export default Register; 