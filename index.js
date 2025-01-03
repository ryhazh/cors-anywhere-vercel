const express = require('express');
const corsAnywhere = require('cors-anywhere');
const app = express();

const proxy = corsAnywhere.createServer({
    originWhitelist: [], // Allow all origins
    removeHeaders: ['cookie', 'cookie2'],
    setHeaders: {
        'Access-Control-Allow-Origin': '*' 
    }
});

app.use((req, res) => {
    // Extract the full target URL from the request path
    const targetUrl = req.url.slice(1); 
    if (!targetUrl.startsWith('http')) {
        res.status(400).send('Invalid URL provided');
        return;
    }

    req.url = `/${targetUrl}`;
    proxy.emit('request', req, res);
});

// Export the app for Vercel
module.exports = app;
