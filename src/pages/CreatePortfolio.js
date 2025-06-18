import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  CircularProgress,
  Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useAuth } from '../context/AuthContext';

// Настройка axios
axios.defaults.baseURL = 'http://localhost:3001';
axios.defaults.withCredentials = true;

const Input = styled('input')({
  display: 'none',
});

const CreatePortfolio = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    about: '',
    skills: '',
    experience: '',
    education: '',
    works: [{ title: '', description: '', image: null }]
  });

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    if (name.startsWith('work')) {
      const workIndex = parseInt(name.split('-')[1]);
      const field = name.split('-')[2];
      const newWorks = [...formData.works];
      newWorks[workIndex] = { ...newWorks[workIndex], [field]: value };
      setFormData({ ...formData, works: newWorks });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const newWorks = [...formData.works];
      newWorks[index] = { ...newWorks[index], image: file };
      setFormData({ ...formData, works: newWorks });
    }
  };

  const addWork = () => {
    setFormData({
      ...formData,
      works: [...formData.works, { title: '', description: '', image: null }]
    });
  };

  const removeWork = (index) => {
    const newWorks = formData.works.filter((_, i) => i !== index);
    setFormData({ ...formData, works: newWorks });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!user) {
      setError('Пользователь не авторизован');
      setLoading(false);
      return;
    }

    try {
      // Создаем портфолио
      const portfolioResponse = await axios.post('/portfolio/create', {
        about: formData.about,
        skills: formData.skills.split(',').map(skill => skill.trim()).filter(Boolean),
        experience: formData.experience,
        education: formData.education,
        works: formData.works.map(work => ({
          title: work.title,
          description: work.description
        }))
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const portfolioId = portfolioResponse.data._id;

      // Загружаем изображения для каждой работы
      for (let i = 0; i < formData.works.length; i++) {
        const work = formData.works[i];
        if (work.image) {
          const formData = new FormData();
          formData.append('image', work.image);
          try {
            await axios.post(`/portfolio/${portfolioId}/works/${i}/image`, formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            });
          } catch (err) {
            console.error('Error uploading image:', err);
            // Продолжаем выполнение даже если загрузка изображения не удалась
          }
        }
      }

      // Перенаправляем на страницу портфолио
      navigate(`/portfolio/${user.uid}`);
    } catch (err) {
      console.error('Error creating portfolio:', err);
      if (err.response?.status === 404) {
        setError('Сервер не найден. Проверьте, запущен ли бэкенд.');
      } else if (err.response?.status === 401) {
        setError('Пользователь не авторизован. Пожалуйста, войдите в систему.');
      } else {
        setError(err.response?.data?.message || 'Ошибка при создании портфолио');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Создание портфолио
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="О себе"
                name="about"
                multiline
                rows={4}
                value={formData.about}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Навыки (через запятую)"
                name="skills"
                value={formData.skills}
                onChange={handleInputChange}
                helperText="Введите навыки через запятую"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Опыт работы"
                name="experience"
                multiline
                rows={4}
                value={formData.experience}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Образование"
                name="education"
                multiline
                rows={4}
                value={formData.education}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Мои работы
              </Typography>
              {formData.works.map((work, index) => (
                <Box key={index} sx={{ mb: 3, p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Название работы"
                        name={`work-${index}-title`}
                        value={work.title}
                        onChange={(e) => handleInputChange(e, index)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Описание"
                        name={`work-${index}-description`}
                        multiline
                        rows={3}
                        value={work.description}
                        onChange={(e) => handleInputChange(e, index)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <label htmlFor={`image-upload-${index}`}>
                        <Input
                          id={`image-upload-${index}`}
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageChange(e, index)}
                        />
                        <Button
                          variant="outlined"
                          component="span"
                          fullWidth
                        >
                          Загрузить изображение
                        </Button>
                      </label>
                    </Grid>
                    {formData.works.length > 1 && (
                      <Grid item xs={12}>
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => removeWork(index)}
                          fullWidth
                        >
                          Удалить работу
                        </Button>
                      </Grid>
                    )}
                  </Grid>
                </Box>
              ))}
              <Button
                variant="outlined"
                onClick={addWork}
                sx={{ mt: 2 }}
              >
                Добавить работу
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Создать портфолио'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default CreatePortfolio; 