import React from 'react';
import { Container, Typography, Button, Stack } from '@mui/material';
import { Link } from 'react-router-dom';

const Home: React.FC = () => (
  <Container maxWidth="sm" sx={{ mt: 8 }}>
    <Typography variant="h3" gutterBottom align="center">
      Digital Design Platform
    </Typography>
    <Typography variant="h6" align="center" gutterBottom>
      Платформа для взаимодействия заказчиков и исполнителей в сфере digital-дизайна
    </Typography>
    <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 4 }}>
      <Button variant="contained" component={Link} to="/login">Вход</Button>
      <Button variant="outlined" component={Link} to="/register">Регистрация</Button>
      <Button variant="text" component={Link} to="/projects">Проекты</Button>
    </Stack>
  </Container>
);

export default Home; 