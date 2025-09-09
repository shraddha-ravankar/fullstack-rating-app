const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { connectDB, sequelize } = require('./config/db');





const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const ownerRoutes = require('./routes/ownerRoutes');


const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

//sql

connectDB();
sequelize.sync({ alter: true });


// connectDB();





  
  // Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/owner', ownerRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


