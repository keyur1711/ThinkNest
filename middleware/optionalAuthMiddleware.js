const jwt = require('jsonwebtoken');

/**
 * Optional auth: if valid Bearer token is present, sets req.adminId.
 * Never blocks the request or returns 401 (used for routes that behave differently for admins).
 */
const optionalAuthMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.adminId = decoded.id;
  } catch (_) {
    // Invalid or expired token – treat as public
  }
  next();
};

module.exports = optionalAuthMiddleware;
