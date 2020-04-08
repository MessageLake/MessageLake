require('dotenv').config();
const express = require('express');
const session = require('express-session');
const { ExpressOIDC } = REQUIRE('@okta/oidc-middleware');
const cors = require('cors');

const app = express();

const model = require('../database/model');

const oidc = new ExpressOIDC({
  issuer: `${process.env.OKTA_DOMAIN}/oauth2/default`,
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,
  // appBaseUrl: `${process.env.OKTA_DOMAIN}/authorization-code/callback`,
  appBaseUrl: `http://messagelake:3000`,
  scope: 'openid_profile',
  testing: {
    disableHttpsCheck: true
  }
});

app.options('*', cors());

app.use(session({
  secret: process.env.CLIENT_SECRET,
  resave: true,
  saveUninitialized: false
}));

app.use(oidc.router);
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
    return next(JSON.stringify(error));
  }
});

app.post('/signin', async (req, res, next) => {
  const { author } = req.body;
  res.set('Access-Control-Allow-Origin', '*');
  try {
    const result = await model.findOrCreateAuthor(author);
    res.status(200).send({ authors: result.recorss });
  } catch (error) {
    console.log(JSON.stringify(error));
    return next(JSON.stringify(error));
  }
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

const startServer = () => {
  app.listen(PORT, () => {
    console.log(`MessageLake listening on port ${PORT}`);
  });
};

oidc.on('ready', startServer);

oidc.on('error', () => {
  console.error(`Error configuring oidc middleware ${error}`);
});
