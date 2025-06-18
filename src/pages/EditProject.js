import React, { useState, useEffect } from 'react';
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
  useMediaQuery,
  CircularProgress
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useProjects } from '../context/ProjectContext';

const EditProject = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const { id } = useParams();
  const { projects, updateProject, canEditProject, getSpecializations } = useProjects();
  const specializations = getSpecializations();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    deadline: '',
    specialization: '',
    image: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const project = projects.find(p => p.id === id);
    if (!project) {
      navigate('/my-projects');
      return;
    }

    if (!canEditProject(id)) {
      navigate('/projects');
      return;
    }

    setFormData({
      title: project.title,
      description: project.description,
      budget: project.budget,
      deadline: new Date(project.deadline).toISOString().split('T')[0],
      specialization: project.specialization,
      image: project.image
    });
    setIsLoading(false);
  }, [id, projects, canEditProject, navigate]);

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

      await updateProject(id, projectData);
      navigate('/my-projects');
    } catch (error) {
      console.error('Error updating project:', error);
      setErrors(prev => ({
        ...prev,
        submit: 'Ошибка при обновлении проекта'
      }));
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Редактирование проекта
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
                  Сохранить изменения
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default EditProject; 