const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

dotenv.config({ path: './config/config.env' });

// Database connection
const connectDB = require('./config/db');
connectDB();

const app = express();

// Enable body parser and cookie parser
app.use(express.json());
app.use(cookieParser());

// Import route files
const auth = require('./routes/auth');

// Define routes
app.use('/api/v1/auth', auth);

// Using logger only while on development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const port = process.env.PORT || 5000;
const server = app.listen(port, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`.green.inverse)
);

// A way to handle unhandled rejections :)
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  server.close(() => process.exit(1));
});
