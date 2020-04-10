require('dotenv').config();
const path = require('path');
const express = require('express');
const session = require('express-session');
const mustacheExpress = require('mustache-express');
const { ExpressOIDC } = require('@okta/oidc-middleware');

const templateDir = path.join(__dirname, '..', 'views');
const frontendDir = path.join(__dirname, '..', 'assets');

const app = express();

const config = require('../config');
const model = require('../database/model');

const oidc = new ExpressOIDC(config.oidc);

// const cors = require('cors');
// app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'this is another secret',
  resave: true,
  saveUninitialized: false
}));

const displayConfig = Object.assign(
  {},
  config.oidc,
  {
    clientSecret: '****' + config.oidc.client_secret.substr(config.oidc.client_secret.length - 4, 4)
  }
);

app.locals.oidcConfig = displayConfig;

app.use('/assets', express.static(frontendDir));
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', templateDir);

app.use(oidc.router);

// app.use('/', (req, _res, next) => {
//   console.debug(`url=${req.url}`);
//   console.log('User is authenticated? ' + req.userContext);
//   next();
// });

app.get('/', (req, res) => {
  const userinfo = req.userContext && req.userContext.userinfo;
  res.render('home', {
    isLoggedIn: !!userinfo,
    userinfo: userinfo,
  });
});

app.get('/profile', oidc.ensureAuthenticated(), (req, res) => {
  // Convert the userinfo object into an attribute array, for rendering with mustache
  const userinfo = req.userContext && req.userContext.userinfo;
  const attributes = Object.entries(userinfo);
  res.render('profile', {
    isLoggedIn: !!userinfo,
    userinfo: userinfo,
    attributes
  });
});

// app.use('/', express.static('public'));

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
  app.listen(process.env.PORT, () => {
    console.log(`MessageLake listening on port ${process.env.PORT}`);
  });
};

oidc.on('ready', startServer);

oidc.on('error', (error) => {
  console.error(`Error configuring oidc middleware ${error}`);
});
