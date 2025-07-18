//.env
require('dotenv').config();

const port = process.env.PORT ;



const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import route handlers
const adminRouter = require('./routes/admin');
const userRouter = require('./routes/user');
const coursesRouter = require('./routes/courses');

// Initialize express app
const app = express();


// Connect to MongoDB
const mongoURI = process.env.MONGODB_URI;
mongoose.connect(mongoURI);

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/admin', adminRouter);
app.use('/users', userRouter);
app.use('/courses', coursesRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${(port)}`);
});
