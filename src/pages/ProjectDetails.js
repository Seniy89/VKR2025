import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  Chip,
  Divider,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Card,
  CardContent
} from '@mui/material';
import {
  Person as PersonIcon,
  AttachMoney as AttachMoneyIcon,
  Event as EventIcon,
  Category as CategoryIcon,
  Send as SendIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useProjects } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { useRole } from '../context/RoleContext';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { projects, applyToProject, updateApplicationStatus } = useProjects();
  const { user, getAllUsers } = useAuth();
  const { createChat } = useChat();
  const { isExecutor } = useRole();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openApplication, setOpenApplication] = useState(false);
  const [application, setApplication] = useState({
    price: '',
    deadline: '',
    description: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const foundProject = projects.find(p => p.id === Number(id));
    if (foundProject) {
      setProject(foundProject);
    }
    setLoading(false);
  }, [id, projects]);

  const handleApply = async () => {
    try {
      if (!application.price || !application.deadline || !application.description) {
        setError('Пожалуйста, заполните все поля');
        return;
      }

      const applicationData = {
        ...application,
        price: Number(application.price)
      };

      await applyToProject(project.id, applicationData);
      setOpenApplication(false);
      setApplication({
        price: '',
        deadline: '',
        description: ''
      });
      setError('');
    } catch (error) {
      setError('Ошибка при отправке заявки');
    }
  };

  const handleUpdateApplicationStatus = async (applicationId, status) => {
    try {
      await updateApplicationStatus(project.id, applicationId, status);
    } catch (error) {
      setError('Ошибка при обновлении статуса заявки');
    }
  };

  if (loading) {
    return (
      <Container>
        <Typography>Загрузка...</Typography>
      </Container>
    );
  }

  if (!project) {
    return (
      <Container>
        <Typography>Проект не найден</Typography>
      </Container>
    );
  }

  const isClient = user?.role === 'client' && user?.id === project.clientId;
  const responses = project.applications || [];
  const hasApplied = responses.some(response => response.executorId === user?.uid);

  console.log('ProjectDetails mounted', { user, isClient, responses, projectClientId: project.clientId });

  const allUsers = getAllUsers();
  const projectOwner = allUsers.find(u => u.uid === project.clientId);

  console.log('Project owner:', projectOwner);

  const handleCreateChatWithClient = async () => {
    if (!user || !projectOwner) return;

    try {
      const chat = await createChat(projectOwner.uid, user.uid);
      console.log('Chat created/retrieved:', chat);
      navigate(`/chat/${chat.id}`);
    } catch (error) {
      console.error('Error creating chat with client:', error);
    }
  };

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                  {project.title}
                </Typography>
                {user?.role === 'executor' && !hasApplied && project.status === 'open' && (
                  <Button
                    variant="contained"
                    startIcon={<SendIcon />}
                    onClick={() => setOpenApplication(true)}
                  >
                    Подать заявку
                  </Button>
                )}
              </Box>

              <Typography variant="body1" paragraph>
                {project.description}
              </Typography>

              <Box sx={{ mb: 3 }}>
                {project.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    sx={{ mr: 1, mb: 1 }}
                  />
                ))}
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <AttachMoneyIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body1">
                      Бюджет: {project.budget.toLocaleString()} ₽
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <EventIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body1">
                      Срок: {new Date(project.deadline).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CategoryIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body1">
                      Категория: {project.category}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body1">
                      Заказчик: {project.clientName}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {project.applications && project.applications.length > 0 && (
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Заявки на проект
                </Typography>
                <List>
                  {responses.map((response) => (
                    <React.Fragment key={response.id}>
                      <ListItem
                        secondaryAction={
                          isClient && !responses.some(r => r.isApproved) && response.status === 'pending' && (
                            <Box>
                              <Button
                                color="success"
                                onClick={() => {
                                  console.log('Approve response:', response.id);
                                }}
                              >
                                Принять
                              </Button>
                              <Button
                                color="error"
                                onClick={() => {
                                  console.log('Reject response:', response.id);
                                }}
                                sx={{ ml: 1 }}
                              >
                                Отклонить
                              </Button>
                            </Box>
                          )
                        }
                      >
                        <ListItemAvatar>
                          <Avatar>{response.executorName ? response.executorName[0] : ''}</Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={response.executorName}
                          secondary={
                            <React.Fragment>
                              <Typography
                                sx={{ display: 'inline' }}
                                component="span"
                                variant="body2"
                                color="text.primary"
                              >
                                {response.message}
                              </Typography>
                              {` — ${response.price.toLocaleString()} ₽, срок ${response.deadline}`}
                            </React.Fragment>
                          }
                        />
                        {(() => {
                          // Show chat button if user is logged in and is either the client or the executor of this response
                          const canShowChatButton = user && (
                            (isClient && response.executorId) || // Client can chat with executor
                            (isExecutor() && response.executorId === user.uid && project.clientId) // Executor can chat with client
                          );

                          if (!canShowChatButton) return null;

                          const otherParticipantId = isClient ? response.executorId : project.clientId;
                          const otherParticipant = allUsers.find(u => u.uid === otherParticipantId);
                          const buttonText = isClient ? 'Чат с исполнителем' : 'Чат с заказчиком';

                          if (!otherParticipant) {
                            console.error('Other participant not found:', { otherParticipantId, allUsers });
                            return null;
                          }

                          return (
                            <Box sx={{ ml: 4, display: 'flex', alignItems: 'center' }}>
                              <Box sx={{ mr: 2 }}>
                                {isClient ? (
                                  <>
                                    <Typography variant="caption" color="text.secondary">Исполнитель:</Typography>
                                    <Typography variant="body2">{response.executorName}</Typography>
                                  </>
                                ) : (
                                  projectOwner && (
                                    <>
                                      <Typography variant="caption" color="text.secondary">Заказчик:</Typography>
                                      <Typography variant="body2">{projectOwner.displayName}</Typography>
                                    </>
                                  )
                                )}
                              </Box>
                              <Button
                                variant="outlined"
                                size="small"
                                onClick={async () => {
                                  try {
                                    console.log('Creating chat between:', { user: user.uid, otherParticipant: otherParticipantId });
                                    const chat = await createChat(otherParticipantId);
                                    console.log('Chat created/retrieved:', chat);
                                    navigate(`/chat/${chat.id}`);
                                  } catch (error) {
                                    console.error('Error creating/getting chat:', error);
                                    // You might want to show an error message to the user here
                                  }
                                }}
                              >
                                {buttonText}
                              </Button>
                            </Box>
                          );
                        })()}
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))}
                </List>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Box>

      <Dialog open={openApplication} onClose={() => setOpenApplication(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Подача заявки на проект
          <IconButton
            aria-label="close"
            onClick={() => setOpenApplication(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Ваша цена"
                type="number"
                value={application.price}
                onChange={(e) => setApplication({ ...application, price: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Срок выполнения"
                type="date"
                value={application.deadline}
                onChange={(e) => setApplication({ ...application, deadline: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Описание вашего предложения"
                multiline
                rows={4}
                value={application.description}
                onChange={(e) => setApplication({ ...application, description: e.target.value })}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenApplication(false)}>Отмена</Button>
          <Button onClick={handleApply} variant="contained">
            Отправить заявку
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProjectDetails; 