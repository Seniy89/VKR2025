# Обзор проекта

## Введение
Проект представляет собой платформу для фриланса, где заказчики могут публиковать проекты, а исполнители — откликаться на них. Приложение реализовано с использованием React для клиентской части и Node.js с Express для серверной части. Данные хранятся в MongoDB.

## Архитектура проекта

### Клиентская часть
- **React**: Основной фреймворк для построения пользовательского интерфейса.
- **Material-UI**: Библиотека компонентов для создания современного и отзывчивого интерфейса.
- **Контексты (Context API)**: Используются для управления состоянием приложения:
  - `AuthContext`: Управление аутентификацией пользователей.
  - `ProjectContext`: Управление проектами (создание, редактирование, удаление, получение списка проектов).
  - `ResponseContext`: Управление откликами на проекты.
  - `RoleContext`: Управление ролями пользователей (заказчик, исполнитель).
  - `ChatContext`: Управление сообщениями между пользователями.
  - `ProfileContext`: Управление профилями пользователей.
  - `PortfolioContext`: Управление портфолио исполнителей.

### Серверная часть
- **Node.js**: Среда выполнения для серверной части.
- **Express**: Фреймворк для создания API.
- **MongoDB**: База данных для хранения информации о пользователях, проектах и откликах.
- **JWT**: Используется для аутентификации и авторизации пользователей.

## Основные компоненты

### Клиентская часть
1. **App.js**: Главный компонент приложения, который настраивает маршрутизацию и провайдеры контекстов.
2. **Страницы**:
   - `Home`: Главная страница.
   - `Login`: Страница входа.
   - `Register`: Страница регистрации.
   - `Profile`: Страница профиля пользователя.
   - `Projects`: Страница со списком всех проектов.
   - `ProjectDetails`: Страница с деталями проекта.
   - `CreateProject`: Страница для создания нового проекта.
   - `EditProject`: Страница для редактирования проекта.
   - `MyProjects`: Страница с проектами текущего пользователя.
   - `MyResponses`: Страница с откликами текущего пользователя.
   - `Portfolio`: Страница с портфолио исполнителя.
   - `Chat`: Страница для обмена сообщениями.
   - `Messages`: Страница с сообщениями.

### Серверная часть
1. **Модели данных**:
   - `User`: Модель пользователя.
   - `Project`: Модель проекта.
   - `Response`: Модель отклика на проект.

2. **API маршруты**:
   - `/api/users`: Маршруты для управления пользователями (регистрация, вход, получение профиля).
   - `/api/projects`: Маршруты для управления проектами (создание, редактирование, удаление, получение списка проектов).
   - `/api/responses`: Маршруты для управления откликами (создание, получение откликов).

## Реализация

### Аутентификация
- Пользователи могут регистрироваться и входить в систему.
- JWT используется для создания токенов, которые хранятся в localStorage и используются для авторизации запросов к API.

### Управление проектами
- Заказчики могут создавать, редактировать и удалять проекты.
- Исполнители могут просматривать проекты и откликаться на них.

### Управление откликами
- Исполнители могут создавать отклики на проекты, указывая цену и срок выполнения.
- Заказчики могут просматривать отклики и принимать или отклонять их.

### Обмен сообщениями
- Пользователи могут обмениваться сообщениями через чат.

## Заключение
Проект представляет собой полноценную платформу для фриланса с возможностью управления проектами, откликами и обменом сообщениями. Архитектура проекта построена с использованием современных технологий, что обеспечивает его масштабируемость и удобство в использовании.

## Код проекта

### Клиентская часть

#### App.js
```javascript
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProjectProvider } from './context/ProjectContext';
import { ResponseProvider } from './context/ResponseContext';
import { RoleProvider } from './context/RoleContext';
import { ChatProvider } from './context/ChatContext';
import { ProfileProvider } from './context/ProfileContext';
import { PortfolioProvider } from './context/PortfolioContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Projects from './pages/Projects';
import ProjectDetails from './pages/ProjectDetails';
import CreateProject from './pages/CreateProject';
import EditProject from './pages/EditProject';
import MyProjects from './pages/MyProjects';
import MyResponses from './pages/MyResponses';
import Portfolio from './pages/Portfolio';
import Chat from './pages/Chat';
import Messages from './pages/Messages';

function App() {
  return (
    <AuthProvider>
      <RoleProvider>
        <ProjectProvider>
          <ResponseProvider>
            <ChatProvider>
              <ProfileProvider>
                <PortfolioProvider>
                  <Router>
                    <Switch>
                      <Route exact path="/" component={Home} />
                      <Route path="/login" component={Login} />
                      <Route path="/register" component={Register} />
                      <Route path="/profile" component={Profile} />
                      <Route path="/projects" component={Projects} />
                      <Route path="/project/:id" component={ProjectDetails} />
                      <Route path="/create-project" component={CreateProject} />
                      <Route path="/edit-project/:id" component={EditProject} />
                      <Route path="/my-projects" component={MyProjects} />
                      <Route path="/my-responses" component={MyResponses} />
                      <Route path="/portfolio" component={Portfolio} />
                      <Route path="/chat" component={Chat} />
                      <Route path="/messages" component={Messages} />
                    </Switch>
                  </Router>
                </PortfolioProvider>
              </ProfileProvider>
            </ChatProvider>
          </ResponseProvider>
        </ProjectProvider>
      </RoleProvider>
    </AuthProvider>
  );
}

export default App;
```

#### AuthContext.js
```javascript
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      axios.get('/api/users/me')
        .then(response => {
          setUser(response.data);
        })
        .catch(() => {
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const response = await axios.post('/api/users/login', { email, password });
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(user);
  };

  const register = async (userData) => {
    const response = await axios.post('/api/users/register', userData);
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

#### ProjectContext.js
```javascript
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const ProjectContext = createContext();

export const useProject = () => useContext(ProjectContext);

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const response = await axios.get('/api/projects');
      setProjects(response.data);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (projectData) => {
    const response = await axios.post('/api/projects', projectData);
    setProjects([...projects, response.data]);
  };

  const updateProject = async (id, projectData) => {
    const response = await axios.put(`/api/projects/${id}`, projectData);
    setProjects(projects.map(project => project._id === id ? response.data : project));
  };

  const deleteProject = async (id) => {
    await axios.delete(`/api/projects/${id}`);
    setProjects(projects.filter(project => project._id !== id));
  };

  const getUserProjects = async (userId) => {
    const response = await axios.get(`/api/projects/user/${userId}`);
    return response.data;
  };

  return (
    <ProjectContext.Provider value={{ projects, loading, createProject, updateProject, deleteProject, getUserProjects }}>
      {children}
    </ProjectContext.Provider>
  );
};
```

#### ResponseContext.js
```javascript
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const ResponseContext = createContext();

export const useResponse = () => useContext(ResponseContext);

export const ResponseProvider = ({ children }) => {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResponses();
  }, []);

  const loadResponses = async () => {
    try {
      const response = await axios.get('/api/responses');
      setResponses(response.data);
    } catch (error) {
      console.error('Error loading responses:', error);
    } finally {
      setLoading(false);
    }
  };

  const createResponse = async (responseData) => {
    const response = await axios.post('/api/responses', responseData);
    setResponses([...responses, response.data]);
  };

  const getProjectResponses = async (projectId) => {
    const response = await axios.get(`/api/responses/project/${projectId}`);
    return response.data;
  };

  const getExecutorResponses = async (executorId) => {
    const response = await axios.get(`/api/responses/executor/${executorId}`);
    return response.data;
  };

  const updateResponseStatus = async (id, status) => {
    const response = await axios.put(`/api/responses/${id}`, { status });
    setResponses(responses.map(response => response._id === id ? response.data : response));
  };

  return (
    <ResponseContext.Provider value={{ responses, loading, createResponse, getProjectResponses, getExecutorResponses, updateResponseStatus }}>
      {children}
    </ResponseContext.Provider>
  );
};
```

#### RoleContext.js
```javascript
import React, { createContext, useState, useContext } from 'react';

const RoleContext = createContext();

export const useRole = () => useContext(RoleContext);

export const RoleProvider = ({ children }) => {
  const [role, setRole] = useState(null);

  const setUserRole = (userRole) => {
    setRole(userRole);
  };

  return (
    <RoleContext.Provider value={{ role, setUserRole }}>
      {children}
    </RoleContext.Provider>
  );
};
```

#### ChatContext.js
```javascript
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const response = await axios.get('/api/messages');
      setMessages(response.data);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (messageData) => {
    const response = await axios.post('/api/messages', messageData);
    setMessages([...messages, response.data]);
  };

  return (
    <ChatContext.Provider value={{ messages, loading, sendMessage }}>
      {children}
    </ChatContext.Provider>
  );
};
```

#### ProfileContext.js
```javascript
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const ProfileContext = createContext();

export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await axios.get('/api/users/profile');
      setProfile(response.data);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    const response = await axios.put('/api/users/profile', profileData);
    setProfile(response.data);
  };

  return (
    <ProfileContext.Provider value={{ profile, loading, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};
```

#### PortfolioContext.js
```javascript
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const PortfolioContext = createContext();

export const usePortfolio = () => useContext(PortfolioContext);

export const PortfolioProvider = ({ children }) => {
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPortfolio();
  }, []);

  const loadPortfolio = async () => {
    try {
      const response = await axios.get('/api/portfolio');
      setPortfolio(response.data);
    } catch (error) {
      console.error('Error loading portfolio:', error);
    } finally {
      setLoading(false);
    }
  };

  const addPortfolioItem = async (itemData) => {
    const response = await axios.post('/api/portfolio', itemData);
    setPortfolio([...portfolio, response.data]);
  };

  const updatePortfolioItem = async (id, itemData) => {
    const response = await axios.put(`/api/portfolio/${id}`, itemData);
    setPortfolio(portfolio.map(item => item._id === id ? response.data : item));
  };

  const deletePortfolioItem = async (id) => {
    await axios.delete(`/api/portfolio/${id}`);
    setPortfolio(portfolio.filter(item => item._id !== id));
  };

  return (
    <PortfolioContext.Provider value={{ portfolio, loading, addPortfolioItem, updatePortfolioItem, deletePortfolioItem }}>
      {children}
    </PortfolioContext.Provider>
  );
};
```

### Серверная часть

#### server.js
```javascript
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/users', require('./routes/users'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/responses', require('./routes/responses'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/portfolio', require('./routes/portfolio'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

#### models/User.js
```javascript
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  displayName: { type: String, required: true },
  role: { type: String, enum: ['client', 'executor'], required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
```

#### models/Project.js
```javascript
const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  budget: { type: Number, required: true },
  deadline: { type: Date, required: true },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', ProjectSchema);
```

#### models/Response.js
```javascript
const mongoose = require('mongoose');

const ResponseSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  executorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  price: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Response', ResponseSchema);
```

#### routes/users.js
```javascript
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

router.post('/register', async (req, res) => {
  const { email, password, displayName, role } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }
    user = new User({
      email,
      password,
      displayName,
      role
    });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    const payload = {
      user: {
        id: user.id
      }
    };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token, user });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    const payload = {
      user: {
        id: user.id
      }
    };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token, user });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
```

#### routes/projects.js
```javascript
const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.post('/', auth, async (req, res) => {
  const { title, description, budget, deadline } = req.body;
  try {
    const newProject = new Project({
      title,
      description,
      budget,
      deadline,
      clientId: req.user.id
    });
    const project = await newProject.save();
    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.put('/:id', auth, async (req, res) => {
  const { title, description, budget, deadline } = req.body;
  try {
    let project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }
    if (project.clientId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    project = await Project.findByIdAndUpdate(req.params.id, { title, description, budget, deadline }, { new: true });
    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    let project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }
    if (project.clientId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    await Project.findByIdAndRemove(req.params.id);
    res.json({ msg: 'Project removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
```

#### routes/responses.js
```javascript
const express = require('express');
const router = express.Router();
const Response = require('../models/Response');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const responses = await Response.find().sort({ createdAt: -1 });
    res.json(responses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.post('/', auth, async (req, res) => {
  const { projectId, message, price } = req.body;
  try {
    const newResponse = new Response({
      projectId,
      executorId: req.user.id,
      message,
      price
    });
    const response = await newResponse.save();
    res.json(response);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.get('/project/:projectId', async (req, res) => {
  try {
    const responses = await Response.find({ projectId: req.params.projectId }).sort({ createdAt: -1 });
    res.json(responses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.get('/executor/:executorId', async (req, res) => {
  try {
    const responses = await Response.find({ executorId: req.params.executorId }).sort({ createdAt: -1 });
    res.json(responses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.put('/:id', auth, async (req, res) => {
  const { status } = req.body;
  try {
    let response = await Response.findById(req.params.id);
    if (!response) {
      return res.status(404).json({ msg: 'Response not found' });
    }
    response = await Response.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(response);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
```

#### middleware/auth.js
```javascript
const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
```

#### .env
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/freelance
JWT_SECRET=your_jwt_secret_key_123
```

#### package.json
```json
{
  "name": "freelance-platform",
  "version": "1.0.0",
  "description": "A platform for freelancers and clients",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^10.0.0",
    "express": "^4.17.1",
    "jsonwebtoken": "^8.5.1",
    "mongoose": "^6.0.12"
  },
  "devDependencies": {
    "nodemon": "^2.0.15"
  }
}
``` 