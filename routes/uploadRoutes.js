const express = require('express');
const router = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const authMiddleware = require('../middleware/authMiddleware');

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: () => 'thinknest/content',
    public_id: (req, file) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      return `content-${uniqueSuffix}`;
    },
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/i.test(file.mimetype);
    if (allowed) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (jpeg, jpg, png, gif, webp) are allowed.'), false);
    }
  },
});

router.post('/image', authMiddleware, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No image provided.' });
  }
  res.json({ success: true, url: req.file.path });
});

module.exports = router;
