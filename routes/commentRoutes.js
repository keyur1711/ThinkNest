const express = require('express');
const router = express.Router();
const { addComment, getCommentsByBlog } = require('../controllers/commentController');

router.post('/', addComment);
router.get('/:blogId', getCommentsByBlog);

module.exports = router;
