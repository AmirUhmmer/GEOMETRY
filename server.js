const express = require('express');
const session = require('cookie-session');
const { PORT, SERVER_SESSION_SECRET } = require('./config.js');
const path = require('path');  // Add path module

let app = express();

// app.use(express.static(path.join(__dirname, 'wwwroot')));
app.use(express.static(path.join(__dirname, 'wwwroot')));
// app.use(session({ secret: SERVER_SESSION_SECRET, maxAge: 24 * 60 * 60 * 1000 }));
app.use(session({ 
    keys: [SERVER_SESSION_SECRET], // Add the session secret as a key in an array
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

// Serve index.html for the root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'wwwroot', 'index.html'));
});

app.get('/main.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'wwwroot', ' main.css'));
});

app.get('/main.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'wwwroot', ' main.js'));
});

app.get('/viewer.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'wwwroot', ' viewer.js'));
});

app.get('/viewer.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'wwwroot', ' sidebar.js'));
});

app.use(require('./routes/auth.js'));
app.use(require('./routes/hubs.js'));
app.listen(PORT, () => console.log(`Server listening on port ${PORT}...`));
