import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Divider,
  useTheme,
  useMediaQuery,
  Typography
} from '@mui/material';
import {
  Work as WorkIcon,
  Message as MessageIcon,
  Person as PersonIcon,
  Assignment as AssignmentIcon,
  Add as AddIcon,
  Home as HomeIcon,
  Collections as CollectionsIcon
} from '@mui/icons-material';
import { useRole } from '../context/RoleContext';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { isCustomer } = useRole();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const commonMenuItems = [
    { text: 'Главная', icon: <HomeIcon />, path: '/' },
    { text: 'Все проекты', icon: <WorkIcon />, path: '/projects' },
    { text: 'Сообщения', icon: <MessageIcon />, path: '/messages' },
    { text: 'Профиль', icon: <PersonIcon />, path: '/profile' }
  ];

  const customerMenuItems = [
    { text: 'Мои проекты', icon: <AssignmentIcon />, path: '/my-projects' },
    { text: 'Создать проект', icon: <AddIcon />, path: '/create-project' }
  ];

  const executorMenuItems = [
    { text: 'Мои отклики', icon: <AssignmentIcon />, path: '/my-responses' },
    { text: 'Портфолио', icon: <CollectionsIcon />, path: '/portfolio' }
  ];

  return (
    <Drawer
      variant={isMobile ? "temporary" : "permanent"}
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          backgroundColor: theme.palette.background.default,
          borderRight: `1px solid ${theme.palette.divider}`,
        },
      }}
    >
      <Box sx={{ overflow: 'auto', mt: 8 }}>
        <List>
          {commonMenuItems.map((item) => (
            <ListItem
              button
              key={item.text}
              onClick={() => handleNavigation(item.path)}
              selected={location.pathname === item.path}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: theme.palette.primary.main + '20',
                  '&:hover': {
                    backgroundColor: theme.palette.primary.main + '30',
                  },
                },
              }}
            >
              <ListItemIcon sx={{ color: location.pathname === item.path ? 'primary.main' : 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}

          {isCustomer() ? (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" sx={{ px: 2, py: 1, color: 'text.secondary' }}>
                Управление проектами
              </Typography>
              {customerMenuItems.map((item) => (
                <ListItem
                  button
                  key={item.text}
                  onClick={() => handleNavigation(item.path)}
                  selected={location.pathname === item.path}
                  sx={{
                    '&.Mui-selected': {
                      backgroundColor: theme.palette.primary.main + '20',
                      '&:hover': {
                        backgroundColor: theme.palette.primary.main + '30',
                      },
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: location.pathname === item.path ? 'primary.main' : 'inherit' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItem>
              ))}
            </>
          ) : (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" sx={{ px: 2, py: 1, color: 'text.secondary' }}>
                Управление работами
              </Typography>
              {executorMenuItems.map((item) => (
                <ListItem
                  button
                  key={item.text}
                  onClick={() => handleNavigation(item.path)}
                  selected={location.pathname === item.path}
                  sx={{
                    '&.Mui-selected': {
                      backgroundColor: theme.palette.primary.main + '20',
                      '&:hover': {
                        backgroundColor: theme.palette.primary.main + '30',
                      },
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: location.pathname === item.path ? 'primary.main' : 'inherit' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItem>
              ))}
            </>
          )}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar; 