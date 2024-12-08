const express = require('express');
const corsAnywhere = require('cors-anywhere');
const app = express();

// Create a CORS Anywhere proxy
const proxy = corsAnywhere.createServer({
    originWhitelist: [], // Allow all origins
    requireHeader: ['origin', 'x-requested-with'],
    removeHeaders: ['cookie', 'cookie2'],
    setHeaders: {
        'Access-Control-Allow-Origin': '*' // Allow all origins
    }
});

// Handle requests with a query parameter 'url'
app.use((req, res) => {
    // Extract and set the URL for CORS Anywhere
    const targetUrl = req.query.url;
    if (!targetUrl) {
        res.status(400).send('No URL provided');
        return;
    }

    // Adjust the URL for CORS Anywhere
    req.url = targetUrl.startsWith('/') ? targetUrl : `/${targetUrl}`;
    proxy.emit('request', req, res);
});

module.exports = app;
