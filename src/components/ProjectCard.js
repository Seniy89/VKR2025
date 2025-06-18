import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  Rating,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Badge,
  Grid,
  useTheme,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  AttachMoney as MoneyIcon,
  Event as EventIcon,
  Person as PersonIcon,
  Category as CategoryIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Visibility as VisibilityIcon,
  AccessTime as AccessTimeIcon,
  Work as WorkIcon,
  Send as SendIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Notifications as NotificationsIcon,
  Schedule as ScheduleIcon,
  Chat as ChatIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useAuth } from '../context/AuthContext';
import { useResponse } from '../context/ResponseContext';
import { useRole } from '../context/RoleContext';
import { formatDate } from '../utils/dateUtils';
import { message, Form, Input, InputNumber } from 'antd';
import { useChat } from '../context/ChatContext';

const StyledCard = styled(Card)(({ theme }) => ({
  background: 'rgba(45, 45, 45, 0.95)',
  backdropFilter: 'blur(10px)',
  borderRadius: '15px',
  border: '1px solid rgba(255, 107, 0, 0.2)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 32px rgba(255, 107, 0, 0.2)',
    border: '1px solid rgba(255, 107, 0, 0.4)',
  },
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #FF6B00 30%, #FF8E53 90%)',
  color: 'white',
  '&:hover': {
    background: 'linear-gradient(45deg, #FF8E53 30%, #FF6B00 90%)',
  },
}));

const ProjectCard = ({ project, onFavorite, isFavorite, onApply }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isCustomer, isExecutor } = useRole();
  const { createResponse, getProjectResponses, updateResponseStatus, getNewResponsesCount, getExecutorResponses } = useResponse();
  const [openResponse, setOpenResponse] = useState(false);
  const [openResponses, setOpenResponses] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [responsePrice, setResponsePrice] = useState('');
  const responses = getProjectResponses(project.id);
  const pendingResponses = getNewResponsesCount(project.id);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const theme = useTheme();
  const { createChat } = useChat();

  // Функция для логирования с временной меткой
  const log = (action, data) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [ProjectCard] ${action}:`, data);
  };

  const handleResponse = async (e) => {
    e.preventDefault();
    log('Handling response submission', { projectId: project.id });

    if (!user) {
      log('User not authenticated, redirecting to login');
      setNotification({
        open: true,
        message: 'Необходимо авторизоваться для отклика на проект',
        severity: 'warning'
      });
      navigate('/login');
      return;
    }

    if (!responseMessage.trim() || !responsePrice) {
      setNotification({
        open: true,
        message: 'Пожалуйста, заполните все поля',
        severity: 'error'
      });
      return;
    }

    setLoading(true);
    try {
      log('Creating response', {
        projectId: project.id,
        message: responseMessage,
        price: responsePrice,
        userId: user.uid
      });

      const newResponse = await createResponse(project.id, responseMessage, responsePrice);
      log('Response created successfully', { responseId: newResponse.id });

      setNotification({
        open: true,
        message: 'Отклик успешно отправлен',
        severity: 'success'
      });
      setIsModalVisible(false);
      setResponseMessage('');
      setResponsePrice('');
    } catch (error) {
      log('Error creating response', { error: error.message });
      setNotification({
        open: true,
        message: error.message || 'Не удалось отправить отклик',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = (responseId, status) => {
    log('Updating response status', { responseId, status, projectId: project.id });
    try {
      updateResponseStatus(responseId, status);
      log('Response status updated successfully', { responseId, status });
      message.success('Статус отклика обновлен');
    } catch (error) {
      log('Error updating response status', { error: error.message });
      message.error(error.message || 'Не удалось обновить статус отклика');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'warning';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'accepted':
        return 'Принят';
      case 'rejected':
        return 'Отклонен';
      default:
        return 'На рассмотрении';
    }
  };

  const showModal = () => {
    log('Showing response modal', { projectId: project.id });
    if (!user) {
      log('User not authenticated, redirecting to login');
      message.warning('Необходимо авторизоваться для отклика на проект');
      navigate('/login');
      return;
    }
    setIsModalVisible(true);
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const handleStartChat = async (participantId) => {
    try {
      console.log('Starting chat with participant:', participantId);
      const chat = await createChat(participantId);
      console.log('Chat created:', chat);
      navigate(`/chat/${chat.id}`);
    } catch (error) {
      console.error('Error creating chat:', error);
      setNotification({
        open: true,
        message: 'Не удалось создать чат',
        severity: 'error'
      });
    }
  };

  // Логирование при монтировании компонента
  React.useEffect(() => {
    log('ProjectCard mounted', { 
      projectId: project.id,
      title: project.title,
      responsesCount: responses.length,
      pendingResponses
    });
  }, []);

  return (
    <>
      <StyledCard>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Typography variant="h6" component="div" sx={{ 
              color: 'white',
              fontWeight: 'bold',
              flex: 1,
              mr: 2
            }}>
              {project.title}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {user && isCustomer() && user.uid === project.clientId && pendingResponses > 0 && (
                <Tooltip title={`${pendingResponses} новых откликов`}>
                  <Badge
                    badgeContent={pendingResponses}
                    color="error"
                    sx={{ mr: 1 }}
                  >
                    <NotificationsIcon sx={{ color: '#FF6B00' }} />
                  </Badge>
                </Tooltip>
              )}
              <Tooltip title={isFavorite ? "Удалить из избранного" : "Добавить в избранное"}>
                <IconButton 
                  onClick={() => onFavorite(project.id)}
                  sx={{ color: isFavorite ? '#FF6B00' : 'rgba(255, 255, 255, 0.7)' }}
                >
                  {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: '60px' }}>
            {project.description.length > 150 
              ? `${project.description.substring(0, 150)}...` 
              : project.description}
          </Typography>

          <Box sx={{ mb: 2 }}>
            {(project.tags || []).map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                size="small"
                sx={{
                  mr: 1,
                  mb: 1,
                  background: 'rgba(255, 107, 0, 0.1)',
                  color: '#FF6B00',
                  border: '1px solid rgba(255, 107, 0, 0.3)',
                  '&:hover': {
                    background: 'rgba(255, 107, 0, 0.2)',
                  }
                }}
              />
            ))}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <MoneyIcon sx={{ mr: 1, color: '#FF6B00' }} />
            <Typography variant="body2" color="text.secondary">
              Бюджет: {project.budget.toLocaleString()} ₽
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <EventIcon sx={{ mr: 1, color: '#FF6B00' }} />
            <Typography variant="body2" color="text.secondary">
              Срок: {new Date(project.deadline).toLocaleDateString()}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <CategoryIcon sx={{ mr: 1, color: '#FF6B00' }} />
            <Typography variant="body2" color="text.secondary">
              Категория: {project.category}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <PersonIcon sx={{ mr: 1, color: '#FF6B00' }} />
            <Typography variant="body2" color="text.secondary">
              Заказчик: {project.clientName}
            </Typography>
          </Box>

          {responses.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                  Откликов: {responses.length}
                </Typography>
                {pendingResponses > 0 && (
                  <Chip
                    label={`${pendingResponses} новых`}
                    size="small"
                    color="error"
                    sx={{ ml: 1 }}
                  />
                )}
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={Math.min((responses.length / 10) * 100, 100)}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: 'rgba(255, 107, 0, 0.1)',
                  '& .MuiLinearProgress-bar': {
                    background: 'linear-gradient(45deg, #FF6B00 30%, #FF8E53 90%)',
                  }
                }}
              />
            </Box>
          )}
        </CardContent>

        <CardActions sx={{ p: 2, pt: 0 }}>
          {user && isExecutor() && (
            <GradientButton
              fullWidth
              variant="contained"
              onClick={showModal}
              startIcon={<SendIcon />}
            >
              Откликнуться
            </GradientButton>
          )}
          {user && isCustomer() && user.uid === project.clientId && (
            <GradientButton
              fullWidth
              variant="contained"
              onClick={() => setOpenResponses(true)}
              startIcon={
                <Badge
                  badgeContent={pendingResponses}
                  color="error"
                  sx={{ '& .MuiBadge-badge': { right: -3, top: 3 } }}
                >
                  <VisibilityIcon />
                </Badge>
              }
            >
              Просмотреть отклики
            </GradientButton>
          )}
          {user && (
            <Button
              fullWidth
              variant="outlined"
              onClick={() => handleStartChat(project.clientId)}
              startIcon={<ChatIcon />}
              sx={{
                mt: 1,
                borderColor: 'rgba(255, 107, 0, 0.5)',
                color: '#FF6B00',
                '&:hover': {
                  borderColor: '#FF6B00',
                  backgroundColor: 'rgba(255, 107, 0, 0.1)',
                }
              }}
            >
              Написать заказчику
            </Button>
          )}
        </CardActions>
      </StyledCard>

      {/* Диалог создания отклика */}
      <Dialog open={openResponse} onClose={() => setOpenResponse(false)}>
        <DialogTitle>Отклик на проект</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Ваше сообщение"
            fullWidth
            multiline
            rows={4}
            value={responseMessage}
            onChange={(e) => setResponseMessage(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Ваша цена"
            type="number"
            fullWidth
            value={responsePrice}
            onChange={(e) => setResponsePrice(e.target.value)}
            InputProps={{
              endAdornment: <Typography sx={{ ml: 1 }}>₽</Typography>,
              inputProps: { 
                min: 0,
                style: { textAlign: 'left' }
              }
            }}
            sx={{
              '& input[type=number]': {
                '-moz-appearance': 'textfield'
              },
              '& input[type=number]::-webkit-outer-spin-button': {
                '-webkit-appearance': 'none',
                margin: 0
              },
              '& input[type=number]::-webkit-inner-spin-button': {
                '-webkit-appearance': 'none',
                margin: 0
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenResponse(false)}>Отмена</Button>
          <Button
            onClick={() => setOpenResponse(true)}
            variant="contained"
            color="primary"
            disabled={!responseMessage.trim() || !responsePrice}
          >
            Отправить
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог просмотра откликов */}
      <Dialog
        open={openResponses}
        onClose={() => setOpenResponses(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Отклики на проект</DialogTitle>
        <DialogContent>
          <List>
            {responses.map((response) => (
              <React.Fragment key={response.id}>
                <ListItem
                  alignItems="flex-start"
                  secondaryAction={
                    response.status === 'pending' && (
                      <Box>
                        <IconButton
                          edge="end"
                          color="success"
                          onClick={() => handleUpdateStatus(response.id, 'accepted')}
                          sx={{ mr: 1 }}
                        >
                          <CheckIcon />
                        </IconButton>
                        <IconButton
                          edge="end"
                          color="error"
                          onClick={() => handleUpdateStatus(response.id, 'rejected')}
                        >
                          <CloseIcon />
                        </IconButton>
                      </Box>
                    )
                  }
                >
                  <ListItemAvatar>
                    <Avatar>{response.executorName[0]}</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle1">
                          {response.executorName}
                        </Typography>
                        <Chip
                          label={getStatusText(response.status)}
                          size="small"
                          color={getStatusColor(response.status)}
                        />
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.primary"
                          sx={{ display: 'block', mt: 1 }}
                        >
                          {response.message}
                        </Typography>
                        <Typography
                          component="span"
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: 'block', mt: 0.5 }}
                        >
                          {formatDate(response.createdAt)}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            ))}
            {responses.length === 0 && (
              <ListItem>
                <ListItemText
                  primary="Нет откликов"
                  secondary="На этот проект пока никто не откликнулся"
                />
              </ListItem>
            )}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenResponses(false)}>Закрыть</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          pb: 1
        }}>
          Отклик на проект
          <IconButton 
            onClick={() => setIsModalVisible(false)}
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              {project.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {project.description}
            </Typography>
          </Box>

          <Box sx={{ mt: 3 }}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Ваше сообщение"
              value={responseMessage}
              onChange={(e) => setResponseMessage(e.target.value)}
              placeholder="Расскажите о своем опыте и почему вы подходите для этого проекта"
              sx={{ mb: 2 }}
              required
            />

            <TextField
              fullWidth
              type="number"
              label="Ваша цена"
              value={responsePrice}
              onChange={(e) => setResponsePrice(e.target.value)}
              InputProps={{
                endAdornment: <Typography sx={{ ml: 1 }}>₽</Typography>,
                inputProps: { 
                  min: 0,
                  style: { textAlign: 'left' }
                }
              }}
              sx={{
                mb: 2,
                '& input[type=number]': {
                  '-moz-appearance': 'textfield'
                },
                '& input[type=number]::-webkit-outer-spin-button': {
                  '-webkit-appearance': 'none',
                  margin: 0
                },
                '& input[type=number]::-webkit-inner-spin-button': {
                  '-webkit-appearance': 'none',
                  margin: 0
                }
              }}
              required
            />

            <Box sx={{ 
              p: 2, 
              bgcolor: 'info.light', 
              borderRadius: 1,
              color: 'info.contrastText'
            }}>
              <Typography variant="body2">
                Советы по составлению отклика:
              </Typography>
              <ul style={{ margin: '8px 0 0', paddingLeft: '20px' }}>
                <li>Опишите свой релевантный опыт</li>
                <li>Укажите, почему вы подходите для проекта</li>
                <li>Предложите конкретные решения</li>
                <li>Укажите сроки и стоимость</li>
              </ul>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button 
            onClick={() => handleStartChat(project.clientId)}
            startIcon={<ChatIcon />}
            sx={{ mr: 'auto' }}
          >
            Написать заказчику
          </Button>
          <Button onClick={() => setIsModalVisible(false)}>
            Отмена
          </Button>
          <Button
            variant="contained"
            onClick={handleResponse}
            disabled={loading || !responseMessage.trim() || !responsePrice}
            startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
          >
            Отправить
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
    </>
  );
};

export default ProjectCard; 