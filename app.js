const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const databaseApi = require('./database/database-api');

const sessionsRouter = require('./routes/sessions-router');
const logsRouter = require('./routes/logs-router');

const app = express();

databaseApi.connect(function (error) {
  if (error) {
   console.error('Connection to database failed!')
  } else {
   console.log('Connection to database succeeded!')
  }
})

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json({ type: '*/*' }));

app.use('/', [sessionsRouter, logsRouter]);

app.use(function(error, req, res, next) {
  if (error) {
    res.status(500).send({ status: 500, error });
  } else {
    next();
  }
});

module.exports = app;
