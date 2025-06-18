import React, { useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Chip,
  Avatar,
  Rating,
  TextField,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery,
  Stack,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CardActions,
  Snackbar,
  Alert,
  CircularProgress,
  Slider
} from '@mui/material';
import {
  Search as SearchIcon,
  Work as WorkIcon,
  AttachMoney as MoneyIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  Send as SendIcon,
  Close as CloseIcon,
  Add as AddIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useRole } from '../context/RoleContext';
import { specializations } from '../data/profileData';
import { useProjects } from '../context/ProjectContext';
import { useNavigate } from 'react-router-dom';
import { useResponse } from '../context/ResponseContext';

// Генерация случайных проектов
const generateProjects = () => {
  const projectTypes = [
    { type: 'Логотип компании', specialization: 'branding', image: 'https://images.unsplash.com/photo-1634942537034-2531766767d1?w=800&h=600&fit=crop' },
    { type: 'Дизайн сайта', specialization: 'web', image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&h=600&fit=crop' },
    { type: 'Анимация для рекламы', specialization: 'motion', image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=600&fit=crop' },
    { type: 'Иллюстрации для книги', specialization: 'illustration', image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=800&h=600&fit=crop' },
    { type: 'Брендинг стартапа', specialization: 'branding', image: 'https://images.unsplash.com/photo-1634942537034-2531766767d1?w=800&h=600&fit=crop' },
    { type: 'UI/UX дизайн приложения', specialization: 'ui', image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&h=600&fit=crop' },
    { type: '3D-модель продукта', specialization: '3d', image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=600&fit=crop' },
    { type: 'Дизайн упаковки', specialization: 'graphic', image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=800&h=600&fit=crop' },
    { type: 'Моушн-дизайн', specialization: 'motion', image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=600&fit=crop' },
    { type: 'SMM-дизайн', specialization: 'social', image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=800&h=600&fit=crop' }
  ];

  const customers = [
    { name: 'Александр Петров', rating: 4.8, projects: 12, avatar: 'https://i.pravatar.cc/150?img=1' },
    { name: 'Мария Иванова', rating: 4.9, projects: 8, avatar: 'https://i.pravatar.cc/150?img=5' },
    { name: 'Дмитрий Сидоров', rating: 4.7, projects: 15, avatar: 'https://i.pravatar.cc/150?img=8' },
    { name: 'Елена Смирнова', rating: 4.6, projects: 10, avatar: 'https://i.pravatar.cc/150?img=9' },
    { name: 'Иван Кузнецов', rating: 4.9, projects: 20, avatar: 'https://i.pravatar.cc/150?img=12' }
  ];

  return Array.from({ length: 30 }, (_, index) => {
    const customer = customers[Math.floor(Math.random() * customers.length)];
    const projectType = projectTypes[Math.floor(Math.random() * projectTypes.length)];
    const budget = Math.floor(Math.random() * 150000) + 50000;
    const deadline = Math.floor(Math.random() * 30) + 1;

    return {
      id: index + 1,
      title: projectType.type,
      description: `Подробное описание проекта "${projectType.type}". Требуется профессиональный подход и креативное решение.`,
      budget,
      deadline,
      customer,
      image: projectType.image,
      specialization: projectType.specialization,
      status: 'active',
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000)
    };
  });
};

// Тестовые проекты
const testProjects = [
  {
    id: 1,
    title: 'Разработка корпоративного сайта',
    description: 'Требуется разработка современного корпоративного сайта для IT-компании. Необходимо реализовать адаптивный дизайн, интеграцию с CRM и систему управления контентом.',
    budget: 250000,
    deadline: 30,
    specialization: 'web',
    image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&h=600&fit=crop',
    clientId: 'user1',
    clientName: 'Александр Петров',
    status: 'active',
    createdAt: new Date('2024-03-01')
  },
  {
    id: 2,
    title: 'Дизайн мобильного приложения',
    description: 'Разработка UI/UX дизайна для мобильного приложения доставки еды. Необходимо создать современный и удобный интерфейс с учетом всех требований пользователей.',
    budget: 180000,
    deadline: 21,
    specialization: 'ui',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=600&fit=crop',
    clientId: 'user2',
    clientName: 'Мария Иванова',
    status: 'active',
    createdAt: new Date('2024-03-05')
  },
  {
    id: 3,
    title: 'Создание логотипа и фирменного стиля',
    description: 'Разработка логотипа и фирменного стиля для нового бренда одежды. Необходимо создать уникальный и запоминающийся образ, который будет отражать ценности компании.',
    budget: 120000,
    deadline: 14,
    specialization: 'branding',
    image: 'https://images.unsplash.com/photo-1634942537034-2531766767d1?w=800&h=600&fit=crop',
    clientId: 'user3',
    clientName: 'Дмитрий Сидоров',
    status: 'active',
    createdAt: new Date('2024-03-10')
  },
  {
    id: 4,
    title: 'Разработка 3D-модели продукта',
    description: 'Создание детализированной 3D-модели нового продукта для презентации инвесторам. Требуется реалистичная визуализация с возможностью просмотра со всех сторон.',
    budget: 150000,
    deadline: 20,
    specialization: '3d',
    image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=800&h=600&fit=crop',
    clientId: 'user4',
    clientName: 'Елена Смирнова',
    status: 'active',
    createdAt: new Date('2024-03-15')
  }
];

const Projects = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user } = useAuth();
  const { getAllProjects, canEditProject, getSpecializations } = useProjects();
  const { isExecutor } = useRole();
  const { createResponse, responses } = useResponse();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [responseDialog, setResponseDialog] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [proposedDeadline, setProposedDeadline] = useState('');
  const [proposedPrice, setProposedPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [minBudget, setMinBudget] = useState('');
  const [maxBudget, setMaxBudget] = useState('');
  const navigate = useNavigate();

  const projects = getAllProjects();
  const specializations = getSpecializations();

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSpecializationChange = (event) => {
    setSelectedSpecialization(event.target.value);
  };

  const handleProjectClick = (project) => {
    setSelectedProject(project);
  };

  // Функция для логирования с временной меткой
  const log = (action, data) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [Projects] ${action}:`, data);
  };

  const handleCloseDialog = () => {
    setSelectedProject(null);
    setResponseDialog(false);
    setResponseMessage('');
    setProposedDeadline('');
    setProposedPrice('');
  };

  const handleResponseClick = () => {
    setResponseDialog(true);
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const handleSendResponse = async () => {
    if (!selectedProject) {
      log('Error: No project selected');
      setNotification({
        open: true,
        message: 'Проект не выбран',
        severity: 'error'
      });
      return;
    }

    if (!responseMessage.trim() || !proposedPrice) {
      log('Error: Missing required fields');
      setNotification({
        open: true,
        message: 'Пожалуйста, заполните все обязательные поля',
        severity: 'error'
      });
      return;
    }

    log('Sending response', {
      projectId: selectedProject.id,
      message: responseMessage,
      price: proposedPrice
    });

    setLoading(true);
    try {
      await createResponse(
        selectedProject.id,
        responseMessage,
        Number(proposedPrice)
      );
      log('Response sent successfully');
      setNotification({
        open: true,
        message: 'Отклик успешно отправлен',
        severity: 'success'
      });
      handleCloseDialog();
    } catch (error) {
      log('Error sending response', { error: error.message });
      setNotification({
        open: true,
        message: error.message || 'Не удалось отправить отклик',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialization = !selectedSpecialization || project.specialization === selectedSpecialization;
    const budget = project.budget;

    const matchesBudget = (!minBudget || budget >= Number(minBudget)) && (!maxBudget || budget <= Number(maxBudget));

    return matchesSearch && matchesSpecialization && matchesBudget;
  });

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatBudget = (budget) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      maximumFractionDigits: 0
    }).format(budget);
  };

  const getSpecializationName = (specialization) => {
    const spec = specializations.find(s => s.id === specialization);
    return spec ? spec.name : specialization;
  };

  const hasUserResponded = (projectId, userId) => {
    return responses.some(response => response.projectId === projectId && response.executorId === userId);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Все проекты
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Поиск проектов..."
              value={searchQuery}
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Специализация</InputLabel>
              <Select
                value={selectedSpecialization}
                onChange={handleSpecializationChange}
                label="Специализация"
              >
                <MenuItem value="">Все специализации</MenuItem>
                {specializations.map((spec) => (
                  <MenuItem key={spec.id} value={spec.id}>
                    {spec.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography gutterBottom>Бюджет (₽)</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                type="number"
                label="От"
                value={minBudget}
                onChange={(e) => setMinBudget(e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₽</InputAdornment>,
                  inputProps: { min: 0 }
                }}
              />
              <TextField
                fullWidth
                type="number"
                label="До"
                value={maxBudget}
                onChange={(e) => setMaxBudget(e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₽</InputAdornment>,
                  inputProps: { min: 0 }
                }}
              />
            </Box>
          </Grid>
        </Grid>
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
                  boxShadow: theme.shadows[4],
                  transition: 'all 0.3s ease'
                }
              }}
              onClick={() => handleProjectClick(project)}
            >
              {project.image && (
                <CardMedia
                  component="img"
                  height="200"
                  image={project.image}
                  alt={project.title}
                  sx={{ objectFit: 'cover' }}
                />
              )}
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {project.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {project.description}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Chip 
                    label={getSpecializationName(project.specialization)}
                    color="primary"
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <Chip 
                    label={formatBudget(project.budget)}
                    color="secondary"
                    size="small"
                  />
                </Box>
                <Typography variant="caption" color="text.secondary">
                  Срок: {formatDate(project.deadline)}
                </Typography>
                <Typography variant="caption" display="block" color="text.secondary">
                  Заказчик: {project.clientName}
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton 
                  size="small" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleProjectClick(project);
                  }}
                  color="primary"
                >
                  <VisibilityIcon />
                </IconButton>
                {canEditProject(project.id) && (
                  <>
                    <IconButton 
                      size="small" 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/edit-project/${project.id}`);
                      }}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      onClick={(e) => {
                        e.stopPropagation();
                        // Здесь должна быть логика удаления проекта
                      }}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Диалог с деталями проекта */}
      <Dialog
        open={Boolean(selectedProject)}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedProject && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">{selectedProject.title}</Typography>
                <IconButton onClick={handleCloseDialog}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <CardMedia
                    component="img"
                    height="400"
                    image={selectedProject.image}
                    alt={selectedProject.title}
                    sx={{ borderRadius: 1, objectFit: 'cover' }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="subtitle1" color="primary" gutterBottom>
                        Бюджет
                      </Typography>
                      <Typography variant="h6">
                        {formatBudget(selectedProject.budget)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" color="primary" gutterBottom>
                        Срок выполнения
                      </Typography>
                      <Typography variant="h6">
                        {formatDate(selectedProject.deadline)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" color="primary" gutterBottom>
                        Дата публикации
                      </Typography>
                      <Typography variant="body1">
                        {formatDate(selectedProject.createdAt)}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" color="primary" gutterBottom>
                    Описание проекта
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {selectedProject.description}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ 
                    p: 2, 
                    bgcolor: 'background.default', 
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2
                  }}>
                    <Avatar 
                      src={`https://i.pravatar.cc/150?u=${selectedProject.clientId}`}
                      alt={selectedProject.clientName}
                      sx={{ width: 64, height: 64 }}
                    />
                    <Box>
                      <Typography variant="h6">
                        {selectedProject.clientName}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              {user && isExecutor() && selectedProject && (
                hasUserResponded(selectedProject.id, user.uid) ? (
                  <Typography variant="body1" color="text.secondary">Вы уже откликнулись на этот проект</Typography>
                ) : (
                  <Button
                    variant="contained"
                    startIcon={<SendIcon />}
                    onClick={handleResponseClick}
                  >
                    Откликнуться
                  </Button>
                )
              )}
              {user && !isExecutor() && !canEditProject(selectedProject.id) && selectedProject && (
                <Typography variant="body1" color="text.secondary">Только исполнители могут откликаться на проекты</Typography>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Диалог отклика на проект */}
      <Dialog
        open={responseDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
          }
        }}
      >
        <DialogTitle sx={{ 
          borderBottom: '1px solid',
          borderColor: 'divider',
          pb: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SendIcon color="primary" />
            <Typography variant="h6">Отклик на проект</Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Сообщение заказчику
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                placeholder="Опишите, почему вы подходите для этого проекта..."
                value={responseMessage}
                onChange={(e) => setResponseMessage(e.target.value)}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    transition: 'all 0.2s',
                    '&:hover': {
                      boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                    }
                  }
                }}
              />
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Предлагаемый срок
                  </Typography>
                  <TextField
                    fullWidth
                    type="number"
                    placeholder="Например: 14"
                    value={proposedDeadline}
                    onChange={(e) => setProposedDeadline(e.target.value)}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">дней</InputAdornment>
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        transition: 'all 0.2s',
                        '&:hover': {
                          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                        }
                      }
                    }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Предлагаемая цена
                  </Typography>
                  <TextField
                    fullWidth
                    type="number"
                    placeholder="Например: 50000"
                    value={proposedPrice}
                    onChange={(e) => setProposedPrice(e.target.value)}
                    required
                    InputProps={{
                      startAdornment: <InputAdornment position="start">₽</InputAdornment>
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        transition: 'all 0.2s',
                        '&:hover': {
                          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                        }
                      }
                    }}
                  />
                </Box>
              </Grid>
            </Grid>

            <Box sx={{ 
              bgcolor: 'background.default', 
              p: 2, 
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider'
            }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Советы по составлению отклика:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Опишите свой опыт в подобных проектах<br />
                • Укажите, почему вы подходите для этой работы<br />
                • Предложите конкретные сроки и цену<br />
                • Будьте вежливы и профессиональны
              </Typography>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ 
          px: 3, 
          py: 2, 
          borderTop: '1px solid',
          borderColor: 'divider'
        }}>
          <Button 
            onClick={handleCloseDialog}
            sx={{ 
              borderRadius: 2,
              px: 3
            }}
          >
            Отмена
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSendResponse}
            disabled={loading || !responseMessage.trim() || !proposedPrice}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
            sx={{ 
              borderRadius: 2,
              px: 3,
              minWidth: 120
            }}
          >
            {loading ? 'Отправка...' : 'Отправить'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          sx={{ 
            width: '100%',
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Projects; 