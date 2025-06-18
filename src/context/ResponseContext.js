import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useRole } from './RoleContext';
import { message } from 'antd';

const ResponseContext = createContext();

// Функция для логирования с временной меткой
const log = (action, data) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [ResponseSystem] ${action}:`, data);
};

const STORAGE_KEY = 'freelance_projects_responses';

const loadResponsesFromStorage = () => {
  try {
    log('Loading responses from storage', { storageKey: STORAGE_KEY });
    const storedResponses = localStorage.getItem(STORAGE_KEY);
    const parsedResponses = storedResponses ? JSON.parse(storedResponses) : [];
    log('Successfully loaded responses', { count: parsedResponses.length, responses: parsedResponses });
    return parsedResponses;
  } catch (error) {
    log('Error loading responses', { error: error.message });
    return [];
  }
};

const saveResponsesToStorage = (responses) => {
  try {
    log('Saving responses to storage', { count: responses.length, responses });
    const responsesString = JSON.stringify(responses);
    localStorage.setItem(STORAGE_KEY, responsesString);
    
    // Verify the save
    const savedResponses = localStorage.getItem(STORAGE_KEY);
    log('Verified saved responses', { saved: savedResponses });
  } catch (error) {
    log('Error saving responses', { error: error.message });
  }
};

export const useResponse = () => {
  const context = useContext(ResponseContext);
  if (!context) {
    log('Error: useResponse hook used outside of ResponseProvider');
    throw new Error('useResponse must be used within a ResponseProvider');
  }
  return context;
};

export const ResponseProvider = ({ children }) => {
  const { user } = useAuth();
  const { isExecutor } = useRole();
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Загрузка откликов при инициализации
  useEffect(() => {
    const loadResponses = () => {
      log('Initializing response loading');
      setLoading(true);
      try {
        const storedResponses = loadResponsesFromStorage();
        log('Setting initial responses state', { count: storedResponses.length });
        setResponses(storedResponses);
      } catch (error) {
        log('Error during initialization', { error: error.message });
        setError('Ошибка загрузки откликов');
      } finally {
        setLoading(false);
        log('Response loading completed');
      }
    };

    loadResponses();
  }, []);

  // Создание нового отклика
  const createResponse = async (projectId, message, price) => {
    if (!user) {
      const error = 'Необходимо авторизоваться для создания отклика';
      log('Error creating response', { error });
      throw new Error(error);
    }

    if (!isExecutor()) {
      log('Error: User is not an executor', { userId: user.uid });
      throw new Error('Только исполнители могут оставлять отклики');
    }

    try {
      log('Creating new response', { projectId, message, price, userId: user.uid });
      
      const newResponse = {
        id: Date.now().toString(),
        projectId,
        executorId: user.uid,
        userId: user.uid,
        executorName: user.displayName || 'Анонимный пользователь',
        message,
        price,
        status: 'pending',
        isApproved: false,
        createdAt: new Date().toISOString()
      };

      log('New response object created', newResponse);

      const updatedResponses = [...responses, newResponse];
      log('Current responses before update', { count: responses.length });
      log('Updated responses array', { count: updatedResponses.length });
      
      setResponses(updatedResponses);
      saveResponsesToStorage(updatedResponses);
      
      log('Response successfully created and saved', { responseId: newResponse.id });
      return newResponse;
    } catch (error) {
      log('Error creating response', { error: error.message });
      throw error;
    }
  };

  // Получение откликов для проекта
  const getProjectResponses = (projectId) => {
    log('Getting project responses', { projectId });
    const projectResponses = responses.filter(response => response.projectId === projectId);
    log('Found project responses', { count: projectResponses.length });
    return projectResponses;
  };

  // Получение откликов исполнителя
  const getExecutorResponses = (executorId) => {
    log('Getting executor responses', { executorId });
    if (!executorId) {
      log('No executorId provided');
      return [];
    }
    const executorResponses = responses.filter(response => 
      response.executorId === executorId || response.userId === executorId
    );
    log('Found executor responses', { count: executorResponses.length });
    return executorResponses;
  };

  // Обновление статуса отклика
  const updateResponseStatus = async (responseId, status) => {
    try {
      const updatedResponses = responses.map(response => 
        response.id === responseId ? { ...response, status } : response
      );
      setResponses(updatedResponses);
      saveResponsesToStorage(updatedResponses);
      return true;
    } catch (error) {
      log('Error updating response status', { error: error.message });
      throw error;
    }
  };

  // Отмена отклика
  const cancelResponse = async (responseId) => {
    try {
      const response = responses.find(r => r.id === responseId);
      if (!response) {
        throw new Error('Отклик не найден');
      }
      if (response.executorId !== user.uid) {
        throw new Error('Нет прав для отмены этого отклика');
      }
      if (response.status !== 'pending') {
        throw new Error('Можно отменить только отклик со статусом "На рассмотрении"');
      }
      return await updateResponseStatus(responseId, 'canceled');
    } catch (error) {
      log('Error canceling response', { error: error.message });
      throw error;
    }
  };

  // Получение количества новых откликов для проекта
  const getNewResponsesCount = (projectId) => {
    log('Getting new responses count', { projectId });
    const count = responses.filter(
      response => response.projectId === projectId && response.status === 'pending' && !response.isApproved
    ).length;
    log('New responses count', { projectId, count });
    return count;
  };

  // Одобрение отклика заказчиком
  const approveResponse = async (responseId, projectId, projectClientId) => {
    if (!user || !useRole().isCustomer() || user.uid !== projectClientId) {
      const error = 'Нет прав для одобрения отклика';
      log('Error approving response', { error, responseId, projectId, projectClientId, userId: user?.uid });
      throw new Error(error);
    }

    try {
      log('Attempting to approve response', { responseId, projectId });
      let responseToApprove = null;
      let alreadyApproved = false;

      const updatedResponses = responses.map(response => {
        if (response.projectId === projectId) {
          if (response.id === responseId) {
            responseToApprove = response; // Нашли отклик для одобрения
            if (response.isApproved) alreadyApproved = true; // Уже одобрен
            return { ...response, status: 'approved', isApproved: true }; // Одобряем текущий
          } else if (response.isApproved) {
             alreadyApproved = true; // Найден уже одобренный отклик для этого проекта
             return response; // Оставляем как есть, если другой отклик уже одобрен
          } else {
            return { ...response, status: 'rejected', isApproved: false }; // Отклоняем остальные
          }
        }
        return response;
      });

      if (!responseToApprove) {
         const error = 'Отклик не найден';
         log('Error approving response', { error, responseId });
         throw new Error(error);
      }

      if (alreadyApproved && !responseToApprove.isApproved) {
         // Это условие маловероятно из-за логики map, но как доп. проверка
         const error = 'Для этого проекта уже одобрен другой отклик';
         log('Error approving response', { error, projectId });
         throw new Error(error);
      }
      
      // Дополнительная проверка: если after map текущий отклик не isApproved, значит уже был одобрен другой
      const finalResponse = updatedResponses.find(r => r.id === responseId);
      if (!finalResponse || !finalResponse.isApproved) {
          const error = 'Для этого проекта уже одобрен другой отклик';
          log('Error approving response', { error, projectId });
          throw new Error(error);
      }

      setResponses(updatedResponses);
      saveResponsesToStorage(updatedResponses);

      log('Response successfully approved', { responseId, projectId });
      return true;
    } catch (error) {
      log('Error approving response', { error: error.message });
      throw error;
    }
  };

  const value = {
    responses,
    loading,
    error,
    createResponse,
    getProjectResponses,
    getExecutorResponses,
    updateResponseStatus,
    getNewResponsesCount,
    cancelResponse,
    approveResponse
  };

  return (
    <ResponseContext.Provider value={value}>
      {children}
    </ResponseContext.Provider>
  );
}; 