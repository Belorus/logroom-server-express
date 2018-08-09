const logsService = require('../services/logs-service');
const socketApi = require('../socket/socket-api');

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
        socketApi.sendEventToRoom(event.roomId, event.type, event.payload);
      });
      res.send('ok');
    }, (error) => {
      next(error);
    })
};

module.exports = {
  addSessionLogsAndUpdateInfo,
};
