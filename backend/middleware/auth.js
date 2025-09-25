const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1]; // optional chaining for safety

  if (!token) {
    return res.status(401).json({ error: 'Access denied, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: decoded.id,
      username: decoded.username,
      role: decoded.role
    };
    next();
  } catch (err) {
    console.error('JWT verification failed:', err.message);
    res.status(403).json({ error: 'Token is not valid' });
  }
};
