const db = require('../database/database-api');
const { dbTables } = require('../database/database-constants');
const { SOCKET_B_PUSH_LOGS } = require('../socket/socket-events');

function getSessionLogs(sessionId) {
  return new Promise((resolve, reject) => {
    db.getRecord(dbTables.SESSIONS, sessionId)
      .then((record) => {
        if (record) {
          resolve(record.logs);
        } else {
          reject('Session not found');
        }
      }, (error) => {
        return reject(error);
      });
  });
}

function pushLogsToSession(req) {
  return new Promise((resolve, reject) => {
    const newAdditionalInfo = req.body.additional_parameters;
    const newLogs = req.body.logs;
    const sessionData = {
      id: req.body.session_id,
      seq_number: req.body.seq_number,
    };
  
    db.getRecord(dbTables.SESSIONS, sessionData.id)
      .then((record) => {
        if (record) {
          if (sessionData.seq_number <= record.seq_number) {
            return reject('Bad sequence number');
          }
          sessionData.additional = { ...record.additional, ...newAdditionalInfo }
          sessionData.logs = [ ...record.logs, ...newLogs ];
        } else {
          sessionData.additional = newAdditionalInfo;
          sessionData.logs = newLogs;
        }
    
        sessionData.updatedAt = Date.now();
      
        db.writeRecord(dbTables.SESSIONS, sessionData.id, sessionData)
          .then((record) => {
            resolve([{
              roomId: sessionData.id,
              type: SOCKET_B_PUSH_LOGS,
              payload: {
                logs: newLogs,
                total: sessionData.logs.length,
              }
            }]);
          }, (error) => {
            reject(error);
          })
      }, (error) => {
        reject(error);
      });
  })
};

module.exports = {
  getSessionLogs,
  pushLogsToSession,
};
