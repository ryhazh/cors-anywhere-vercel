const express = require('express');
const corsAnywhere = require('cors-anywhere');
const app = express();

const proxy = corsAnywhere.createServer({
    originWhitelist: [], // Allow all origins
    removeHeaders: ['cookie', 'cookie2'],
    setHeaders: {
        'Access-Control-Allow-Origin': '*', // Allow all origins
    },
});

// Handle incoming requests
app.use((req, res) => {
    // Ensure an Origin header is always present
    if (!req.headers.origin) {
        req.headers.origin = '*'; // Set a generic Origin header
    }

    // Extract the full target URL from the request path
    const targetUrl = req.url.slice(1);
    if (!targetUrl.startsWith('http')) {
        res.status(400).send('Invalid URL provided');
        return;
    }

    // Rewrite the request URL to match the target URL
    req.url = `/${targetUrl}`;
    proxy.emit('request', req, res);
});

module.exports = app;
