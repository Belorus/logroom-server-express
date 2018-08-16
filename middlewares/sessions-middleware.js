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
  sessionsService.getSessions('all')
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
