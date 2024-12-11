const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { convertYamlToJson } = require('./controllers/convertController');
const { convertStringToJson } = require('./controllers/convertStringToJson');
const { validateJson } = require('./controllers/validateJson');
const { queryJsonPath } = require('./controllers/queryJsonPath');
const { convertXmlToJson } = require('./controllers/convertXmlToJson');


const app = express();
const port = 3000;


// Middleware to parse text/plain bodies
app.use(bodyParser.text());
app.use(express.json())

// Serve static files from the current directory
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve the home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Use the controller for the convert route
app.post('/convert', convertStringToJson);

// New validate route
app.post('/validate', validateJson);

// New JSONPath query endpoint
app.post('/query', queryJsonPath);

// New YAML conversion endpoint
app.post('/yaml2json', convertYamlToJson);

// New XML conversion endpoint
app.post('/xml2json', convertXmlToJson);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
