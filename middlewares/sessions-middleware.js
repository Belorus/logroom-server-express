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
  const additionalFilters = [];
  if (req.query.appName) {
    additionalFilters.push({
      type: 'equal',
      field: 'appName',
      value: req.query.appName,
    })
  }
  if (req.query.appVersion) {
    additionalFilters.push({
      type: 'equal',
      field: 'appVersion',
      value: req.query.appVersion,
    })
  }

  sessionsService.getSessions('all', additionalFilters)
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
