const sessionsService = require('../services/sessions-service');

function getActiveSessions(req, res, next) {
  sessionsService.getActiveSessions()
    .then((sessions) => {
      res.send(sessions);
    }, (error) => {
      next(error);
    })
};

module.exports = {
  getActiveSessions,
};
