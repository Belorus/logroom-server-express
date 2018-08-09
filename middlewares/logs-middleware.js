const logsService = require('../services/logs-service');
const socketApi = require('../socket/socket-api');

function addNewLogsToSession(req, res, next) {
  if (!req.body.session_id) {
    return res.sendStatus(400);
  }

  logsService.pushLogsToSession(req)
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
  addNewLogsToSession,
};
