import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Box,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  CardMedia,
  Divider
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

// Настройка axios
axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.withCredentials = true;

const Portfolio = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPortfolio = async () => {
      // Если userId не указан в URL, используем ID текущего пользователя
      const targetUserId = userId || (user ? user.uid : null);

      if (!targetUserId) {
        setError('ID пользователя не указан');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`/portfolio/${targetUserId}`);
        setPortfolio(response.data);
      } catch (err) {
        console.error('Error fetching portfolio:', err);
        if (err.response?.status === 404) {
          setError('Портфолио не найдено');
        } else {
          setError('Ошибка при загрузке портфолио');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [userId, user]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
          {user && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/portfolio/create')}
            >
              Создать портфолио
            </Button>
          )}
        </Paper>
      </Container>
    );
  }

  if (!portfolio) {
    return null;
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Портфолио
        </Typography>

        <Grid container spacing={4}>
          {/* О себе */}
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom>
              О себе
            </Typography>
            <Typography variant="body1" paragraph>
              {portfolio.about || 'Информация отсутствует'}
            </Typography>
          </Grid>

          {/* Навыки */}
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom>
              Навыки
            </Typography>
            <Typography variant="body1" paragraph>
              {Array.isArray(portfolio.skills) ? portfolio.skills.join(', ') : 'Информация отсутствует'}
            </Typography>
          </Grid>

          {/* Опыт работы */}
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom>
              Опыт работы
            </Typography>
            <Typography variant="body1" paragraph>
              {portfolio.experience || 'Информация отсутствует'}
            </Typography>
          </Grid>

          {/* Образование */}
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom>
              Образование
            </Typography>
            <Typography variant="body1" paragraph>
              {portfolio.education || 'Информация отсутствует'}
            </Typography>
          </Grid>

          {/* Работы */}
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom>
              Мои работы
            </Typography>
            <Grid container spacing={3}>
              {portfolio.works.map((work, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Card>
                    {work.imageUrl && (
                      <CardMedia
                        component="img"
                        height="200"
                        image={work.imageUrl}
                        alt={work.title}
                        sx={{ objectFit: 'cover' }}
                      />
                    )}
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {work.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {work.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Portfolio; 