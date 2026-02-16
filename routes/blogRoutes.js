const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const optionalAuthMiddleware = require('../middleware/optionalAuthMiddleware');
const { uploadFeaturedImage } = require('../middleware/uploadMiddleware');
const {
  createBlog,
  getAllBlogs,
  getSingleBlogBySlug,
  updateBlog,
  deleteBlog,
} = require('../controllers/blogController');

// Public routes
router.get('/', getAllBlogs);
router.get('/:slug', optionalAuthMiddleware, getSingleBlogBySlug);

// Admin-only routes (require JWT)
router.post('/', authMiddleware, uploadFeaturedImage, createBlog);
router.put('/:id', authMiddleware, updateBlog);
router.delete('/:id', authMiddleware, deleteBlog);

module.exports = router;