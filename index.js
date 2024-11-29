const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;


// Middleware to parse text/plain bodies
app.use(bodyParser.text());

// Serve static files from the current directory
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve the home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/convert', (req, res) => {
    const requestBody = req.body;

    try {
        // Directly parse the JSON string if it is valid
        const jsonResult = JSON.parse(JSON.parse(requestBody));

        console.log(jsonResult);

       
        // Respond with the parsed JSON
        res.status(200).json({
            success: true,
            message: 'String successfully converted to JSON',
            data: jsonResult,
        });
    } catch (error) {
        // If parsing fails, handle gracefully
        res.status(400).json({
            success: false,
            message: 'Invalid JSON string provided',
            error: error.message,
        });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
