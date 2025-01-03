const express = require('express');
const corsAnywhere = require('cors-anywhere');
const app = express();

// Create a CORS Anywhere proxy
const proxy = corsAnywhere.createServer({
    originWhitelist: [], // Allow all origins
    removeHeaders: ['cookie', 'cookie2'],
    setHeaders: {
        'Access-Control-Allow-Origin': '*', // Allow all origins
    },
});

// Middleware to ensure required headers are set
app.use((req, res, next) => {
    if (!req.headers.origin) {
        req.headers.origin = 'https://example.com'; // Set a default Origin
    }
    if (!req.headers['x-requested-with']) {
        req.headers['x-requested-with'] = 'XMLHttpRequest'; // Add the X-Requested-With header
    }
    next();
});

// Handle requests to the proxy
app.use((req, res) => {
    const targetUrl = req.url.slice(1); // Extract the target URL
    if (!targetUrl.startsWith('http')) {
        res.status(400).send('Invalid URL provided');
        return;
    }

    req.url = `/${targetUrl}`; // Rewrite the URL for the proxy
    proxy.emit('request', req, res);
});

// Export the app for Vercel
module.exports = app;
