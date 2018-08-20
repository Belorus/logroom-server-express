const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const fs = require('fs');

const databaseApi = require('./database/database-api');
const sessionsRouter = require('./routes/sessions-router');
const logsRouter = require('./routes/logs-router');

const app = express();

setTimeout(() => {
  databaseApi.connect()
    .then(() => {
      console.log('Connection to database succeeded!')
    })
    .catch((e) => {
      console.error('Connection to database failed. Reconnect after 3 seconds.')
      setTimeout(() => databaseApi.connect(), 3000);
    });
}, 3000);

app.use(cors())
app.use(logger('dev'));
app.use('/files', express.static(__dirname + '/public/files'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json( { type: '*/*'} ));

app.use('/', [sessionsRouter, logsRouter]);

app.use((error, req, res, next) => {
  if (error) {
    res.status(500).send({ error });
  } else {
    next();
  }
});

if (!fs.existsSync('public/files')){
  fs.mkdirSync('public/files');
}

module.exports = app;
