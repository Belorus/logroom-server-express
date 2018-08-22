const io = require('socket.io')();
const events = require('./socket-events');
const logsService = require('../services/logs-service');
const socketApi = { io };

io.on('connection', (socket) => {
  socket.on(events.SOCKET_F_START_LISTEN_SESSION, ({ sessionId, sendOld, limit }) => {
    socket.join(sessionId);
    if (sendOld) {
      logsService.getSessionLogs(sessionId, limit)
        .then((logs) => {
            socket.emit(events.SOCKET_B_PUSH_LOGS, { 
              logs,
              isOld: true,
          });
        })
        .catch((error) => {
          console.error(error);
        });
    }
  });

  socket.on(events.SOCKET_F_STOP_LISTEN_SESSION, ({ sessionId }) => {
    socket.leave(sessionId);
    socket.emit(events.SOCKET_B_STOP_LISTEN_SESSION_SUCCESS);
  });
});

socketApi.sendEventToRoom = function(room, event, payload) {
  this.io.sockets.to(room).emit(event, payload);
}

module.exports = socketApi;
