const Project = require('../models/projectModel');

// @desc    Создание нового проекта
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res) => {
  try {
    const {
      title,
      description,
      budget,
      deadline,
      category,
      requirements,
    } = req.body;

    const project = await Project.create({
      title,
      description,
      client: req.user._id,
      budget,
      deadline,
      category,
      requirements,
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Получение всех проектов
// @route   GET /api/projects
// @access  Public
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({})
      .populate('client', 'name email')
      .populate('designer', 'name email')
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Получение проекта по ID
// @route   GET /api/projects/:id
// @access  Public
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('client', 'name email')
      .populate('designer', 'name email');

    if (project) {
      res.json(project);
    } else {
      res.status(404);
      throw new Error('Project not found');
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// @desc    Обновление проекта
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (project) {
      // Проверяем, является ли пользователь владельцем проекта
      if (project.client.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized to update this project');
      }

      project.title = req.body.title || project.title;
      project.description = req.body.description || project.description;
      project.budget = req.body.budget || project.budget;
      project.deadline = req.body.deadline || project.deadline;
      project.category = req.body.category || project.category;
      project.requirements = req.body.requirements || project.requirements;
      project.status = req.body.status || project.status;

      const updatedProject = await project.save();
      res.json(updatedProject);
    } else {
      res.status(404);
      throw new Error('Project not found');
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Удаление проекта
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (project) {
      // Проверяем, является ли пользователь владельцем проекта
      if (project.client.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized to delete this project');
      }

      await project.remove();
      res.json({ message: 'Project removed' });
    } else {
      res.status(404);
      throw new Error('Project not found');
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Добавление сообщения в проект
// @route   POST /api/projects/:id/messages
// @access  Private
const addProjectMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const project = await Project.findById(req.params.id);

    if (project) {
      const message = {
        sender: req.user._id,
        text,
      };

      project.messages.push(message);
      await project.save();

      res.status(201).json(project.messages[project.messages.length - 1]);
    } else {
      res.status(404);
      throw new Error('Project not found');
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addProjectMessage,
}; 