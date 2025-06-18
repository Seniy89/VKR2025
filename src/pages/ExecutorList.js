import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  TextField,
  Chip,
  Rating,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const ExecutorList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('rating');

  // Временные данные для демонстрации
  const executors = [
    {
      id: 1,
      name: 'Иван Петров',
      rating: 4.8,
      completedProjects: 15,
      skills: ['React', 'Node.js', 'MongoDB'],
      category: 'Веб-разработка',
      avatar: 'https://via.placeholder.com/150'
    },
    {
      id: 2,
      name: 'Анна Сидорова',
      rating: 4.9,
      completedProjects: 23,
      skills: ['UI/UX', 'Figma', 'Adobe XD'],
      category: 'Дизайн',
      avatar: 'https://via.placeholder.com/150'
    },
    // Добавьте больше исполнителей по необходимости
  ];

  const categories = [
    'Все категории',
    'Веб-разработка',
    'Мобильная разработка',
    'Дизайн',
    'Тексты и переводы',
    'SEO и маркетинг'
  ];

  const filteredExecutors = executors.filter(executor => {
    const matchesSearch = executor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      executor.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = category === '' || category === 'Все категории' || executor.category === category;
    return matchesSearch && matchesCategory;
  });

  const sortedExecutors = [...filteredExecutors].sort((a, b) => {
    if (sortBy === 'rating') {
      return b.rating - a.rating;
    }
    return b.completedProjects - a.completedProjects;
  });

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Исполнители
        </Typography>

        <Box sx={{ mb: 4 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Поиск по имени или навыкам"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Категория</InputLabel>
                <Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  label="Категория"
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Сортировка</InputLabel>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  label="Сортировка"
                >
                  <MenuItem value="rating">По рейтингу</MenuItem>
                  <MenuItem value="projects">По количеству проектов</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>

        <Grid container spacing={3}>
          {sortedExecutors.map((executor) => (
            <Grid item xs={12} sm={6} md={4} key={executor.id}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={executor.avatar}
                  alt={executor.name}
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {executor.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Rating value={executor.rating} precision={0.1} readOnly />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      ({executor.rating})
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Выполнено проектов: {executor.completedProjects}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Категория: {executor.category}
                  </Typography>
                  <Box sx={{ mt: 2, mb: 2 }}>
                    {executor.skills.map((skill, index) => (
                      <Chip
                        key={index}
                        label={skill}
                        size="small"
                        sx={{ mr: 1, mb: 1 }}
                      />
                    ))}
                  </Box>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => {/* TODO: Добавить логику просмотра профиля */}}
                  >
                    Просмотреть профиль
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default ExecutorList; 