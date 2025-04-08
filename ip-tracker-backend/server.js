const express = require('express');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = require('node-fetch'); // install this if you haven't already

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

// ✅ NEW: Get IP location info from ip-api (called by frontend securely)
app.get('/get-ip-info', async (req, res) => {
  try {
    const ipRes = await fetch('https://api.ipify.org?format=json');
    const ipData = await ipRes.json();

    const locationRes = await fetch(`https://ipwho.is/${ipData.ip}`);
    const locationData = await locationRes.json();

    res.json(locationData);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get IP info', details: err.message });
  }
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
}, 5 * 60 * 1000); // 5 minutes

app.listen(8080, () => {
  console.log('Server running on http://localhost:8080');
});
