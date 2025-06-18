import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { specializations } from '../data/specializations';

const ProjectContext = createContext();

// Функции для работы с localStorage
const STORAGE_KEY = 'freelance_projects';

const loadProjectsFromStorage = () => {
  try {
    const storedProjects = localStorage.getItem(STORAGE_KEY);
    return storedProjects ? JSON.parse(storedProjects) : [];
  } catch (error) {
    console.error('Error loading projects from storage:', error);
    return [];
  }
};

const saveProjectsToStorage = (projects) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (error) {
    console.error('Error saving projects to storage:', error);
  }
};

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};

export const ProjectProvider = ({ children }) => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Загрузка проектов при инициализации
  useEffect(() => {
    const loadProjects = () => {
      setIsLoading(true);
      try {
        // Загружаем проекты из localStorage
        let storedProjects = loadProjectsFromStorage();

        // Если проектов нет, создаем демо-проекты
        if (storedProjects.length === 0) {
          storedProjects = [];
          saveProjectsToStorage(storedProjects);
        }

        setProjects(storedProjects);
      } catch (error) {
        console.error('Error loading projects:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProjects();
  }, []);

  const createProject = async (projectData) => {
    if (!user) {
      throw new Error('Необходимо авторизоваться для создания проекта');
    }

    try {
      const newProject = {
        id: Date.now().toString(),
        ...projectData,
        image: projectData.image || `https://avatars.dicebear.com/api/identicon/project-${Date.now()}.svg`,
        clientId: user.uid,
        clientName: user.displayName || 'Заказчик',
        status: 'active',
        createdAt: new Date().toISOString(),
        tags: projectData.tags || []
      };

      const updatedProjects = [...projects, newProject];
      setProjects(updatedProjects);
      saveProjectsToStorage(updatedProjects);
      return newProject;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  };

  const updateProject = async (id, projectData) => {
    if (!user) {
      throw new Error('Необходимо авторизоваться для редактирования проекта');
    }

    const project = projects.find(p => p.id === id);
    if (!project) {
      throw new Error('Проект не найден');
    }

    if (project.clientId !== user.uid) {
      throw new Error('У вас нет прав на редактирование этого проекта');
    }

    try {
      const updatedProjects = projects.map(project => 
        project.id === id ? { ...project, ...projectData } : project
      );
      setProjects(updatedProjects);
      saveProjectsToStorage(updatedProjects);
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  };

  const deleteProject = async (id) => {
    if (!user) {
      throw new Error('Необходимо авторизоваться для удаления проекта');
    }

    const project = projects.find(p => p.id === id);
    if (!project) {
      throw new Error('Проект не найден');
    }

    if (project.clientId !== user.uid) {
      throw new Error('У вас нет прав на удаление этого проекта');
    }

    try {
      const updatedProjects = projects.filter(project => project.id !== id);
      setProjects(updatedProjects);
      saveProjectsToStorage(updatedProjects);
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  };

  // Получение проектов текущего пользователя
  const getUserProjects = () => {
    if (!user) return [];
    return projects.filter(project => project.clientId === user.uid);
  };

  // Получение всех проектов (для страницы "Все проекты")
  const getAllProjects = () => {
    return projects;
  };

  // Проверка прав на редактирование проекта
  const canEditProject = (projectId) => {
    if (!user) return false;
    const project = projects.find(p => p.id === projectId);
    return project && project.clientId === user.uid;
  };

  // Получение списка специализаций
  const getSpecializations = () => {
    return specializations;
  };

  const value = {
    projects,
    isLoading,
    createProject,
    updateProject,
    deleteProject,
    getUserProjects,
    getAllProjects,
    canEditProject,
    getSpecializations
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
}; 