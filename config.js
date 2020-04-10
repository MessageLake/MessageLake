module.exports = {
  oidc: {
    issuer: `https://${process.env.OKTA_DOMAIN}.com/oauth2/default`,
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    appBaseUrl: `http://messagelake:3000`,
    scope: 'openid profile email',
    testing: {
      disableHttpsCheck: true
    }
  }
};
