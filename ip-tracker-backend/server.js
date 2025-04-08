// server.js
const express = require('express');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

app.use(cors());
app.use(bodyParser.json());

const FILE_PATH = './data.json';

app.post('/save-location', (req, res) => {
  const locationData = req.body;
  fs.writeFile(FILE_PATH, JSON.stringify(locationData, null, 2), (err) => {
    if (err) return res.status(500).send('Error saving file');
    res.send('Location saved');
  });
});

app.get('/get-location', (req, res) => {
  fs.readFile(FILE_PATH, 'utf8', (err, data) => {
    if (err) return res.status(500).send('Error reading file');
    res.send(JSON.parse(data));
  });
});

app.listen(8080, () => {
  console.log('Server running on http://localhost:8080');
});
