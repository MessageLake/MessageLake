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
  model.findAuthor(author, (error, findResult, _fields) => {
    if (!error) {
      if (findResult.length == 0) {
        model.createAuthor(author, (error, createResult) => {
          if (!error) {
            res.send({ author: createResult[0] });
          } else {
            console.error(`Error creating author ${author}`);
            res.status(500).send({ errorMessage: "Error saving author" });
          }
        });
      } else {
        console.log(`Author ${findResult[0].author} found`);
        res.send({ author: findResult[0].author });
      }
    } else {
      res.status(500).send({ errorMessage: `Error finding author ${author}` });
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
