const Comment = require('../models/Comment');
const Blog = require('../models/Blog');

const addComment = async (req, res) => {
  try {
    const { name, email, comment, blogId } = req.body;

    if (!name || !email || !comment || !blogId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, comment, and blogId',
      });
    }

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }

    const newComment = await Comment.create({
      name: name.trim(),
      email: email.trim(),
      comment: comment.trim(),
      blogId,
    });

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: newComment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding comment',
      error: error.message,
    });
  }
};

const getCommentsByBlog = async (req, res) => {
  try {
    const { blogId } = req.params;

    const comments = await Comment.find({ blogId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: comments.length,
      data: comments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching comments',
      error: error.message,
    });
  }
};

module.exports = {
  addComment,
  getCommentsByBlog,
};
