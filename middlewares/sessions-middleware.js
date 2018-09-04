const sessionsService = require('../services/sessions-service');

function getActiveSessions(req, res, next) {
  sessionsService.getSessions('active')
    .then((sessions) => {
      res.send(sessions);
    })
    .catch((error) => {
      next(error);
    });
};

function getAllSessions(req, res, next) {
  const filters = {
    appName: req.query.appName,
    appVersion: req.query.appVersion,
  };

  sessionsService.getSessions('all', filters)
    .then((sessions) => {
      res.send(sessions);
    })
    .catch((error) => {
      next(error);
    });
};

module.exports = {
  getActiveSessions,
  getAllSessions,
};
