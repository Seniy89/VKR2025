import React from 'react';
import { Box, Typography, Button, Card, CardContent } from '@mui/material';
import { ROLES } from '../context/RoleContext';

const RoleSelection = ({ onSelect }) => {
  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, p: 2 }}>
      <Typography variant="h4" gutterBottom align="center">
        Выберите вашу роль
      </Typography>
      <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
        Выберите, как вы хотите использовать платформу
      </Typography>

      <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center' }}>
        <Card 
          sx={{ 
            maxWidth: 345,
            cursor: 'pointer',
            '&:hover': {
              transform: 'translateY(-4px)',
              transition: 'transform 0.2s ease-in-out'
            }
          }}
          onClick={() => onSelect(ROLES.CUSTOMER)}
        >
          <CardContent>
            <Typography variant="h5" component="div" gutterBottom>
              Заказчик
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Размещайте заказы и находите исполнителей для ваших проектов
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" component="div">
                • Создание заказов
              </Typography>
              <Typography variant="body2" component="div">
                • Управление проектами
              </Typography>
              <Typography variant="body2" component="div">
                • Выбор исполнителей
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card 
          sx={{ 
            maxWidth: 345,
            cursor: 'pointer',
            '&:hover': {
              transform: 'translateY(-4px)',
              transition: 'transform 0.2s ease-in-out'
            }
          }}
          onClick={() => onSelect(ROLES.EXECUTOR)}
        >
          <CardContent>
            <Typography variant="h5" component="div" gutterBottom>
              Исполнитель
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Выполняйте заказы и развивайте свой портфолио
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" component="div">
                • Создание портфолио
              </Typography>
              <Typography variant="body2" component="div">
                • Подача заявок на проекты
              </Typography>
              <Typography variant="body2" component="div">
                • Управление профилем
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default RoleSelection; 