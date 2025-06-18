import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '../context/ProjectContext';

const CreateProject = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const { createProject, getSpecializations } = useProjects();
  const specializations = getSpecializations();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    deadline: '',
    specialization: '',
    image: 'https://source.unsplash.com/random/800x600?project'
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Очищаем ошибку при изменении поля
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Введите название проекта';
    if (!formData.description.trim()) newErrors.description = 'Введите описание проекта';
    if (!formData.budget) newErrors.budget = 'Введите бюджет';
    if (!formData.deadline) newErrors.deadline = 'Введите срок выполнения';
    if (!formData.specialization) newErrors.specialization = 'Выберите специализацию';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const projectData = {
        ...formData,
        budget: Number(formData.budget),
        deadline: new Date(formData.deadline).toISOString()
      };

      await createProject(projectData);
      navigate('/my-projects');
    } catch (error) {
      console.error('Error creating project:', error);
      setErrors(prev => ({
        ...prev,
        submit: 'Ошибка при создании проекта'
      }));
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Создание нового проекта
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Название проекта"
                name="title"
                value={formData.title}
                onChange={handleChange}
                error={!!errors.title}
                helperText={errors.title}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Описание проекта"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={4}
                error={!!errors.description}
                helperText={errors.description}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Бюджет"
                name="budget"
                type="number"
                value={formData.budget}
                onChange={handleChange}
                error={!!errors.budget}
                helperText={errors.budget}
                InputProps={{
                  startAdornment: '₽'
                }}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Срок выполнения"
                name="deadline"
                type="date"
                value={formData.deadline}
                onChange={handleChange}
                error={!!errors.deadline}
                helperText={errors.deadline}
                InputLabelProps={{
                  shrink: true
                }}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.specialization}>
                <InputLabel>Специализация</InputLabel>
                <Select
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  label="Специализация"
                  required
                >
                  {specializations.map((spec) => (
                    <MenuItem key={spec.id} value={spec.id}>
                      {spec.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.specialization && (
                  <Typography color="error" variant="caption">
                    {errors.specialization}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            {errors.submit && (
              <Grid item xs={12}>
                <Typography color="error" align="center">
                  {errors.submit}
                </Typography>
              </Grid>
            )}

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/my-projects')}
                >
                  Отмена
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  Создать проект
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateProject; 