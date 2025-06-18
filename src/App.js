import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProjectProvider } from './context/ProjectContext';
import { PortfolioProvider } from './context/PortfolioContext';
import { RoleProvider, useRole, ROLES } from './context/RoleContext';
import Layout from './components/Layout';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Projects from './pages/Projects';
import ProjectDetails from './pages/ProjectDetails';
import CreateProject from './pages/CreateProject';
import Portfolio from './pages/Portfolio';
import ExecutorList from './pages/ExecutorList';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  IconButton,
  useTheme,
  useMediaQuery,
  CircularProgress
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  Person as PersonIcon,
  Menu as MenuIcon,
  Chat as ChatIcon,
  Home as HomeIcon,
  Work as WorkIcon,
  Add as AddIcon,
  Folder as FolderIcon,
  Send as SendIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { ChatProvider } from './context/ChatContext';
import Chat from './pages/Chat';
import { ProfileProvider, useProfile } from './context/ProfileContext';
import MyProjects from './pages/MyProjects';
import EditProject from './pages/EditProject';
import Messages from './pages/Messages';
import { useProjects } from './context/ProjectContext';
import { useChat } from './context/ChatContext';
import { ResponseProvider } from './context/ResponseContext';
import MyResponses from './pages/MyResponses';
import CreatePortfolio from './pages/CreatePortfolio';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FF6B00', // Яркий оранжевый
      light: '#FF8E53',
      dark: '#E65100',
    },
    secondary: {
      main: '#FF8E53', // Темный оранжевый
      light: '#FFB74D',
      dark: '#F57C00',
    },
    background: {
      default: '#1a1a1a', // Темный фон
      paper: '#2d2d2d', // Чуть светлее для карточек
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
  },
  typography: {
    fontFamily: '"Montserrat", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h4: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
    subtitle1: {
      fontWeight: 500,
      letterSpacing: '0.01em',
    },
    subtitle2: {
      fontWeight: 500,
      letterSpacing: '0.01em',
    },
    body1: {
      fontWeight: 400,
      letterSpacing: '0.01em',
    },
    body2: {
      fontWeight: 400,
      letterSpacing: '0.01em',
    },
    button: {
      fontWeight: 600,
      letterSpacing: '0.02em',
      textTransform: 'none',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(255, 107, 0, 0.3)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 
              'linear-gradient(45deg, rgba(255, 107, 0, 0.05) 25%, transparent 25%),' +
              'linear-gradient(-45deg, rgba(255, 107, 0, 0.05) 25%, transparent 25%),' +
              'linear-gradient(45deg, transparent 75%, rgba(255, 107, 0, 0.05) 75%),' +
              'linear-gradient(-45deg, transparent 75%, rgba(255, 107, 0, 0.05) 75%)',
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
            opacity: 0.1,
            pointerEvents: 'none',
            borderRadius: 12,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'none',
          },
        },
      },
    },
  },
});

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  const { userRole } = useRole();

  if (!user) {
    return <Navigate to="/" />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" />;
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

const AppRoutes = () => {
  const { user } = useAuth();
  const { isCustomer, isExecutor } = useRole();
  const { isLoading: isProfileLoading } = useProfile();
  const { isLoading: isProjectsLoading } = useProjects();
  const { isLoading: isChatLoading } = useChat();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const isLoading = isProfileLoading || isProjectsLoading || isChatLoading;

  const drawer = (
    <Box sx={{ width: 250, mt: 8 }}>
      <List>
        <ListItemButton component={Link} to="/">
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Главная" />
        </ListItemButton>
        <ListItemButton component={Link} to="/projects">
          <ListItemIcon>
            <WorkIcon />
          </ListItemIcon>
          <ListItemText primary="Все проекты" />
        </ListItemButton>
        {isCustomer() && (
          <>
            <ListItemButton component={Link} to="/my-projects">
              <ListItemIcon>
                <AssignmentIcon />
              </ListItemIcon>
              <ListItemText primary="Мои проекты" />
            </ListItemButton>
            <ListItemButton component={Link} to="/create-project">
              <ListItemIcon>
                <AddIcon />
              </ListItemIcon>
              <ListItemText primary="Создать проект" />
            </ListItemButton>
          </>
        )}
        {isExecutor() && (
          <>
            <ListItemButton component={Link} to="/my-responses">
              <ListItemIcon>
                <SendIcon />
              </ListItemIcon>
              <ListItemText primary="Мои отклики" />
            </ListItemButton>
            <ListItemButton component={Link} to="/portfolio">
              <ListItemIcon>
                <FolderIcon />
              </ListItemIcon>
              <ListItemText primary="Портфолио" />
            </ListItemButton>
          </>
        )}
        <ListItemButton component={Link} to="/messages">
          <ListItemIcon>
            <ChatIcon />
          </ListItemIcon>
          <ListItemText primary="Сообщения" />
        </ListItemButton>
        <ListItemButton component={Link} to="/profile">
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText primary="Профиль" />
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <Navbar />
      {user && !isLoading && (
        <>
          <Box
            component="nav"
            sx={{ width: { md: 250 }, flexShrink: { md: 0 } }}
          >
            {isMobile ? (
              <Drawer
                variant="temporary"
                anchor="left"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                  keepMounted: true,
                }}
                sx={{
                  display: { xs: 'block', md: 'none' },
                  '& .MuiDrawer-paper': { 
                    boxSizing: 'border-box', 
                    width: 250,
                    mt: 8
                  },
                }}
              >
                {drawer}
              </Drawer>
            ) : (
              <Drawer
                variant="permanent"
                sx={{
                  display: { xs: 'none', md: 'block' },
                  '& .MuiDrawer-paper': { 
                    boxSizing: 'border-box', 
                    width: 250,
                    mt: 8,
                    borderRight: '1px solid rgba(255, 255, 255, 0.12)'
                  },
                }}
                open
              >
                {drawer}
              </Drawer>
            )}
          </Box>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ 
              mr: 2, 
              display: { md: 'none' },
              position: 'fixed',
              top: 16,
              left: 16,
              zIndex: 1200
            }}
          >
            <MenuIcon />
          </IconButton>
        </>
      )}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${user && !isLoading ? 250 : 0}px)` },
          ml: { md: user && !isLoading ? '250px' : 0 },
          mt: 8
        }}
      >
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <CircularProgress />
          </Box>
        ) : (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />

            {/* Защищенные маршруты */}
            {user && (
              <>
                <Route path="/profile" element={<Profile />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/my-projects" element={<MyProjects />} />
                <Route path="/create-project" element={<CreateProject />} />
                <Route path="/edit-project/:id" element={<EditProject />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/chat/:chatId" element={<Messages />} />
                
                {/* Маршруты для заказчика */}
                {isCustomer() && (
                  <>
                    <Route path="/executors" element={<ExecutorList />} />
                  </>
                )}

                {/* Маршруты для исполнителя */}
                {isExecutor() && (
                  <>
                    <Route path="/portfolio" element={<Portfolio />} />
                    <Route path="/portfolio/create" element={<CreatePortfolio />} />
                    <Route path="/my-responses" element={<MyResponses />} />
                  </>
                )}
              </>
            )}

            {/* Редирект для несуществующих маршрутов */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        )}
      </Box>
    </Box>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <RoleProvider>
          <ProjectProvider>
            <PortfolioProvider>
              <ProfileProvider>
                <ChatProvider>
                  <ResponseProvider>
                    <AppRoutes />
                  </ResponseProvider>
                </ChatProvider>
              </ProfileProvider>
            </PortfolioProvider>
          </ProjectProvider>
        </RoleProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App; 