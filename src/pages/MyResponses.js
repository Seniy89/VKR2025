import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProjects } from '../context/ProjectContext';
import { useResponse } from '../context/ResponseContext';
import { 
  Card, 
  Typography, 
  List, 
  Avatar, 
  Space, 
  Tag, 
  Button, 
  Modal, 
  Snackbar,
  Alert,
  CircularProgress, 
  Box,
  Grid,
  Chip,
  IconButton,
  useTheme,
  Divider,
  Container
} from '@mui/material';
import { 
  Assignment as AssignmentIcon,
  Person as PersonIcon,
  AccessTime as AccessTimeIcon,
  Close as CloseIcon,
  Visibility as VisibilityIcon,
  Cancel as CancelIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Schedule as ScheduleIcon,
  Inbox as InboxIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const { Title, Text } = Typography;

const EmptyState = () => (
  <Box sx={{ 
    display: 'flex', 
    flexDirection: 'column',
    alignItems: 'center', 
    justifyContent: 'center', 
    minHeight: '40vh',
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    p: 4
  }}>
    <InboxIcon sx={{ 
      fontSize: 64, 
      color: 'text.secondary',
      mb: 2 
    }} />
    <Typography variant="h6" color="text.secondary" gutterBottom>
      У вас пока нет откликов
    </Typography>
    <Typography variant="body2" color="text.secondary" align="center">
      Здесь будут отображаться все ваши отклики на проекты
    </Typography>
  </Box>
);

const MyResponses = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const { projects } = useProjects();
  const { getExecutorResponses, loading: responseLoading, cancelResponse } = useResponse();
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [localLoading, setLocalLoading] = useState(true);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [responses, setResponses] = useState([]);

  // Функция для логирования с временной меткой
  const log = (action, data) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [MyResponses] ${action}:`, data);
  };

  // Обновляем список откликов
  const updateResponses = () => {
    if (user?.uid) {
      const userResponses = getExecutorResponses(user.uid);
      setResponses(userResponses);
      log('Responses updated', { count: userResponses.length });
    }
  };

  // Логирование при монтировании компонента
  useEffect(() => {
    if (user?.uid) {
      updateResponses();
      log('Component mounted', { 
        userId: user.uid,
        responsesCount: responses.length
      });
      setLocalLoading(false);
    }
  }, [user?.uid]);

  const handleViewDetails = (response) => {
    log('Viewing response details', { 
      responseId: response.id,
      projectId: response.projectId
    });
    setSelectedResponse(response);
    setModalVisible(true);
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const handleCancelResponse = async (responseId) => {
    log('Canceling response', { responseId });
    setLocalLoading(true);
    try {
      await cancelResponse(responseId);
      log('Response canceled successfully', { responseId });
      setNotification({
        open: true,
        message: 'Отклик успешно отменен',
        severity: 'success'
      });
      // Обновляем список откликов после успешной отмены
      updateResponses();
      // Закрываем модальное окно, если оно открыто
      if (modalVisible) {
        setModalVisible(false);
      }
    } catch (error) {
      log('Error canceling response', { error: error.message });
      setNotification({
        open: true,
        message: error.message || 'Не удалось отменить отклик',
        severity: 'error'
      });
    } finally {
      setLocalLoading(false);
    }
  };

  const getProjectDetails = (projectId) => {
    const project = projects.find(p => p.id === projectId) || {};
    log('Getting project details', { projectId, found: !!project });
    return project;
  };

  const getStatusConfig = (status) => {
    const config = {
      pending: { 
        color: 'warning', 
        text: 'На рассмотрении',
        icon: <ScheduleIcon />
      },
      accepted: { 
        color: 'success', 
        text: 'Принят',
        icon: <CheckCircleIcon />
      },
      rejected: { 
        color: 'error', 
        text: 'Отклонен',
        icon: <ErrorIcon />
      },
      canceled: { 
        color: 'default', 
        text: 'Отменен',
        icon: <CancelIcon />
      }
    };
    return config[status] || config.pending;
  };

  if (responseLoading || localLoading) {
    log('Loading state active', { responseLoading, localLoading });
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh',
        bgcolor: 'background.default'
      }}>
        <CircularProgress />
      </Box>
    );
  }

  log('Rendering component', { 
    responsesCount: responses.length,
    loading: responseLoading || localLoading,
    userId: user?.uid
  });

  return (
    <Box sx={{ 
      minHeight: '100vh',
      bgcolor: 'background.default',
      py: 4
    }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ 
            color: 'text.primary',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <AssignmentIcon />
            Мои отклики
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Управляйте своими откликами на проекты
          </Typography>
        </Box>
        
        {responses.length === 0 ? (
          <EmptyState />
        ) : (
          <Grid container spacing={3}>
            {responses.map(response => {
              const project = getProjectDetails(response.projectId);
              const statusConfig = getStatusConfig(response.status);
              
              return (
                <Grid item xs={12} sm={6} md={4} key={response.id}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
                      }
                    }}
                  >
                    <Box sx={{ p: 2, flexGrow: 1 }}>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'flex-start',
                        mb: 2
                      }}>
                        <Typography variant="h6" sx={{ 
                          fontWeight: 600,
                          color: 'text.primary'
                        }}>
                          {project.title}
                        </Typography>
                        <Chip
                          icon={statusConfig.icon}
                          label={statusConfig.text}
                          color={statusConfig.color}
                          size="small"
                          sx={{ 
                            borderRadius: 1,
                            '& .MuiChip-icon': {
                              color: 'inherit'
                            }
                          }}
                        />
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          Ваше сообщение:
                        </Typography>
                        <Typography variant="body2" sx={{ 
                          color: 'text.primary',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}>
                          {response.message}
                        </Typography>
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary" display="block">
                            Предложенная цена
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 500 }}>
                            {response.price.toLocaleString('ru-RU')} ₽
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary" display="block">
                            Дата отклика
                          </Typography>
                          <Typography variant="body2">
                            {format(new Date(response.createdAt), 'dd MMM yyyy', { locale: ru })}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>

                    <Box sx={{ 
                      p: 2, 
                      bgcolor: 'background.default',
                      borderTop: '1px solid',
                      borderColor: 'divider',
                      display: 'flex',
                      gap: 1
                    }}>
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<VisibilityIcon />}
                        onClick={() => handleViewDetails(response)}
                        sx={{ 
                          borderRadius: 1,
                          textTransform: 'none'
                        }}
                      >
                        Подробнее
                      </Button>
                      {response.status === 'pending' && (
                        <Button
                          fullWidth
                          variant="outlined"
                          color="error"
                          startIcon={<CancelIcon />}
                          onClick={() => handleCancelResponse(response.id)}
                          sx={{ 
                            borderRadius: 1,
                            textTransform: 'none'
                          }}
                        >
                          Отменить
                        </Button>
                      )}
                    </Box>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}

        <Modal
          open={modalVisible}
          onClose={() => setModalVisible(false)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Box sx={{
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            width: '100%',
            maxWidth: 600,
            maxHeight: '90vh',
            overflow: 'auto',
            position: 'relative'
          }}>
            {selectedResponse && (
              <>
                <Box sx={{ 
                  p: 3, 
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <Typography variant="h6">
                    Детали отклика
                  </Typography>
                  <IconButton 
                    onClick={() => setModalVisible(false)}
                    size="small"
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>

                <Box sx={{ p: 3 }}>
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                      Информация о проекте
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Название проекта
                        </Typography>
                        <Typography variant="body1">
                          {getProjectDetails(selectedResponse.projectId).title}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Бюджет проекта
                        </Typography>
                        <Typography variant="body1">
                          {getProjectDetails(selectedResponse.projectId).budget.toLocaleString('ru-RU')} ₽
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Срок выполнения
                        </Typography>
                        <Typography variant="body1">
                          {getProjectDetails(selectedResponse.projectId).deadline} дней
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>

                  <Divider sx={{ my: 3 }} />

                  <Box sx={{ mb: 4 }}>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                      Ваш отклик
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Сообщение
                        </Typography>
                        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                          {selectedResponse.message}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Предложенная цена
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'primary.main', fontWeight: 500 }}>
                          {selectedResponse.price.toLocaleString('ru-RU')} ₽
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Статус
                        </Typography>
                        <Chip
                          icon={getStatusConfig(selectedResponse.status).icon}
                          label={getStatusConfig(selectedResponse.status).text}
                          color={getStatusConfig(selectedResponse.status).color}
                          size="small"
                          sx={{ 
                            borderRadius: 1,
                            '& .MuiChip-icon': {
                              color: 'inherit'
                            }
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Box>

                  {selectedResponse.status === 'pending' && (
                    <Box sx={{ 
                      display: 'flex',
                      justifyContent: 'flex-end',
                      gap: 1
                    }}>
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<CancelIcon />}
                        onClick={() => handleCancelResponse(selectedResponse.id)}
                        sx={{ 
                          borderRadius: 1,
                          textTransform: 'none'
                        }}
                      >
                        Отменить отклик
                      </Button>
                    </Box>
                  )}
                </Box>
              </>
            )}
          </Box>
        </Modal>

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
    </Box>
  );
};

export default MyResponses; 