// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const User = require('../models/User');
// const { nameValid, addressValid, emailValid, passwordValid } = require('../utils/validators');

// const createToken = (user) => jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

// exports.signup = async (req, res) => {
//   try {
//     const { name, email, password, address } = req.body;
//     if (!nameValid(name)) return res.status(400).json({ error: 'Name must be 20-60 chars.' });
//     if (!emailValid(email)) return res.status(400).json({ error: 'Invalid email' });
//     if (!passwordValid(password)) return res.status(400).json({ error: 'Password 8-16 chars, include uppercase and special char.' });
//     if (!addressValid(address)) return res.status(400).json({ error: 'Address too long' });

//     const exists = await User.findOne({ email });
//     if (exists) return res.status(400).json({ error: 'Email already registered' });

//     const hashed = await bcrypt.hash(password, 10);
//     const user = await User.create({ name, email, password: hashed, address, role: 'user' });
//     const token = createToken(user);
//     res.json({ message: 'Signup success', token, user: { id: user._id, name: user.name, email: user.email, role: user.role }});
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Server error' });
//   }
// };

// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     if (!email || !password) return res.status(400).json({ error: 'Email & password required' });
//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ error: 'Invalid credentials' });
//     const match = await bcrypt.compare(password, user.password);
//     if (!match) return res.status(400).json({ error: 'Invalid credentials' });

//     const token = createToken(user);
//     res.json({ message: 'Login success', token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Server error' });
//   }
// };

// exports.updatePassword = async (req, res) => {
//   try {
//     const { newPassword } = req.body;
//     if (!passwordValid(newPassword)) return res.status(400).json({ error: 'Password invalid format' });

//     const hashed = await bcrypt.hash(newPassword, 10);
//     await User.findByIdAndUpdate(req.user._id, { password: hashed });
//     res.json({ message: 'Password updated' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Server error' });
//   }
// };
// // Normal User Signup
// exports.signup = async (req, res) => {
//   try {
//     const { name, email, password, address } = req.body;

//     if (!nameValid(name)) return res.status(400).json({ error: 'Name must be 20-60 characters.' });
//     if (!emailValid(email)) return res.status(400).json({ error: 'Invalid email.' });
//     if (!passwordValid(password)) return res.status(400).json({ error: 'Password must be 8-16 chars, include uppercase and special character.' });
//     if (!addressValid(address)) return res.status(400).json({ error: 'Address too long.' });

//     const exists = await User.findOne({ email });
//     if (exists) return res.status(400).json({ error: 'Email already registered. Please login.' });

//     const hashed = await bcrypt.hash(password, 10);

//     const user = await User.create({
//       name,
//       email,
//       password: hashed,
//       address,
//       role: 'user'
//     });

//     res.json({
//       message: 'User registered successfully. Please login.',
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role
//       }
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Server error' });
//   }
// };












const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

// POST /api/auth/signup
exports.signup = async (req, res) => {
  const { name, email, password, address, role } = req.body;

  if (!name || name.length < 20 || name.length > 60) {
    return res.status(400).json({ message: 'Name must be 20–60 characters' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  if (!password || !/(?=.*[A-Z])(?=.*[!@#$%^&*])/.test(password) || password.length < 8 || password.length > 16) {
    return res.status(400).json({ message: 'Password must be 8–16 chars with 1 uppercase and 1 special char' });
  }

  try {
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, address, role });

    res.status(201).json({
      message: 'User registered',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = generateToken(user);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/auth/update-password
exports.updatePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user.id;

  if (!newPassword || !/(?=.*[A-Z])(?=.*[!@#$%^&*])/.test(newPassword) || newPassword.length < 8 || newPassword.length > 16) {
    return res.status(400).json({ message: 'New password must be 8–16 chars with 1 uppercase and 1 special char' });
  }

  try {
    const user = await User.findByPk(userId);
    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) return res.status(400).json({ message: 'Incorrect old password' });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    res.status(200).json({ message: 'Password updated' });
  } catch (err) {
    console.error('Update password error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
