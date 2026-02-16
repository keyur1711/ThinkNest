const path = require('path');
const dotenv = require('dotenv');

// Load .env first, before any code that reads process.env
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

app.use(express.json());

// CORS: allow frontend (set CLIENT_URL in production) or all origins in development
const corsOptions = {
  origin: process.env.CLIENT_URL || true,
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

const blogRoutes = require('./routes/blogRoutes');
const adminRoutes = require('./routes/adminRoutes');
const commentRoutes = require('./routes/commentRoutes');
const subscribeRoutes = require('./routes/subscribeRoutes');
const contactRoutes = require('./routes/contactRoutes');

app.use('/api/blogs', blogRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/subscribe', subscribeRoutes);
app.use('/api/contact', contactRoutes);

app.get('/api/test', (req, res) => {
  res.json({ message: 'ThinkNest Backend Running Successfully' });
});

// Global error handler so errors return JSON (multer/upload errors → 400)
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  const isUploadError = err.code === 'LIMIT_FILE_SIZE' || err.message?.includes('image files');
  const status = isUploadError ? 400 : 500;
  res.status(status).json({
    success: false,
    message: isUploadError ? 'Upload error' : 'Internal server error',
    error: err.message || String(err),
  });
});

const PORT = process.env.PORT || 5000;

async function start() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err.message);
  process.exit(1);
});
connectDB();
