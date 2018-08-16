const logsService = require('../services/logs-service');
const socketApi = require('../socket/socket-api');

function getSessionLogs(req, res, next) {
  const sessionId = req.query.sessionId;
  const startFrom = parseInt(req.query.startFrom);
  const limit = parseInt(req.query.limit);

  if (!sessionId) {
    return res.sendStatus(400);
  }

  logsService.getSessionLogs(sessionId, limit, startFrom)
    .then((logs) => {
      res.send(logs);
    })
    .catch((error) => {
      next(error);
    });
};

function addSessionLogsAndUpdateInfo(req, res, next) {
  if (!req.body.session_id) {
    return res.sendStatus(400);
  }

  const sessionInfo = {
    id: req.body.session_id,
    seqNumber: req.body.seq_number,
    logs: req.body.logs,
    additional: req.body.additional_parameters,
  };

  logsService.pushLogsToSessionAndUpdateInfo(sessionInfo)
    .then((socketRoomEvents) => {
      socketRoomEvents.forEach((event) => {
        console.log(event.payload.logs[0].seqNumber);
        socketApi.sendEventToRoom(event.roomId, event.type, event.payload);
      });
      res.send('ok');
    })
    .catch((error) => {
      next(error);
    });
};

module.exports = {
  addSessionLogsAndUpdateInfo,
  getSessionLogs,
};
