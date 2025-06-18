import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Brush as BrushIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  Group as GroupIcon,
  MonetizationOn as MonetizationOnIcon,
  Support as SupportIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../context/RoleContext';

const GradientButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #FF6B00 30%, #FF8E53 90%)',
  color: 'white',
  padding: '12px 30px',
  fontSize: '1.1rem',
  '&:hover': {
    background: 'linear-gradient(45deg, #FF8E53 30%, #FF6B00 90%)',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 20px rgba(255, 107, 0, 0.3)',
  },
  transition: 'all 0.3s ease',
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  background: 'rgba(45, 45, 45, 0.95)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 107, 0, 0.2)',
  borderRadius: '15px',
  height: '100%',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 32px rgba(255, 107, 0, 0.2)',
    border: '1px solid rgba(255, 107, 0, 0.4)',
  },
}));

const Home = () => {
  const theme = useTheme();
  const isMobile = useTheme().breakpoints.down('sm');
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleFindProject = () => {
    navigate('/register', { state: { defaultRole: ROLES.EXECUTOR } });
  };

  const handleFindExecutor = () => {
    navigate('/register', { state: { defaultRole: ROLES.CUSTOMER } });
  };

  const features = [
    {
      icon: <BrushIcon sx={{ fontSize: 40, color: '#FF6B00' }} />,
      title: 'Профессиональные дизайнеры',
      description: 'Доступ к талантливым дизайнерам с проверенным портфолио и опытом работы'
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 40, color: '#FF6B00' }} />,
      title: 'Быстрая реализация',
      description: 'Оперативное выполнение проектов с соблюдением всех сроков и требований'
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40, color: '#FF6B00' }} />,
      title: 'Безопасность',
      description: 'Гарантированная защита ваших данных и интеллектуальной собственности'
    },
    {
      icon: <GroupIcon sx={{ fontSize: 40, color: '#FF6B00' }} />,
      title: 'Сообщество',
      description: 'Активное сообщество профессионалов для обмена опытом и знаниями'
    },
    {
      icon: <MonetizationOnIcon sx={{ fontSize: 40, color: '#FF6B00' }} />,
      title: 'Прозрачные цены',
      description: 'Четкая система ценообразования без скрытых платежей и комиссий'
    },
    {
      icon: <SupportIcon sx={{ fontSize: 40, color: '#FF6B00' }} />,
      title: 'Поддержка 24/7',
      description: 'Круглосуточная техническая поддержка и помощь в решении вопросов'
    }
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        pt: { xs: 8, md: 12 },
        pb: { xs: 8, md: 12 },
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center" sx={{ mb: 8 }}>
          <Grid item xs={12} md={6}>
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 'bold',
                mb: 2,
                background: 'linear-gradient(45deg, #FF6B00 30%, #FF8E53 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Digital Design Platform
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: 'rgba(255, 255, 255, 0.7)',
                mb: 4,
                lineHeight: 1.5,
              }}
            >
              Платформа для поиска профессиональных дизайнеров и реализации ваших проектов
            </Typography>
            {!user && (
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <GradientButton
                  size="large"
                  onClick={handleFindProject}
                >
                  Найти заказ
                </GradientButton>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={handleFindExecutor}
                  sx={{
                    color: 'white',
                    borderColor: 'rgba(255, 107, 0, 0.5)',
                    '&:hover': {
                      borderColor: '#FF6B00',
                      background: 'rgba(255, 107, 0, 0.1)',
                    },
                  }}
                >
                  Найти исполнителя
                </Button>
              </Box>
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src="/images/logo.svg"
              alt="Digital Design Platform Logo"
              sx={{
                width: '100%',
                height: 'auto'
              }}
            />
          </Grid>
        </Grid>

        <Typography
          variant="h3"
          component="h2"
          sx={{
            textAlign: 'center',
            mb: 6,
            fontWeight: 'bold',
            color: 'white',
          }}
        >
          Почему выбирают нас
        </Typography>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <FeatureCard>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography
                    variant="h6"
                    component="h3"
                    sx={{
                      mb: 2,
                      color: 'white',
                      fontWeight: 'bold',
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      lineHeight: 1.6,
                    }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </FeatureCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Home; 