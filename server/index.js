const express = require('express');

const app = express();
const PORT = 3000;

const model = require('../database/model');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', (req, _res, next) => {
  console.debug(`url=${req.url}`);
  next();
});

app.use('/lake', express.static('public'));

app.get('/', (_req, res) => {
  res.redirect(301, '/lake');
});

app.get('/feed', (req, res) => {
  const { terms } = req.body;
  model.getFeed(terms, res);
});

app.post('/signin', (req, res) => {
  const { author } = req.body;
  res.status(200);
  res.send({ author });
});

app.post('/message', (req, res) => {
  const { message } = req.body;
  model.saveMessage(message);
  res.sendStatus(200);
});

app.listen(PORT, () => {
  `MessageLake listening on port ${PORT}`;
});
