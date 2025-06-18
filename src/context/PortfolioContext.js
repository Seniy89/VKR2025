import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import axios from 'axios';

const PortfolioContext = createContext();

// Функция для логирования с временной меткой
const log = (action, data) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [PortfolioSystem] ${action}:`, data);
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};

export const PortfolioProvider = ({ children }) => {
  const { user } = useAuth();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      loadPortfolio();
    }
  }, [user]);

  const loadPortfolio = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/portfolio/${user.uid}`);
      setPortfolio(response.data);
      setError(null);
    } catch (error) {
      setError('Не удалось загрузить портфолио');
    } finally {
      setLoading(false);
    }
  };

  const addPortfolioItem = async (formData) => {
    try {
      const response = await axios.post('/api/portfolio', formData);
      setPortfolio(prev => ({
        ...prev,
        items: [...prev.items, response.data]
      }));
      return response.data;
    } catch (error) {
      throw new Error('Не удалось добавить элемент в портфолио');
    }
  };

  const updatePortfolioItem = async (itemId, formData) => {
    try {
      const response = await axios.put(`/api/portfolio/${itemId}`, formData);
      setPortfolio(prev => ({
        ...prev,
        items: prev.items.map(item =>
          item._id === itemId ? response.data : item
        )
      }));
      return response.data;
    } catch (error) {
      throw new Error('Не удалось обновить элемент портфолио');
    }
  };

  const deletePortfolioItem = async (itemId) => {
    try {
      await axios.delete(`/api/portfolio/${itemId}`);
      setPortfolio(prev => ({
        ...prev,
        items: prev.items.filter(item => item._id !== itemId)
      }));
    } catch (error) {
      throw new Error('Не удалось удалить элемент портфолио');
    }
  };

  const reorderPortfolioItems = async (items) => {
    try {
      await axios.put('/api/portfolio/reorder', { items });
      setPortfolio(prev => ({
        ...prev,
        items: items.map(({ id, order }) => {
          const item = prev.items.find(item => item._id === id);
          return { ...item, order };
        })
      }));
    } catch (error) {
      throw new Error('Не удалось обновить порядок элементов');
    }
  };

  const value = {
    portfolio,
    loading,
    error,
    loadPortfolio,
    addPortfolioItem,
    updatePortfolioItem,
    deletePortfolioItem,
    reorderPortfolioItems
  };

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
}; 