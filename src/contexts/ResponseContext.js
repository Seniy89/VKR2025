import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const ResponseContext = createContext();

export const useResponses = () => {
  const context = useContext(ResponseContext);
  if (!context) {
    throw new Error('useResponses must be used within a ResponseProvider');
  }
  return context;
};

export const ResponseProvider = ({ children }) => {
  const { user } = useAuth();
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchResponses = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/responses/user/${user.id}`);
      const data = await response.json();
      setResponses(data);
      setError(null);
    } catch (err) {
      setError('Не удалось загрузить отклики');
      console.error('Error fetching responses:', err);
    } finally {
      setLoading(false);
    }
  };

  const createResponse = async (projectId, message, price) => {
    if (!user) throw new Error('Необходимо авторизоваться');

    try {
      const response = await fetch('/api/responses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId,
          executorId: user.id,
          message,
          price,
          status: 'pending',
          createdAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Не удалось создать отклик');
      }

      const newResponse = await response.json();
      setResponses(prev => [...prev, newResponse]);
      return newResponse;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const cancelResponse = async (responseId) => {
    try {
      const response = await fetch(`/api/responses/${responseId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Не удалось отменить отклик');
      }

      setResponses(prev => prev.filter(r => r.id !== responseId));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateResponseStatus = async (responseId, status) => {
    try {
      const response = await fetch(`/api/responses/${responseId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Не удалось обновить статус отклика');
      }

      const updatedResponse = await response.json();
      setResponses(prev => prev.map(r => r.id === responseId ? updatedResponse : r));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    if (user) {
      fetchResponses();
    }
  }, [user]);

  const value = {
    responses,
    loading,
    error,
    createResponse,
    cancelResponse,
    updateResponseStatus,
    refreshResponses: fetchResponses,
  };

  return (
    <ResponseContext.Provider value={value}>
      {children}
    </ResponseContext.Provider>
  );
}; 