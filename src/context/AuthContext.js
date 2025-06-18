import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const testUsers = [
  {
    email: 'admin1@test.com',
    password: 'admin1',
    displayName: 'Admin Customer',
    role: 'customer',
    uid: 'user-1'
  },
  {
    email: 'admin2@test.com',
    password: 'admin2',
    displayName: 'Admin Executor',
    role: 'executor',
    uid: 'user-2'
  },
  {
    email: 'customer3@test.com',
    password: 'customer3',
    displayName: 'Test Customer 3',
    role: 'customer',
    uid: 'user-3'
  },
  {
    email: 'executor4@test.com',
    password: 'executor4',
    displayName: 'Test Executor 4',
    role: 'executor',
    uid: 'user-4'
  },
  {
    email: 'customer5@test.com',
    password: 'customer5',
    displayName: 'Test Customer 5',
    role: 'customer',
    uid: 'user-5'
  },
  {
    email: 'executor6@test.com',
    password: 'executor6',
    displayName: 'Test Executor 6',
    role: 'executor',
    uid: 'user-6'
  },
  {
    email: 'testcustomer@test.com',
    password: 'testcustomer',
    displayName: 'Test Customer',
    role: 'customer',
    uid: 'user-100',
    avatar: 'https://avatars.dicebear.com/api/identicon/testcustomer.svg'
  },
  {
    email: 'testexecutor@test.com',
    password: 'testexecutor',
    displayName: 'Test Executor',
    role: 'executor',
    uid: 'user-101',
    avatar: 'https://avatars.dicebear.com/api/identicon/testexecutor.svg'
  }
];

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Проверяем сохраненного пользователя при загрузке
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      // Проверяем, что пользователь все еще существует в тестовых данных
      const validUser = testUsers.find(u => u.uid === parsedUser.uid);
      if (validUser) {
        setUser(parsedUser);
      } else {
        // Если пользователь не найден, очищаем данные
        localStorage.removeItem('user');
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Ищем пользователя среди тестовых
    const testUser = testUsers.find(
      u => u.email === email && u.password === password
    );

    if (testUser) {
      const userData = {
        email: testUser.email,
        displayName: testUser.displayName,
        role: testUser.role,
        uid: testUser.uid
      };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    }

    throw new Error('Неверный логин или пароль');
  };

  const register = async (email, password, name) => {
    // Проверяем, не существует ли уже пользователь с таким email
    if (testUsers.some(u => u.email === email)) {
      throw new Error('Пользователь с таким email уже существует');
    }

    // В реальном приложении здесь была бы регистрация через API
    const newUser = {
      email,
      displayName: name,
      role: 'customer', // По умолчанию регистрируем как заказчика
      uid: `user-${Date.now()}` // Генерируем уникальный ID
    };

    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    return newUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
  };

  const getAllUsers = () => {
    return testUsers;
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    getAllUsers
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 