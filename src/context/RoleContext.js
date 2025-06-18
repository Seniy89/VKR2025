import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export const ROLES = {
  CUSTOMER: 'customer',
  EXECUTOR: 'executor'
};

const RoleContext = createContext();

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};

export const RoleProvider = ({ children }) => {
  const { user } = useAuth();
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    if (user) {
      // Если есть пользователь, используем его роль
      setUserRole(user.role);
      localStorage.setItem('userRole', user.role);
    } else {
      // Если пользователя нет, очищаем роль
      setUserRole(null);
      localStorage.removeItem('userRole');
    }
  }, [user]);

  const setRole = (role) => {
    setUserRole(role);
    localStorage.setItem('userRole', role);
  };

  const isCustomer = () => userRole === ROLES.CUSTOMER;
  const isExecutor = () => userRole === ROLES.EXECUTOR;

  const value = {
    userRole,
    setRole,
    isCustomer,
    isExecutor,
    ROLES
  };

  return (
    <RoleContext.Provider value={value}>
      {children}
    </RoleContext.Provider>
  );
}; 