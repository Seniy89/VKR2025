import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import { Add as AddIcon, FilterList as FilterIcon } from '@mui/icons-material';

const ProjectList = () => {
  const navigate = useNavigate();
  const { projects } = useProjects();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || project.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Проекты
        </Typography>
        {user.role === 'client' && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/projects/new')}
          >
            Создать проект
          </Button>
        )}
      </Box>

      <Box sx={{ mb: 4, display: 'flex', gap: 2 }}>
        <TextField
          fullWidth
          label="Поиск проектов"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <IconButton onClick={handleFilterClick}>
          <FilterIcon />
        </IconButton>
        <Menu
          anchorEl={filterAnchorEl}
          open={Boolean(filterAnchorEl)}
          onClose={handleFilterClose}
        >
          <MenuItem>
            <FormControl fullWidth>
              <InputLabel>Статус</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Статус"
              >
                <MenuItem value="all">Все</MenuItem>
                <MenuItem value="open">Открытые</MenuItem>
                <MenuItem value="in_progress">В работе</MenuItem>
                <MenuItem value="completed">Завершенные</MenuItem>
              </Select>
            </FormControl>
          </MenuItem>
          <MenuItem>
            <FormControl fullWidth>
              <InputLabel>Категория</InputLabel>
              <Select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                label="Категория"
              >
                <MenuItem value="all">Все</MenuItem>
                <MenuItem value="web">Веб-разработка</MenuItem>
                <MenuItem value="mobile">Мобильная разработка</MenuItem>
                <MenuItem value="design">Дизайн</MenuItem>
                <MenuItem value="marketing">Маркетинг</MenuItem>
              </Select>
            </FormControl>
          </MenuItem>
        </Menu>
      </Box>

      <Grid container spacing={3}>
        {filteredProjects.map((project) => (
          <Grid item xs={12} sm={6} md={4} key={project.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  transition: 'transform 0.2s ease-in-out',
                },
              }}
              onClick={() => navigate(`/projects/${project.id}`)}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {project.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {project.description.substring(0, 100)}...
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <Chip
                    label={project.status}
                    color={
                      project.status === 'open'
                        ? 'success'
                        : project.status === 'in_progress'
                        ? 'warning'
                        : 'default'
                    }
                    size="small"
                  />
                  <Chip label={project.category} size="small" />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Бюджет: {project.budget} ₽
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Срок: {new Date(project.deadline).toLocaleDateString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ProjectList; 