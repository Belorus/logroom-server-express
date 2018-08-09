const logsService = require('../services/logs-service');

function addNewLogsToSession(req, res, next) {
  if (!req.body.session_id) {
    return res.sendStatus(400);
  }

  logsService.pushLogsToSession(req)
    .then(() => {
      res.send('ok');
    }, (error) => {
      next(error);
    })
};

module.exports = {
  addNewLogsToSession,
};
