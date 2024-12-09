//# Server configuration

const express = require('express');
const http = require('http');
const initializeSocket = require('./socket/socketServer');

const app = express();
const server = http.createServer(app);

// Initialize socket.io
const io = initializeSocket(server);

// Make io accessible to the route handlers
app.set('io', io);

// ... rest of your server configuration ...

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});