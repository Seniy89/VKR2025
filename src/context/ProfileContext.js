import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useRole } from './RoleContext';
import { initialProfileData, loadProfileData, saveProfileData } from '../data/profileData';

const ProfileContext = createContext();

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

export const ProfileProvider = ({ children }) => {
  const { user } = useAuth();
  const { userRole } = useRole();
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || !userRole) {
      setProfileData(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      // Загружаем профиль только для текущего пользователя
      const loaded = loadProfileData(user.uid);
      const initialData = {
        ...initialProfileData,
        ...loaded,
        email: user.email,
        name: user.displayName,
        role: userRole
      };
      setProfileData(initialData);
      saveProfileData(user.uid, initialData);
    } catch (error) {
      setError('Ошибка загрузки профиля');
    } finally {
      setIsLoading(false);
    }
  }, [user, userRole]);

  const updateProfile = async (updates) => {
    if (!user) {
      setError('Пользователь не авторизован');
      return false;
    }

    try {
      setError(null);
      setProfileData(prev => {
        const updated = { 
          ...prev, 
          ...updates, 
          updatedAt: new Date().toISOString(),
          role: userRole // Сохраняем текущую роль
        };
        saveProfileData(user.uid, updated);
        return updated;
      });
      return true;
    } catch (error) {
      setError('Ошибка обновления профиля');
      return false;
    }
  };

  const updateProfilePhoto = async (file) => {
    try {
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        const photoURL = reader.result;
        updateProfile({ photoURL });
      };
      reader.readAsDataURL(file);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const updateSpecializations = async (specializations) => {
    return updateProfile({ specializations });
  };

  const updateRating = async (rating) => {
    return updateProfile({ rating });
  };

  const updateCompletedProjects = async (completedProjects) => {
    return updateProfile({ completedProjects });
  };

  const value = {
    profileData,
    isLoading,
    error,
    updateProfile,
    updateProfilePhoto,
    updateSpecializations,
    updateRating,
    updateCompletedProjects
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
}; 