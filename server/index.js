require('dotenv').config();
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
  const { terms, relevance } = req.body;
  model.getFeed(terms, relevance, (err, feed) => {
    if (!err) {
      res.send(feed);
    } else {
      res.status(500).send(err);
    }
  });
});

app.post('/signin', (req, res) => {
  const { author } = req.body;
  model.findAuthor(author, (error, foundAuthor) => {
    if (!error) {
      if (foundAuthor == null) {
        model.createAuthor(author, (error, createdAuthor) => {
          if (!error) {
            res.send({ createdAuthor });
          } else {
            res.sendStatus(500);
          }
        });
      } else {
        res.send({ foundAuthor });
      }
    } else {
      res.sendStatus(500);
    }
  });
});

app.post('/message', (req, res) => {
  const { message } = req.body;
  model.saveMessage(message, (err) => {
    if (!err) {
      res.sendStatus(200);
    } else {
      res.sentStatus(500);
    }
  });
});

app.listen(PORT, () => {
  `MessageLake listening on port ${PORT}`;
});
