import React, { useState } from 'react';
import {
  Container,
  Grid,
  Typography,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery,
  Stack,
  Divider,
  CircularProgress,
  IconButton
} from '@mui/material';
import {
  Close as CloseIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useProjects } from '../context/ProjectContext';
import { useNavigate } from 'react-router-dom';
import ProjectCard from '../components/ProjectCard';

const MyProjects = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user } = useAuth();
  const { getUserProjects, deleteProject, isLoading } = useProjects();
  const [selectedProject, setSelectedProject] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const navigate = useNavigate();

  const userProjects = getUserProjects();

  const handleProjectClick = (project) => {
    setSelectedProject(project);
  };

  const handleCloseDialog = () => {
    setSelectedProject(null);
  };

  const handleEditClick = (projectId) => {
    navigate(`/edit-project/${projectId}`);
  };

  const handleDeleteClick = (project) => {
    setProjectToDelete(project);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (projectToDelete) {
      try {
        await deleteProject(projectToDelete.id);
        setDeleteDialogOpen(false);
        setProjectToDelete(null);
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  const formatDate = (date) => {
    return new Date(date).toISOString().split('T')[0];
  };

  const formatBudget = (budget) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      maximumFractionDigits: 0
    }).format(budget);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="h4">
            Мои проекты
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/create-project')}
          >
            Создать проект
          </Button>
        </Stack>
      </Box>

      <Grid container spacing={3}>
        {userProjects.map((project) => (
          <Grid item xs={12} sm={6} md={4} key={project.id}>
            <ProjectCard
              project={project}
              onFavorite={() => {}}
              isFavorite={false}
              onApply={() => {}}
            />
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
              </Grid>
            </DialogContent>
          </>
        )}
      </Dialog>

      {/* Диалог подтверждения удаления */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Подтверждение удаления</DialogTitle>
        <DialogContent>
          <Typography>
            Вы уверены, что хотите удалить проект "{projectToDelete?.title}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Отмена</Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MyProjects; 