'use strict';

const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 1337;

// Serve static files (CSS, JS, JSON, images) from the root directory
app.use(express.static(path.join(__dirname)));

// Serve index.html for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

