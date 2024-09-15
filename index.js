const express = require('express');
const axios = require('axios');
const cors = require('cors');
const sharp = require('sharp'); // Import sharp package
const app = express();

const API_KEY = 'NayemLeakStudioBD';

// Enable CORS for all routes
app.use(cors());

// Middleware to check API key
app.use((req, res, next) => {
    const key = req.query.key;
    if (key !== API_KEY) {
        return res.status(403).send(`
            <h1>403 Forbidden</h1>
            <p>Invalid API key. Please contact our support team at <a href="https://facebook.com/leakstudio">Leak Studio Bangladesh</a> for assistance.</p>
            <p>Ensure that you have the correct credentials to access this resource.</p>
        `);
    }
    next();
});

// Updated endpoint to fetch and display the image directly based on itemID with overlay text
app.get('/item-icon', async (req, res) => {
    const itemID = req.query.itemID;
    if (!itemID) {
        return res.status(400).send('itemID query parameter is required');
    }

    const externalApiUrl = `https://info-jade.vercel.app/data?id=${itemID}&key=${API_KEY}`;

    try {
        const response = await axios.get(externalApiUrl);
        const data = response.data;

        if (data && data.iconUrl) {
            // Fetch the image from the iconUrl
            const imageResponse = await axios.get(data.iconUrl, {
                responseType: 'arraybuffer
