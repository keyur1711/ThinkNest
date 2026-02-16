const Blog = require('../models/Blog');

const createBlog = async (req, res) => {
    try {
        const { title, description, content, category, tags } = req.body;
        // featuredImage: from file upload (Cloudinary URL) or empty
        const featuredImageUrl = req.file ? req.file.path : '';

        if (!title || !description || !content || !category) {
            return res.status(400).json({
                success: false,
                message: 'Please provide title, description, content, and category'
            });
        }

        let tagsArray = [];
        if (tags) {
            if (typeof tags === 'string') {
                try {
                    tagsArray = JSON.parse(tags);
                } catch {
                    tagsArray = tags.split(',').map((t) => t.trim()).filter(Boolean);
                }
            } else if (Array.isArray(tags)) {
                tagsArray = tags;
            }
        }

        const blog = await Blog.create({
            title,
            description,
            content,
            category,
            tags: tagsArray,
            featuredImage: featuredImageUrl
        });

        res.status(201).json({
            success: true,
            message: 'Blog created successfully',
            data: blog
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'A blog with this slug already exists'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Error creating blog',
            error: error.message
        });
    }
};

const getAllBlogs = async (req, res) => {
    try {
        const { search, category, page: pageParam, limit: limitParam } = req.query;
        const filter = {};

        if (search && search.trim()) {
            const regex = new RegExp(search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
            filter.$or = [
                { title: regex },
                { description: regex }
            ];
        }

        if (category && category.trim()) {
            filter.category = new RegExp(`^${category.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i');
        }

        const page = Math.max(1, parseInt(pageParam, 10) || 1);
        const limit = Math.min(100, Math.max(1, parseInt(limitParam, 10) || 5));

        const total = await Blog.countDocuments(filter);
        const totalPages = Math.ceil(total / limit) || 1;
        const skip = (page - 1) * limit;

        const blogs = await Blog.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            success: true,
            data: blogs,
            total,
            page,
            totalPages
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching blogs',
            error: error.message
        });
    }
};

const getSingleBlogBySlug = async (req, res) => {
    try {
        const { slug } = req.params;

        const blog = await Blog.findOne({ slug });

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            });
        }

        if (!req.adminId) {
            blog.views += 1;
            await blog.save();
        }

        res.status(200).json({
            success: true,
            data: blog
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching blog',
            error: error.message
        });
    }
};

const updateBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, content, category, tags, featuredImage } = req.body;

        const blog = await Blog.findById(id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            });
        }

        if (title) blog.title = title;
        if (description) blog.description = description;
        if (content) blog.content = content;
        if (category) blog.category = category;
        if (tags) blog.tags = tags;
        if (featuredImage !== undefined) blog.featuredImage = featuredImage;

        await blog.save();

        res.status(200).json({
            success: true,
            message: 'Blog updated successfully',
            data: blog
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'A blog with this slug already exists'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Error updating blog',
            error: error.message
        });
    }
};

const deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;

        const blog = await Blog.findByIdAndDelete(id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Blog deleted successfully',
            data: blog
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting blog',
            error: error.message
        });
    }
};

module.exports = {
    createBlog,
    getAllBlogs,
    getSingleBlogBySlug,
    updateBlog,
    deleteBlog
};
