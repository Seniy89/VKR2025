const express = require('express');
const router = express.Router();

// Пример базового GET запроса
router.get('/', (req, res) => {
  res.json({ message: 'Portfolio route is working!' });
});

module.exports = router; 