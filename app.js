const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const databaseApi = require('./database/database-api');
const sessionsRouter = require('./routes/sessions-router');
const logsRouter = require('./routes/logs-router');

const app = express();

databaseApi.connect()
  .then(() => {
    console.log('Connection to database succeeded!')
  }, (error) => {
    console.error('Connection to database failed! Error: ', error);
  });

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json({ type: '*/*' }));

app.use('/', [sessionsRouter, logsRouter]);

app.use((error, req, res, next) => {
  if (error) {
    res.status(500).send({ error });
  } else {
    next();
  }
});

module.exports = app;
