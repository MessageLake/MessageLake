const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;
const sampleFeed = path.resolve('./data/sampleFeed.json');

app.use('/', (req, _res, next) => {
  console.debug(`url=${req.url}`);
  next();
});

app.use('/home', express.static('public'));

app.get('/', (req, res) => {
  res.redirect(301, '/home');
});

app.get('/feed', (req, res) => {
  fs.readFile(sampleFeed, (err, data) => {
    if (!err) {
      res.send(data);
    } else {
      const errorResponse = {
        message: 'Sorry, there was an error fetching the resource at /feed'
      };
      res.send(500, JSON.stringify(errorResponse));
    }
  });
});

app.post('/message', (req, res) => {
  console.log('Recieved a message');
  res.redirect(301, '/home');
});

app.listen(PORT, () => {
  `MessageLake listening on port ${PORT}`;
});
