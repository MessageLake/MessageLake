require('dotenv').config();
const express = require('express');
const session = require('express-session');
const { ExpressOIDC } = require('@okta/oidc-middleware');

const app = express();

app.use(session({
  secret: process.env.SECRET,
  resave: true,
  saveUninitialized: false
}));

const oidc = new ExpressOIDC({
  issuer: `${process.env.OKTA_DOMAIN}/oauth2/default`,
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,
  redirect_uri: process.env.REDIRECT_URI,
  scope: 'openid profile'
});

app.use(oidc.router);

oidc.on('ready', () => {
  app.listen(process.env.PORT, () => {
    `Auth server listening at ${process.env.PORT}`;
  });
});

oidc.on('error', (err) => {
  console.error('Unable to configure ExpressOIDC', err);
});

