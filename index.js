const express = require('express');
const corsAnywhere = require('cors-anywhere');
const app = express();

// Middleware to handle preflight requests
app.options('*', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,Origin,Accept');
    res.sendStatus(200);
});

// Create a CORS Anywhere proxy
const proxy = corsAnywhere.createServer({
    originWhitelist: [], // Allow all origins
    removeHeaders: ['cookie', 'cookie2'],
    setHeaders: {
        'Access-Control-Allow-Origin': '*', // Allow all origins
    },
});

// Use the full request path without requiring a query parameter
app.use((req, res) => {
    const targetUrl = req.url.slice(1); // Remove the leading slash to get the full URL
    if (!targetUrl.startsWith('http')) {
        res.status(400).send('Invalid URL provided');
        return;
    }

    req.url = `/${targetUrl}`;
    proxy.emit('request', req, res);
});

// Export the app for Vercel
module.exports = app;
