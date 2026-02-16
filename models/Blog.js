const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
        sparse: true
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true
    },
    content: {
        type: String,
        required: [true, 'Content is required']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        trim: true
    },
    tags: {
        type: [String],
        default: []
    },
    featuredImage: {
        type: String,
        default: ''
    },
    views: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date
    }
});

blogSchema.pre('save', function () {
    if (this.isModified('title') && !this.slug) {
        this.slug = this.title
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '');
    }
    this.updatedAt = Date.now();
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
