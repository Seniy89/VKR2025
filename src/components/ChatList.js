import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Badge,
  Box,
  Divider
} from '@mui/material';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ChatList = () => {
  const { getUserChats, getUnreadMessages } = useChat();
  const { user } = useAuth();
  const navigate = useNavigate();
  const chats = getUserChats() || [];

  const formatLastMessage = (chat) => {
    if (!chat.messages || chat.messages.length === 0) {
      return 'Нет сообщений';
    }
    const lastMessage = chat.messages[chat.messages.length - 1];
    return lastMessage.content;
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getParticipantName = (chat) => {
    const participantId = chat.participants.find(id => id !== user.uid);
    // В реальном приложении здесь бы был запрос к API для получения информации о пользователе
    return participantId === 'user-1' ? 'Admin Customer' : 'Admin Executor';
  };

  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {chats.map((chat) => (
        <React.Fragment key={chat.id}>
          <ListItem
            button
            onClick={() => navigate(`/chat/${chat.id}`)}
            sx={{
              '&:hover': {
                bgcolor: 'action.hover'
              }
            }}
          >
            <ListItemAvatar>
              <Badge
                badgeContent={getUnreadMessages(chat.id)}
                color="primary"
                overlap="circular"
              >
                <Avatar>
                  {getParticipantName(chat)[0]}
                </Avatar>
              </Badge>
            </ListItemAvatar>
            <ListItemText
              primary={getParticipantName(chat)}
              secondary={
                <Box component="span" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography
                    component="span"
                    variant="body2"
                    color="text.primary"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      maxWidth: '200px'
                    }}
                  >
                    {formatLastMessage(chat)}
                  </Typography>
                  <Typography
                    component="span"
                    variant="body2"
                    color="text.secondary"
                    sx={{ ml: 1 }}
                  >
                    {chat.messages.length > 0 &&
                      formatTimestamp(chat.messages[chat.messages.length - 1].timestamp)}
                  </Typography>
                </Box>
              }
            />
          </ListItem>
          <Divider variant="inset" component="li" />
        </React.Fragment>
      ))}
      {chats.length === 0 && (
        <ListItem>
          <ListItemText
            primary="Нет активных чатов"
            secondary="Начните общение, выбрав пользователя"
          />
        </ListItem>
      )}
    </List>
  );
};

export default ChatList; 