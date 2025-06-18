import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  Avatar,
  Divider,
  CircularProgress
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';

const ChatWindow = ({ chatId }) => {
  const { getChat, sendMessage, markMessagesAsRead } = useChat();
  const { user, getUserById } = useAuth();
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [participantInfo, setParticipantInfo] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const loadChat = async () => {
      setIsLoading(true);
      try {
        console.log('Loading chat:', chatId);
        const chatData = getChat(chatId);
        console.log('Chat data loaded:', chatData);
        setChat(chatData);
        
        if (chatData) {
          const participantId = chatData.participants.find(id => id !== user.uid);
          console.log('Loading participant info:', participantId);
          const participant = await getUserById(participantId);
          console.log('Participant info loaded:', participant);
          setParticipantInfo(participant);
          markMessagesAsRead(chatId);
        }
      } catch (error) {
        console.error('Error loading chat:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadChat();
  }, [chatId, getChat, markMessagesAsRead, user.uid, getUserById]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat?.messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      console.log('Sending message in chat:', { chatId, message: message.trim() });
      await sendMessage(chatId, message.trim());
      console.log('Message sent successfully');
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getParticipantName = () => {
    if (!participantInfo) return 'Загрузка...';
    return participantInfo.displayName || 'Пользователь';
  };

  const getParticipantAvatar = () => {
    if (!participantInfo) return '';
    return participantInfo.photoURL || participantInfo.displayName?.[0] || '';
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!chat) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Typography variant="h6" color="text.secondary">
          Чат не найден
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Заголовок чата */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          borderBottom: 1,
          borderColor: 'divider'
        }}
      >
        <Avatar 
          src={getParticipantAvatar()}
          sx={{ mr: 2 }}
        >
          {getParticipantName()[0]}
        </Avatar>
        <Box>
          <Typography variant="h6">{getParticipantName()}</Typography>
          {chat?.projectId && (
            <Typography variant="caption" color="text.secondary">
              Проект #{chat.projectId}
            </Typography>
          )}
        </Box>
      </Paper>

      {/* Сообщения */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 1
        }}
      >
        {(chat.messages || []).map((msg) => (
          <Box
            key={msg.id}
            sx={{
              display: 'flex',
              justifyContent: msg.senderId === user.uid ? 'flex-end' : 'flex-start',
              mb: 1
            }}
          >
            <Box
              sx={{
                maxWidth: '70%',
                bgcolor: msg.senderId === user.uid ? 'primary.main' : 'grey.100',
                color: msg.senderId === user.uid ? 'white' : 'text.primary',
                p: 1.5,
                borderRadius: 2,
                position: 'relative'
              }}
            >
              <Typography 
                variant="body1" 
                sx={{ 
                  color: msg.senderId === user.uid ? 'white' : 'text.primary',
                  fontWeight: 400
                }}
              >
                {msg.content}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  textAlign: 'right',
                  mt: 0.5,
                  opacity: 0.7,
                  color: msg.senderId === user.uid ? 'white' : 'text.secondary'
                }}
              >
                {formatTimestamp(msg.timestamp)}
              </Typography>
            </Box>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Box>

      {/* Форма отправки сообщения */}
      <Paper
        component="form"
        onSubmit={handleSendMessage}
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          borderTop: 1,
          borderColor: 'divider'
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Введите сообщение..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          size="small"
          sx={{ mr: 1 }}
        />
        <IconButton
          color="primary"
          type="submit"
          disabled={!message.trim()}
        >
          <SendIcon />
        </IconButton>
      </Paper>
    </Box>
  );
};

export default ChatWindow; 