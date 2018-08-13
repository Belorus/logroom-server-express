const db = require('../database/database-api');
const { dbTables } = require('../database/database-constants');
const { SOCKET_B_PUSH_LOGS } = require('../socket/socket-events');

function getSessionLogs(sessionId) {
  return new Promise((resolve, reject) => {
    db.getRecord(dbTables.SESSIONS, sessionId)
      .then((session) => {
        if (session) {
          const keys = [];
          for (let i = session.logsCount; i >= 1; i--) {
            keys.push(db.generateKeyForBatchRead(dbTables.LOGS, `${session.id}_${i}`));
          };
          db.batchReadRecords(keys).then(resolve, reject);
        } else {
          reject('Session not found');
        }
      }, (error) => {
        return reject(error);
      });
  });
}

function pushLogsToSessionAndUpdateInfo(newSessionInfo) {
  return new Promise((resolve, reject) => {
    db.getRecord(dbTables.SESSIONS, newSessionInfo.id)
      .then((session) => {
        const updatedSession= session || { id: newSessionInfo.id, logsCount: 0 };

        if (session) {
          if (newSessionInfo.seqNumber <= session.seqNumber) {
            return reject('Bad sequence number');
          }
        } 
      
        newSessionInfo.logs.forEach((log, index) => {
          log.seqNumber = updatedSession.logsCount + index + 1;
          db.writeRecord(dbTables.LOGS, `${updatedSession.id}_${log.seqNumber}`, log);
        });

        updatedSession.seqNumber = newSessionInfo.seqNumber;
        updatedSession.additional =  { ...updatedSession.additional, ...newSessionInfo.additional };
        updatedSession.logsCount = updatedSession.logsCount + newSessionInfo.logs.length;
        updatedSession.updatedAt = Date.now();

        db.writeRecord(dbTables.SESSIONS, updatedSession.id, updatedSession)
          .then(() => {}, (error) => {
            console.error(error);
          });

        resolve([{
          roomId: newSessionInfo.id,
          type: SOCKET_B_PUSH_LOGS,
          payload: {
            logs: newSessionInfo.logs,
            total: updatedSession.logsCount,
          }
        }]);
      }, (error) => {
        reject(error);
      });
  })
};

module.exports = {
  getSessionLogs,
  pushLogsToSessionAndUpdateInfo,
};
