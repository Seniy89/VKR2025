export const initialProfileData = {
  name: '',
  about: '',
  specializations: [],
  experience: '',
  skills: '',
  education: '',
  languages: '',
  location: '',
  website: '',
  photoURL: '',
  rating: 0,
  completedProjects: 0
};

export const specializations = [
  { id: 'motion', name: 'Моушен-дизайн', description: 'Создание анимаций и видеографики' },
  { id: 'graphic', name: 'Графический дизайн', description: 'Разработка визуальных решений' },
  { id: 'ui', name: 'UI/UX дизайн', description: 'Проектирование пользовательских интерфейсов' },
  { id: 'illustration', name: 'Иллюстрация', description: 'Создание уникальных иллюстраций' },
  { id: 'branding', name: 'Брендинг', description: 'Разработка фирменного стиля' },
  { id: '3d', name: '3D-моделирование', description: 'Создание трехмерных моделей и визуализаций' },
  { id: 'web', name: 'Веб-дизайн', description: 'Дизайн веб-сайтов и веб-приложений' },
  { id: 'print', name: 'Полиграфический дизайн', description: 'Дизайн печатной продукции' },
  { id: 'social', name: 'SMM-дизайн', description: 'Дизайн для социальных сетей' },
  { id: 'game', name: 'Гейм-дизайн', description: 'Дизайн игровых интерфейсов и ассетов' }
];

export const saveProfileData = (userId, data) => {
  try {
    localStorage.setItem(`profile_${userId}`, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving profile data:', error);
    return false;
  }
};

export const loadProfileData = (userId) => {
  try {
    const savedData = localStorage.getItem(`profile_${userId}`);
    return savedData ? JSON.parse(savedData) : initialProfileData;
  } catch (error) {
    console.error('Error loading profile data:', error);
    return initialProfileData;
  }
};

export const updateProfileField = (userId, field, value) => {
  try {
    const currentData = loadProfileData(userId);
    const updatedData = { ...currentData, [field]: value };
    saveProfileData(userId, updatedData);
    return updatedData;
  } catch (error) {
    console.error('Error updating profile field:', error);
    return null;
  }
}; 