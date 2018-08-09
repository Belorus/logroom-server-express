const db = require('../database/database-api');
const { dbTables } = require('../database/database-constants');
const socketApi = require('../socket/socket-api');
const { SOCKET_B_PUSH_LOGS } = require('../socket/socket-events');

function getSessionLogs(sessionId) {
  return new Promise((resolve, reject) => {
    db.getRecord(dbTables.SESSIONS, sessionId, (error, record) => {
      if (error) {
        return reject(error);
      }

      if (record) {
        resolve(record.logs);
      } else {
        reject('Session not found');
      }
    });
  })
}

function pushLogsToSession(req) {
  return new Promise((resolve, reject) => {
    const newAdditionalInfo = req.body.additional_parameters;
    const newLogs = req.body.logs;
    const sessionData = {
      id: req.body.session_id,
      seq_number: req.body.seq_number,
    };
  
    db.getRecord(dbTables.SESSIONS, sessionData.id, (error, record) => {
      if (error) {
        return reject(error);
      } 
    
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
  
      // sessionData.logs = [];
      // for (i = 0; i<10000; i++) {
      //   sessionData.logs.push({
      //     "categories": [],
      //     "level": "INFO ",
      //     "message": ">>> LogManager initialized successfully. UTC time: Thu, 03 May 2018 13:03:56 GMT",
      //     "tag": "XLog.LogManager",
      //     "thread": 4,
      //     "timestamp": 1525363436287
      //   });
      // }
  
      sessionData.updatedAt = Date.now();
  
      socketApi.sendEventToRoom(sessionData.id, SOCKET_B_PUSH_LOGS, {
        logs: newLogs,
        total: sessionData.logs.length,
      });
      
    
      db.writeRecord(dbTables.SESSIONS, sessionData.id, sessionData, (error) => {
        if (error) {
          console.error(error);
        }
      });
    
      resolve('ok');
    });
  })
};

module.exports = { 
  getSessionLogs,
  pushLogsToSession,
};
