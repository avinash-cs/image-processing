const express = require('express');
const path = require('path');
const env = require('dotenv');
env.config();
const connectDB = require('./connection/db');
const { startAgenda } = require('./agenda/agenda');
const routes = require('./routes/index');

const app = express();

// Middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
connectDB();

// Start Agenda
startAgenda();

// Use routes
app.use('/', routes);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});