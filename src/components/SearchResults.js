import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Rating,
  Avatar,
  IconButton,
  Tooltip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import StarIcon from '@mui/icons-material/Star';
import WorkIcon from '@mui/icons-material/Work';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const ResultCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s ease',
  background: 'linear-gradient(135deg, #1E1E1E 0%, #2A2A2A 100%)',
  border: '1px solid rgba(255, 107, 0, 0.1)',
  '&:hover': {
    transform: 'translateY(-5px)',
    border: '1px solid rgba(255, 107, 0, 0.3)',
    boxShadow: '0 8px 16px rgba(255, 107, 0, 0.2)',
  },
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 64,
  height: 64,
  border: '2px solid #FF6B00',
}));

const SearchResults = ({ results, onFavoriteToggle }) => {
  // Временные данные для демонстрации
  const demoResults = [
    {
      id: 1,
      name: 'Анна Петрова',
      title: 'UI/UX Дизайнер',
      rating: 4.8,
      experience: 5,
      location: 'Москва',
      categories: ['UI/UX Design', 'Web Design'],
      hourlyRate: 2500,
      completedProjects: 42,
      isFavorite: false,
      avatar: 'https://i.pravatar.cc/150?img=1',
    },
    {
      id: 2,
      name: 'Иван Смирнов',
      title: 'Графический дизайнер',
      rating: 4.5,
      experience: 3,
      location: 'Санкт-Петербург',
      categories: ['Graphic Design', 'Branding'],
      hourlyRate: 2000,
      completedProjects: 28,
      isFavorite: true,
      avatar: 'https://i.pravatar.cc/150?img=2',
    },
    // Добавьте больше демо-данных по необходимости
  ];

  const resultsToShow = results || demoResults;

  return (
    <Grid container spacing={3}>
      {resultsToShow.map((result) => (
        <Grid item xs={12} sm={6} md={4} key={result.id}>
          <ResultCard>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <StyledAvatar src={result.avatar} alt={result.name} />
                  <Box>
                    <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                      {result.name}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                      {result.title}
                    </Typography>
                  </Box>
                </Box>
                <Tooltip title={result.isFavorite ? "Удалить из избранного" : "Добавить в избранное"}>
                  <IconButton
                    onClick={() => onFavoriteToggle && onFavoriteToggle(result.id)}
                    sx={{ color: result.isFavorite ? '#FF6B00' : 'inherit' }}
                  >
                    {result.isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                  </IconButton>
                </Tooltip>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Rating
                  value={result.rating}
                  precision={0.1}
                  readOnly
                  icon={<StarIcon fontSize="inherit" />}
                  emptyIcon={<StarIcon fontSize="inherit" />}
                />
                <Typography variant="body2" color="text.secondary">
                  ({result.rating})
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                {result.categories.map((category) => (
                  <Chip
                    key={category}
                    label={category}
                    size="small"
                    sx={{
                      backgroundColor: 'rgba(255, 107, 0, 0.1)',
                      color: '#FF6B00',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 107, 0, 0.2)',
                      },
                    }}
                  />
                ))}
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <WorkIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {result.experience} лет опыта
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <LocationOnIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {result.location}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
                  {result.hourlyRate} ₽/час
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {result.completedProjects} проектов
                </Typography>
              </Box>
            </CardContent>
          </ResultCard>
        </Grid>
      ))}
    </Grid>
  );
};

export default SearchResults; 