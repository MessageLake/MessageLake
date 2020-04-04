require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT;

const model = require('../database/model');

app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', (req, _res, next) => {
  console.debug(`url=${req.url}`);
  next();
});

app.use(express.static('public'));

app.get('/feed', async (req, res, next) => {
  // When you get messages, you need to get the author names and tags for each message
  //    You can't just send back foreign keys
  let { terms, relevance } = req.query;
  terms = terms.split(/\s/);
  res.set('Access-Control-Allow-Origin', '*');
  try {
    const result = await model.getFeed(terms, relevance);
    const { records } = result;
    res.status(200).send({ messages: records });
  } catch (error) {
    // this error is not always JSON, only SQL errors are
    next(JSON.stringify(error));
  }
});

app.post('/signin', (req, res) => {
  const { author } = req.body;
  model.findOrCreateAuthor(author, (err, result) => {
    // really just get these async before you do more of this please
  });
});

app.post('/message', async (req, res, next) => {
  const { message } = req.body;
  res.set('Access-Control-Allow-Origin', '*');
  try {
    await model.saveMessage(message);
    console.log('Successfully saved message');
    res.status(200).send();
  } catch (error) {
    return next(JSON.stringify(error));
  }
});

app.listen(PORT, () => {
  `MessageLake listening on port ${PORT}`;
});
