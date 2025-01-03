const express = require('express');
const corsAnywhere = require('cors-anywhere');
const app = express();

const proxy = corsAnywhere.createServer({
    originWhitelist: [], // Allow all origins
    removeHeaders: ['cookie', 'cookie2'],
    setHeaders: {
        'Access-Control-Allow-Origin': '*' // Allow all origins
    }
});

app.use((req, res) => {
    // Extract the target URL from the request path
    const targetUrl = req.url.slice(1); 
    if (!targetUrl.startsWith('http')) {
        res.status(400).send('Invalid URL provided');
        return;
    }

    req.url = `/${targetUrl}`;
    proxy.emit('request', req, res);
});

module.exports = app;
