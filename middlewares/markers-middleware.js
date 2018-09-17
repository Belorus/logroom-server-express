const markersService = require('../services/markers-service');

function addSessionMarker(req, res, next) {
  const sessionId = req.params.sessionId;
  const marker = req.body;

  markersService.addSessionMarker(sessionId, marker)
    .then((marker) => {
      res.send(marker);
    })
    .catch((error) => {
      next(error);
    });
};

function getSessionMarkers(req, res, next) {
  const sessionId = req.params.sessionId;

  markersService.getSessionMarkers(sessionId)
    .then((markers) => {
      res.send(markers);
    })
    .catch((error) => {
      next(error);
    });
};

function deleteSessionMarker(req, res, next) {
  const sessionId = req.params.sessionId;
  const markerId = req.query.markerId;

  markersService.deleteSessionMarker(sessionId, markerId)
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      next(error);
    });
};

module.exports = {
  addSessionMarker,
  getSessionMarkers,
  deleteSessionMarker,
};
