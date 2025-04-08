const express = require('express');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

app.use(cors());
app.use(bodyParser.json());

const FILE_PATH = './data.json';

// Save location data
app.post('/save-location', (req, res) => {
  const locationData = req.body;
  fs.writeFile(FILE_PATH, JSON.stringify(locationData, null, 2), (err) => {
    if (err) return res.status(500).send('Error saving file');
    res.send('Location saved');
  });
});

// Get location data
app.get('/get-location', (req, res) => {
  fs.readFile(FILE_PATH, 'utf8', (err, data) => {
    if (err) return res.status(500).send('Error reading file');
    res.send(JSON.parse(data));
  });
});

// Clear the file every 5 minutes
setInterval(() => {
  fs.writeFile(FILE_PATH, '{}', (err) => {
    if (err) {
      console.error('Failed to clear data.json:', err);
    } else {
      console.log('data.json has been cleared.');
    }
  });
}, 5 * 60 * 1000); // 5 minutes in milliseconds

app.listen(8080, () => {
  console.log('Server running on http://localhost:8080');
});
