import React from 'react';
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
  Divider
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import ChatList from '../components/ChatList';
import ChatWindow from '../components/ChatWindow';

const Messages = () => {
  const { user } = useAuth();
  const { createChat, getUserChats } = useChat();
  const navigate = useNavigate();
  const { chatId } = useParams();
  const [openNewChat, setOpenNewChat] = React.useState(false);
  const chats = getUserChats();

  const handleCreateChat = (participantId) => {
    try {
      const chat = createChat(participantId);
      setOpenNewChat(false);
      navigate(`/chat/${chat.id}`);
    } catch (error) {
      console.error('Error creating chat:', error);
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
                Сообщения
              </Typography>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                onClick={() => setOpenNewChat(true)}
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
      <Dialog open={openNewChat} onClose={() => setOpenNewChat(false)}>
        <DialogTitle>Выберите пользователя для чата</DialogTitle>
        <DialogContent>
          <List>
            <ListItem
              button
              onClick={() => handleCreateChat('user-1')}
              disabled={user?.uid === 'user-1'}
            >
              <ListItemAvatar>
                <Avatar>A</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary="Admin Customer"
                secondary="Заказчик"
              />
            </ListItem>
            <Divider />
            <ListItem
              button
              onClick={() => handleCreateChat('user-2')}
              disabled={user?.uid === 'user-2'}
            >
              <ListItemAvatar>
                <Avatar>A</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary="Admin Executor"
                secondary="Исполнитель"
              />
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNewChat(false)}>Отмена</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Messages; 