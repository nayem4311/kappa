const express = require('express');
const axios = require('axios');
const cors = require('cors');
const { createCanvas, loadImage } = require('canvas'); // Import canvas package
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
                responseType: 'arraybuffer'
            });

            // Load the image into canvas
            const image = await loadImage(imageResponse.data);

            // Create a canvas with the same size as the image
            const canvas = createCanvas(image.width, image.height);
            const ctx = canvas.getContext('2d');

            // Draw the image onto the canvas
            ctx.drawImage(image, 0, 0);

            // Add overlay text
            ctx.font = 'bold 30px Arial'; // Set the font style
            ctx.fillStyle = 'white'; // Set the text color
            ctx.strokeStyle = 'black'; // Add an outline to make the text stand out
            ctx.lineWidth = 2;
            const text = '@nayem';
            const textWidth = ctx.measureText(text).width;

            // Position the text at the bottom-right corner
            ctx.fillText(text, image.width - textWidth - 20, image.height - 20);
            ctx.strokeText(text, image.width - textWidth - 20, image.height - 20);

            // Send the image as PNG
            res.set('Content-Type', 'image/png');
            canvas.toBuffer((err, buffer) => {
                if (err) {
                    return res.status(500).send('Error generating image');
                }
                res.send(buffer);
            });
        } else {
            res.status(404).send('Icon URL not found');
        }
    } catch (error) {
        res.status(500).send('Error fetching data from external API');
    }
});

// Export the app for Vercel
module.exports = app;
