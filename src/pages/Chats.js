import React, { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  TextField,
  InputAdornment
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import ChatList from '../components/ChatList';
import ChatWindow from '../components/ChatWindow';
import SearchIcon from '@mui/icons-material/Search';

const Chats = () => {
  const { user } = useAuth();
  const { getAllUsers } = useAuth();
  const { createChat } = useChat();
  const navigate = useNavigate();
  const { chatId } = useParams();
  const [openNewChat, setOpenNewChat] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState('');

  const allUsers = getAllUsers();

  const filteredUsers = allUsers.filter(u =>
    u.displayName.toLowerCase().includes(userSearchQuery.toLowerCase())
  );

  const handleCreateChat = (participantId) => {
    try {
      console.log('Creating chat with participant:', participantId);
      const chat = createChat(participantId);
      console.log('Chat created/retrieved:', chat);
      setOpenNewChat(false);
      navigate(`/chat/${chat.id}`);
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  // Функция для создания чата при отклике на проект
  const handleCreateProjectChat = (projectId, participantId) => {
    try {
      console.log('Creating project chat:', { projectId, participantId });
      const chat = createChat(participantId);
      console.log('Base chat created:', chat);
      
      // Обновляем чат с информацией о проекте
      const updatedChat = {
        ...chat,
        projectId,
        type: 'project_chat'
      };
      
      console.log('Updated chat with project info:', updatedChat);
      
      // Обновляем чат в списке
      const updatedChats = chats.map(c => 
        c.id === chat.id ? updatedChat : c
      );
      setChats(updatedChats);
      
      setOpenNewChat(false);
      navigate(`/chat/${chat.id}`);
    } catch (error) {
      console.error('Error creating project chat:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4, height: 'calc(100vh - 100px)' }}>
      <Grid container spacing={2} sx={{ height: '100%' }}>
        {/* Список чатов */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
              <Typography variant="h6" component="h2">
                Чаты
              </Typography>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                onClick={() => {
                  setUserSearchQuery(''); // Reset search when opening dialog
                  setOpenNewChat(true);
                }}
              >
                Новый чат
              </Button>
            </Box>
            <Box sx={{ flex: 1, overflow: 'auto' }}>
              <ChatList />
            </Box>
          </Paper>
        </Grid>

        {/* Окно чата */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ height: '100%' }}>
            {chatId ? (
              <ChatWindow chatId={chatId} />
            ) : (
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Typography variant="h6" color="text.secondary">
                  Выберите чат или создайте новый
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Диалог создания нового чата */}
      <Dialog open={openNewChat} onClose={() => setOpenNewChat(false)} fullWidth maxWidth="sm">
        <DialogTitle>Выберите пользователя для чата</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Поиск пользователей..."
            value={userSearchQuery}
            onChange={(e) => setUserSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
          <List>
            {filteredUsers
              .filter(u => u.uid !== user?.uid) // Filter out current user
              .map(u => (
                <React.Fragment key={u.uid}>
                  <ListItem
                    button
                    onClick={() => handleCreateChat(u.uid)}
                  >
                    <ListItemAvatar>
                      <Avatar>{u.displayName ? u.displayName[0] : ''}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={u.displayName}
                      secondary={u.role === 'customer' ? 'Заказчик' : 'Исполнитель'}
                    />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNewChat(false)}>Отмена</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Chats; 