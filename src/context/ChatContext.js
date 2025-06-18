import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

// Функции для работы с localStorage
const STORAGE_KEY = 'freelance_chats';

const loadChatsFromStorage = () => {
  try {
    const storedChats = localStorage.getItem(STORAGE_KEY);
    return storedChats ? JSON.parse(storedChats) : [];
  } catch (error) {
    console.error('Error loading chats from storage:', error);
    return [];
  }
};

const saveChatsToStorage = (chats) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
  } catch (error) {
    console.error('Error saving chats to storage:', error);
  }
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Загрузка чатов при инициализации
  useEffect(() => {
    const loadChats = () => {
      setIsLoading(true);
      try {
        const storedChats = loadChatsFromStorage();
        setChats(storedChats);
      } catch (error) {
        console.error('Error loading chats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadChats();
  }, []);

  // Получение чата между двумя пользователями
  const getChat = (chatId) => {
    console.log('Getting chat:', chatId);
    const chat = chats.find(c => c.id === chatId);
    console.log('Found chat:', chat);
    return chat;
  };

  // Создание нового чата
  const createChat = (participantId) => {
    console.log('Creating chat with participant:', participantId);
    console.log('Current user:', user);

    if (!user) {
      console.error('No authenticated user found');
      throw new Error('Необходимо авторизоваться для создания чата');
    }

    const user1Id = user.uid;
    const user2Id = participantId;

    console.log('User IDs:', { user1Id, user2Id });

    if (!user1Id || !user2Id || user1Id === user2Id) {
      console.error('Invalid user IDs:', { user1Id, user2Id });
      throw new Error('Неверные идентификаторы участников чата');
    }

    // Проверяем, существует ли уже чат между этими двумя пользователями
    const existingChat = chats.find(chat => {
      const participants = chat.participants;
      const exists = (participants.includes(user1Id) && participants.includes(user2Id)) ||
                    (participants.includes(user2Id) && participants.includes(user1Id));
      console.log('Checking existing chat:', { chat, exists });
      return exists;
    });

    if (existingChat) {
      console.log('Found existing chat:', existingChat);
      return existingChat;
    }

    const newChat = {
      id: Date.now().toString(),
      participants: [user1Id, user2Id],
      messages: [],
      createdAt: new Date().toISOString(),
      type: 'direct_chat'
    };

    console.log('Creating new chat:', newChat);

    const updatedChats = [...chats, newChat];
    setChats(updatedChats);
    saveChatsToStorage(updatedChats);
    return newChat;
  };

  // Отправка сообщения
  const sendMessage = (chatId, content) => {
    console.log('Sending message:', { chatId, content });
    console.log('Current user:', user);

    if (!user) {
      console.error('No authenticated user found');
      throw new Error('Необходимо авторизоваться для отправки сообщений');
    }

    const chat = chats.find(c => c.id === chatId);
    console.log('Found chat:', chat);

    if (!chat) {
      console.error('Chat not found:', chatId);
      throw new Error('Чат не найден');
    }

    if (!chat.participants.includes(user.uid)) {
      console.error('User not in chat participants:', { userId: user.uid, participants: chat.participants });
      throw new Error('У вас нет доступа к этому чату');
    }

    const newMessage = {
      id: Date.now().toString(),
      senderId: user.uid,
      content,
      timestamp: new Date().toISOString(),
      read: false
    };

    console.log('New message:', newMessage);

    const updatedChats = chats.map(c => {
      if (c.id === chatId) {
        return {
          ...c,
          messages: [...c.messages, newMessage]
        };
      }
      return c;
    });

    console.log('Updated chats:', updatedChats);
    setChats(updatedChats);
    saveChatsToStorage(updatedChats);
    return newMessage;
  };

  // Получение всех чатов текущего пользователя
  const getUserChats = () => {
    if (!user) {
      console.log('No user found, returning empty chats array');
      return [];
    }
    console.log('Getting chats for user:', user.uid);
    const userChats = chats.filter(chat => chat.participants.includes(user.uid));
    console.log('Found user chats:', userChats);
    return userChats;
  };

  // Получение непрочитанных сообщений
  const getUnreadMessages = (chatId) => {
    if (!user) return 0;
    const chat = chats.find(c => c.id === chatId);
    if (!chat) return 0;
    return chat.messages.filter(m => 
      m.senderId !== user.uid && !m.read
    ).length;
  };

  // Отметка сообщений как прочитанных
  const markMessagesAsRead = (chatId) => {
    if (!user) return;

    const updatedChats = chats.map(chat => {
      if (chat.id === chatId) {
        return {
          ...chat,
          messages: chat.messages.map(message => ({
            ...message,
            read: message.senderId !== user.uid ? true : message.read
          }))
        };
      }
      return chat;
    });

    setChats(updatedChats);
    saveChatsToStorage(updatedChats);
  };

  const value = {
    chats,
    isLoading,
    createChat,
    sendMessage,
    getUserChats,
    getChat,
    getUnreadMessages,
    markMessagesAsRead
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}; 