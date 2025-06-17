const express = require('express');
const router = express.Router();
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addProjectMessage,
} = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/projects
router.post('/', protect, createProject);

// @route   GET /api/projects
router.get('/', getProjects);

// @route   GET /api/projects/:id
router.get('/:id', getProjectById);

// @route   PUT /api/projects/:id
router.put('/:id', protect, updateProject);

// @route   DELETE /api/projects/:id
router.delete('/:id', protect, deleteProject);

// @route   POST /api/projects/:id/messages
router.post('/:id/messages', protect, addProjectMessage);

module.exports = router; 