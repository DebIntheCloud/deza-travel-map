require('dotenv').config();  // Load environment variables from .env file
const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

// Route to proxy Mapbox API request
app.get('/mapbox-data', async (req, res) => {
    try {
        const response = await axios.get('https://api.mapbox.com/some-endpoint', {
            params: {
                access_token: process.env.MAPBOX_API_KEY,  // Use environment variable
            }
        });
        res.json(response.data);  // Send the response to the front-end
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
});

// Serve static files (your front-end files)
app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

