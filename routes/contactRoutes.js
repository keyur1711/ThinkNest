const express = require('express');
const router = express.Router();
const { sendMessage, getAllMessages, deleteMessage } = require('../controllers/contactController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', sendMessage);
router.get('/', authMiddleware, getAllMessages);
router.delete('/:id', authMiddleware, deleteMessage);

module.exports = router;
