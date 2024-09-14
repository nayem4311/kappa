const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const app = express();
const port = 3000;

// Enable CORS
app.use(cors());

// Middleware to check API key
app.use((req, res, next) => {
    const apiKey = req.query.key; // Get the API key from the query parameter
    const validApiKey = 'NayemLeakStudioBD'; // Define the valid API key

    if (apiKey === validApiKey) {
        next(); // API key is correct, proceed to the next middleware or route handler
    } else {
        const message = `
            Forbidden: Invalid API key.
            Please contact us at <a href="https://facebook.com/leakstudio" target="_blank">facebook.com/leakstudio</a> for access.
            Note: This API is for personal use only.
            Made With Love by Mostafa Nayem
        `;
        res.status(403).send(message); // Return the error message with HTML formatting
    }
});

// API endpoint to get the image for an itemID
app.get('/image', async (req, res) => {
    const itemID = req.query.id;
    const filePath = path.join(__dirname, 'data', 'data.json');

    fs.readFile(filePath, 'utf8', async (err, data) => {
        if (err) {
            console.error('Error reading data file:', err);
            res.status(500).json({ message: "Error reading data file. Made With Love by Mostafa Nayem" });
        } else {
            const items = JSON.parse(data);
            const item = items.find(i => i.itemID === itemID);
            if (item) {
                // Construct the URL for the image
                const iconUrl = `https://ffcdn-kappa.vercel.app/image?key=NayemLeakStudioBD&iconName=${item.iconName}.png`;

                try {
                    // Fetch the image and stream it to the response
                    const response = await axios.get(iconUrl, { responseType: 'stream' });
                    res.setHeader('Content-Type', response.headers['content-type']);
                    response.data.pipe(res);
                } catch (fetchError) {
                    console.error('Error fetching the image:', fetchError);
                    res.status(500).json({ message: "Error fetching the image. Made With Love by Mostafa Nayem" });
                }
            } else {
                res.status(404).json({ message: "Item not found" });
            }
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
