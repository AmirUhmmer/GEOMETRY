const express = require('express');
const session = require('cookie-session');
const { PORT, SERVER_SESSION_SECRET } = require('./config.js');
const path = require('path');




let app = express();


// Set security headers
app.use((req, res, next) => {
    res.setHeader('Content-Security-Policy', 'frame-ancestors https://semydev.crm4.dynamics.com/');
    res.setHeader('X-Frame-Options', 'ALLOW-FROM https://semydev.crm4.dynamics.com/');
    next();
  });

  

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



// Import custom routes
app.use(require('./routes/auth.js'));
app.use(require('./routes/hubs.js'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error
    res.status(500).send('Something went wrong!'); // Send a generic error message
});

// Start the server
app.listen(PORT, () => console.log(`Server listening on port ${PORT}...`));

