import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Paper,
  Grid,
  Avatar,
  Divider,
  Alert,
  Tabs,
  Tab,
  IconButton,
  Card,
  CardContent,
  CardMedia,
  Rating,
  Stack,
  useTheme,
  useMediaQuery,
  CircularProgress
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Star as StarIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  Language as LanguageIcon,
  PhotoCamera as PhotoCameraIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useRole } from '../context/RoleContext';
import { useProfile } from '../context/ProfileContext';

const specializations = [
  { id: 'motion', name: 'Моушен-дизайн', description: 'Создание анимаций и видеографики' },
  { id: 'graphic', name: 'Графический дизайн', description: 'Разработка визуальных решений' },
  { id: 'ui', name: 'UI/UX дизайн', description: 'Проектирование пользовательских интерфейсов' },
  { id: 'illustration', name: 'Иллюстрация', description: 'Создание уникальных иллюстраций' },
  { id: 'branding', name: 'Брендинг', description: 'Разработка фирменного стиля' },
  { id: '3d', name: '3D-моделирование', description: 'Создание трехмерных моделей и визуализаций' },
  { id: 'web', name: 'Веб-дизайн', description: 'Дизайн веб-сайтов и веб-приложений' },
  { id: 'print', name: 'Полиграфический дизайн', description: 'Дизайн печатной продукции' },
  { id: 'social', name: 'SMM-дизайн', description: 'Дизайн для социальных сетей' },
  { id: 'game', name: 'Гейм-дизайн', description: 'Дизайн игровых интерфейсов и ассетов' }
];

const Profile = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user } = useAuth();
  const { userRole, isExecutor } = useRole();
  const {
    profileData,
    isLoading,
    error,
    updateProfile,
    updateProfilePhoto,
    updateSpecializations
  } = useProfile();
  const [activeTab, setActiveTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingSpecializations, setIsEditingSpecializations] = useState(false);
  const [tempSpecializations, setTempSpecializations] = useState([]);
  const [localProfileData, setLocalProfileData] = useState({
    name: '',
    about: '',
    specializations: [],
    experience: '',
    skills: '',
    education: '',
    languages: '',
    location: '',
    website: '',
    photoURL: '',
    rating: 0,
    completedProjects: 0
  });
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (profileData) {
      setLocalProfileData(profileData);
      setTempSpecializations(profileData.specializations || []);
    }
  }, [profileData]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleInputChange = (field) => (event) => {
    setLocalProfileData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSpecializationChange = (event) => {
    setTempSpecializations(event.target.value);
  };

  const handleApplySpecializations = async () => {
    const success = await updateSpecializations(tempSpecializations);
    if (success) {
      setLocalProfileData(prev => ({
        ...prev,
        specializations: tempSpecializations
      }));
      setSuccess('Специализации успешно обновлены');
    }
    setIsEditingSpecializations(false);
  };

  const handleSaveProfile = async () => {
    await updateProfile(localProfileData);
    setIsEditing(false);
    setSuccess('Профиль успешно обновлен');
  };

  const handlePhotoChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      await updateProfilePhoto(file);
    }
  };

  const renderProfileHeader = () => (
    <Box sx={{ position: 'relative', mb: 4 }}>
      <Box
        sx={{
          position: 'relative',
          textAlign: 'center',
          mb: 4
        }}
      >
        <Box
          sx={{
            position: 'relative',
            display: 'inline-block',
            '&:hover .avatar-overlay': {
              opacity: 1
            }
          }}
        >
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            id="photo-upload"
            onChange={handlePhotoChange}
          />
          <label htmlFor="photo-upload">
            <Avatar
              src={localProfileData.photoURL}
              alt={localProfileData.name}
              sx={{
                width: 120,
                height: 120,
                cursor: 'pointer',
                bgcolor: 'primary.main',
                boxShadow: 2,
                '&:hover': {
                  transform: 'scale(1.1)',
                  boxShadow: 4,
                },
                transition: 'all 0.3s ease',
              }}
            />
          </label>
          <Box
            className="avatar-overlay"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: '50%',
              bgcolor: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0,
              transition: 'opacity 0.3s ease',
              cursor: 'pointer'
            }}
          >
            <Typography variant="body2" color="white">
              Изменить фото
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box sx={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
        <Typography variant="h4" gutterBottom>
          {localProfileData.name}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          {user?.email}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          {userRole === 'executor' ? 'Исполнитель' : 'Заказчик'}
        </Typography>
        {isExecutor() && (
          <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 1 }}>
            <Chip
              icon={<StarIcon />}
              label={`Рейтинг: ${localProfileData.rating}`}
              color="primary"
              variant="outlined"
            />
            <Chip
              icon={<WorkIcon />}
              label={`Завершенных проектов: ${localProfileData.completedProjects}`}
              color="primary"
              variant="outlined"
            />
          </Stack>
        )}
      </Box>
    </Box>
  );

  const renderBasicInfo = () => (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Основная информация</Typography>
          <IconButton onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? <CancelIcon /> : <EditIcon />}
          </IconButton>
        </Box>
        <Box component="form" onSubmit={handleSaveProfile}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Имя"
                name="name"
                value={localProfileData.name}
                onChange={handleInputChange('name')}
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                value={user?.email || ''}
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="О себе"
                name="about"
                value={localProfileData.about}
                onChange={handleInputChange('about')}
                multiline
                rows={4}
                disabled={!isEditing}
                placeholder="Расскажите о себе, своем опыте и достижениях..."
              />
            </Grid>
            {isEditing && (
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SaveIcon />}
                  sx={{ mr: 1 }}
                >
                  Сохранить
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  onClick={() => setIsEditing(false)}
                >
                  Отмена
                </Button>
              </Grid>
            )}
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );

  const renderExecutorInfo = () => {
    if (!isExecutor()) return null;

    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Профессиональная информация</Typography>
              <Box>
                {isEditing && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSaveProfile}
                    startIcon={<SaveIcon />}
                    sx={{ mr: 1 }}
                  >
                    Сохранить
                  </Button>
                )}
                <IconButton
                  color="primary"
                  onClick={() => setIsEditing(!isEditing)}
                  sx={{ ml: 1 }}
                >
                  {isEditing ? <CancelIcon /> : <EditIcon />}
                </IconButton>
              </Box>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="specializations-label">Специализации</InputLabel>
                  <Select
                    labelId="specializations-label"
                    multiple
                    value={tempSpecializations}
                    onChange={handleSpecializationChange}
                    disabled={!isEditing}
                    renderValue={(selected) => (
                      <Stack direction="row" spacing={1} flexWrap="wrap">
                        {selected.map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Stack>
                    )}
                  >
                    {specializations.map((spec) => (
                      <MenuItem key={spec.id} value={spec.name}>
                        <Box>
                          <Typography variant="body1">{spec.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {spec.description}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                  {isEditing && (
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleApplySpecializations}
                        startIcon={<SaveIcon />}
                      >
                        Сохранить специализации
                      </Button>
                    </Box>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Опыт работы"
                  value={localProfileData.experience}
                  onChange={handleInputChange('experience')}
                  disabled={!isEditing}
                  sx={{ height: 'auto' }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Навыки"
                  value={localProfileData.skills}
                  onChange={handleInputChange('skills')}
                  disabled={!isEditing}
                  sx={{ height: 'auto' }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Образование"
                  value={localProfileData.education}
                  onChange={handleInputChange('education')}
                  disabled={!isEditing}
                  sx={{ height: 'auto' }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Языки"
                  value={localProfileData.languages}
                  onChange={handleInputChange('languages')}
                  disabled={!isEditing}
                  sx={{ height: 'auto' }}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    );
  };

  const renderPortfolio = () => (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Портфолио</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Ссылка на портфолио"
              name="website"
              value={localProfileData.website}
              onChange={handleInputChange('website')}
              placeholder="https://..."
              sx={{ mb: 3 }}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Описание портфолио
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={6}
              placeholder="Расскажите о своих лучших работах, проектах и достижениях..."
              value={localProfileData.portfolioDescription || ''}
              onChange={(e) => setLocalProfileData(prev => ({ ...prev, portfolioDescription: e.target.value }))}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Ключевые проекты
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {[1, 2, 3].map((_, index) => (
                <Card key={index} variant="outlined">
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={4}>
                        <Box
                          sx={{
                            height: 200,
                            bgcolor: 'background.default',
                            borderRadius: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Typography color="text.secondary">
                            Изображение проекта
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={8}>
                        <TextField
                          fullWidth
                          label="Название проекта"
                          sx={{ mb: 2 }}
                        />
                        <TextField
                          fullWidth
                          multiline
                          rows={3}
                          label="Описание проекта"
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        {renderProfileHeader()}
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{ mb: 3 }}
          centered
        >
          <Tab label="Основная информация" />
          {isExecutor() && <Tab label="Профессиональная информация" />}
          {isExecutor() && <Tab label="Портфолио" />}
        </Tabs>

        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        {activeTab === 0 && renderBasicInfo()}
        {activeTab === 1 && isExecutor() && renderExecutorInfo()}
        {activeTab === 2 && isExecutor() && renderPortfolio()}
      </Box>
    </Container>
  );
};

export default Profile; 