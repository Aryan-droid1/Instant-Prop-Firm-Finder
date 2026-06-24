const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/user.routes');
const firmRoutes = require('./routes/firm.routes');
const reviewRoutes = require('./routes/review.routes');
const app = express();




app.use(cors({
  origin: [
    "http://localhost:8081",
    "https://instant-prop-firm-finder-production.up.railway.app"
  ],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());


app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/firms', firmRoutes);
app.use('/api/reviews', reviewRoutes);

module.exports = app;