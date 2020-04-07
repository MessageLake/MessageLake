require('dotenv').config();
const express = require('express');

const app = express();

app.listen(process.env.PORT, () => {
  `Auth server listening at ${process.env.PORT}`;
});
