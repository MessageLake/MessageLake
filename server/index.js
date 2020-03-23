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

app.use('/lake', express.static('public'));

app.get('/', (_req, res) => {
  res.redirect(301, '/lake');
});

app.get('/feed', (_req, res) => {
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

app.post('/message', (_req, res) => {
  console.log('Recieved a message');
  res.redirect(301, '/lake');
});

app.listen(PORT, () => {
  `MessageLake listening on port ${PORT}`;
});
