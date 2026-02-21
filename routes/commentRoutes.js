const express = require('express');
const router = express.Router();
const { addComment, getCommentsByBlog, deleteComment } = require('../controllers/commentController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', addComment);
router.get('/:blogId', getCommentsByBlog);
router.delete('/:id', authMiddleware, deleteComment);

module.exports = router;
