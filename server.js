// const express = require('express');
// const session = require('cookie-session');
// const { PORT, SERVER_SESSION_SECRET } = require('./config.js');
// const path = require('path');

// let app = express();

// // Serve static files from 'wwwroot' directory
// app.use(express.static(path.join(__dirname, 'wwwroot')));

// // Use session middleware
// app.use(session({
//     keys: [SERVER_SESSION_SECRET],
//     maxAge: 24 * 60 * 60 * 1000 // 24 hours
// }));

// // Serve index.html for the root path
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'wwwroot', 'index.html'));
// });

// // Serve CSS file
// app.get('/main.css', (req, res) => {
//     res.sendFile(path.join(__dirname, 'wwwroot', 'main.css'));
// });

// // Serve JS file
// app.get('/main.js', (req, res) => {
//     res.sendFile(path.join(__dirname, 'wwwroot', 'main.js')); // Fixed extra space in the path
// });

// // Import custom routes
// app.use(require('./routes/auth.js'));
// app.use(require('./routes/hubs.js'));

// // Error handling middleware
// app.use((err, req, res, next) => {
//     console.error(err.stack); // Log the error
//     res.status(500).send('Something went wrong!'); // Send a generic error message
// });

// // Start the server
// app.listen(PORT, () => console.log(`Server listening on port ${PORT}...`));



//convert to esm

import express from 'express';
import session from 'cookie-session';
import { PORT, SERVER_SESSION_SECRET } from './config.js';
import path from 'path';

const app = express();

// Serve static files from 'wwwroot' directory
app.use(express.static(path.join(__dirname, 'wwwroot')));

// Use session middleware
app.use(session({
    keys: [SERVER_SESSION_SECRET],
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

// Serve index.html for the root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'wwwroot', 'index.html'));
});

// Serve CSS file
app.get('/main.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'wwwroot', 'main.css'));
});

// Serve JS file
app.get('/main.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'wwwroot', 'main.js')); // Fixed extra space in the path
});

// Import custom routes
import authRoutes from './routes/auth.js';
import hubsRoutes from './routes/hubs.js';

app.use(authRoutes);
app.use(hubsRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error
    res.status(500).send('Something went wrong!'); // Send a generic error message
});

// Start the server
app.listen(PORT, () => console.log(`Server listening on port ${PORT}...`));
