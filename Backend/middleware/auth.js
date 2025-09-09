// const jwt = require('jsonwebtoken');
// const User = require('../models/User');

// const auth = async (req, res, next) => {
//   try {
//     const header = req.headers.authorization;
//     if (!header || !header.startsWith('Bearer ')) {
//       return res.status(401).json({ error: 'Unauthorized' });
//     }

//     const token = header.split(' ')[1];
//     const payload = jwt.verify(token, process.env.JWT_SECRET);

//     const user = await User.findById(payload.id).select('-password');
//     if (!user) return res.status(401).json({ error: 'User not found' });

//     req.user = user;
//     next();
//   } catch (err) {
//     console.error(err);
//     return res.status(401).json({ error: 'Invalid or expired token' });
//   }
// };

// module.exports = auth;










const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
