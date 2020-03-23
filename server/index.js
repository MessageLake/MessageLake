const express = require('express');

const app = express();
const PORT = 3000;

app.use('/', (req, _res, next) => {
  console.debug(`url=${req.url}`);
  next();
});

app.use('/home', express.static('public'));

app.get('/', (req, res) => {
  res.redirect(301, '/home');
});

app.get('/feed', (req, res) => {
  res.redirect(301, '/home');
});

app.post('/message', (req, res) => {
  console.log('Recieved a message');
  res.redirect(301, '/home');
});

app.listen(PORT, () => {
  `MessageLake listening on port ${PORT}`;
});
