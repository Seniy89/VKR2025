import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  useMediaQuery,
  useTheme,
  InputAdornment,
  Badge,
  CircularProgress
} from '@mui/material';
import {
  Send as SendIcon,
  Search as SearchIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../context/ProfileContext';

const Chat = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user } = useAuth();
  const { profile } = useProfile();
  const {
    chats,
    messages,
    unreadCount,
    isLoading,
    error,
    createChat,
    sendMessage,
    markMessagesAsRead,
    deleteChat
  } = useChat();

  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);

  // Прокрутка к последнему сообщению
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedChat, messages]);

  // Отметка сообщений как прочитанных при выборе чата
  useEffect(() => {
    if (selectedChat) {
      markMessagesAsRead(selectedChat.id);
    }
  }, [selectedChat, markMessagesAsRead]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    await sendMessage(selectedChat.id, newMessage.trim());
    setNewMessage('');
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const filteredChats = chats.filter(chat => {
    const searchLower = searchQuery.toLowerCase();
    return (
      chat.userData.displayName.toLowerCase().includes(searchLower) ||
      chat.userData.username.toLowerCase().includes(searchLower)
    );
  });

  const renderChatList = () => (
    <Box sx={{ width: isMobile ? '100%' : 300, borderRight: 1, borderColor: 'divider' }}>
      <Box sx={{ p: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Поиск чатов..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <List sx={{ overflow: 'auto', maxHeight: 'calc(100vh - 180px)' }}>
        {filteredChats.map((chat) => {
          const unreadMessages = messages[chat.id]?.filter(
            msg => !msg.read && msg.senderId !== user.id
          ).length || 0;

          return (
            <ListItem
              key={chat.id}
              button
              selected={selectedChat?.id === chat.id}
              onClick={() => setSelectedChat(chat)}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'primary.light',
                  '&:hover': {
                    backgroundColor: 'primary.light',
                  },
                },
              }}
            >
              <ListItemAvatar>
                <Badge
                  badgeContent={unreadMessages}
                  color="error"
                  overlap="circular"
                >
                  <Avatar
                    src={chat.userData.photoURL}
                    alt={chat.userData.displayName}
                    sx={{
                      bgcolor: 'primary.main',
                      boxShadow: 2,
                      '&:hover': {
                        transform: 'scale(1.1)',
                        boxShadow: 4,
                      },
                      transition: 'all 0.3s ease',
                    }}
                  />
                </Badge>
              </ListItemAvatar>
              <ListItemText
                primary={chat.userData.displayName}
                secondary={chat.lastMessage?.text || 'Нет сообщений'}
                primaryTypographyProps={{
                  fontWeight: unreadMessages > 0 ? 'bold' : 'normal',
                }}
                secondaryTypographyProps={{
                  color: unreadMessages > 0 ? 'primary.main' : 'text.secondary',
                }}
              />
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  const renderChatWindow = () => {
    if (!selectedChat) {
      return (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: 'text.secondary',
          }}
        >
          <Typography variant="h6">Выберите чат для начала общения</Typography>
        </Box>
      );
    }

    const chatMessages = messages[selectedChat.id] || [];

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box
          sx={{
            p: 2,
            borderBottom: 1,
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              src={selectedChat.userData.photoURL}
              alt={selectedChat.userData.displayName}
              sx={{
                mr: 2,
                bgcolor: 'primary.main',
                boxShadow: 2,
                '&:hover': {
                  transform: 'scale(1.1)',
                  boxShadow: 4,
                },
                transition: 'all 0.3s ease',
              }}
            />
            <Typography variant="h6">{selectedChat.userData.displayName}</Typography>
          </Box>
          <IconButton
            color="error"
            onClick={() => {
              deleteChat(selectedChat.id);
              setSelectedChat(null);
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Box>

        <Box
          sx={{
            flex: 1,
            overflow: 'auto',
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          {chatMessages.map((message) => (
            <Box
              key={message.id}
              sx={{
                display: 'flex',
                justifyContent: message.senderId === user.id ? 'flex-end' : 'flex-start',
                mb: 1,
              }}
            >
              <Paper
                sx={{
                  p: 1.5,
                  maxWidth: '70%',
                  backgroundColor: message.senderId === user.id ? 'primary.main' : 'grey.100',
                  color: message.senderId === user.id ? 'white' : 'text.primary',
                  borderRadius: 2,
                }}
              >
                <Typography variant="body1">{message.text}</Typography>
                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    textAlign: 'right',
                    color: message.senderId === user.id ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary',
                  }}
                >
                  {new Date(message.timestamp).toLocaleTimeString()}
                </Typography>
              </Paper>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Box>

        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Введите сообщение..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    color="primary"
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                  >
                    <SendIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Box>
    );
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          color: 'error.main',
        }}
      >
        <Typography variant="h6">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: 'calc(100vh - 64px)',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
      }}
    >
      {renderChatList()}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {renderChatWindow()}
      </Box>
    </Box>
  );
};

export default Chat; 