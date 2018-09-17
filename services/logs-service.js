const fs = require('fs');
const db = require('../database/database-api');
const dateUtils = require('../utils/date-utils');
const stringUtils = require('../utils/string-utils');
const { dbTables } = require('../database/database-constants');
const { SOCKET_B_PUSH_LOGS, SOCKET_B_NEW_ACTIVE_SESSION, SOCKET_B_ACTIVE_SESSION_UPDATED } = require('../socket/socket-events');
const { APP_HOST, APP_PORT } = require('../config');

const HOST_ADDRESS = `${APP_HOST}:${APP_PORT}`;

function getSessionLogs(sessionId, limit, startFrom, levels) {
  return new Promise((resolve, reject) => {
    db.getRecord(dbTables.SESSIONS, sessionId)
      .then((session) => {
        if (session) {
          const keys = [];
          const startLog = startFrom && startFrom <= session.logsCount ? startFrom : session.logsCount;
          const logsLimit = limit && startLog > limit ? startLog - limit : 0;
          for (let i = startLog; i >= logsLimit + 1; i--) {
            keys.push(db.generateKeyForBatchRead(dbTables.LOGS, `${session.id}_${i}`));
          };
          db.batchReadRecords(keys).then((logs) => {
            if (levels) {
              resolve(logs.filter((log) => levels.includes(log.level)));
            } else {
              resolve(logs);
            }
          }, reject);
        } else {
          reject('Session not found');
        }
      })
      .catch((error) => {
        return reject(error);
      });
  });
};

function getSessionLogsFileLink(sessionId) {
  return new Promise((resolve, reject) => {
    getSessionLogs(sessionId)
      .then((logs) => {
        const fileName = `${sessionId}_${logs.length}_logs.txt`;
        const filePath = `public/files/${fileName}`;
        let logsString = `Session ID: ${sessionId}; Logs count: ${logs.length}\n\n`;
        logs.forEach((log) => {
          logsString += `${dateUtils.formatTimestamp(log.timestamp)}|${stringUtils.adjustString(log.level, 5)}|${log.thread}|${log.tag}|${log.categories.join(',') ||  '—'}|${log.message}\n`
        });
        fs.writeFile(filePath, logsString, (err) => {
          if (err)  {
            reject(err);
          } else {
            resolve(`${HOST_ADDRESS}/files/${fileName}`);
          }
        });
      })
      .catch((error) => {
        reject(error);
      })
  });
};

function pushLogsToSessionAndUpdateInfo(newSessionInfo) {
  return new Promise((resolve, reject) => {
    db.getRecord(dbTables.SESSIONS, newSessionInfo.id)
      .then((oldSession) => {
        const events = [];
        const updatedSession= oldSession || { id: newSessionInfo.id, markers: [], additional: {}, logsCount: 0 };

        if (oldSession) {
          if (newSessionInfo.seqNumber <= oldSession.seqNumber) {
            return reject('Bad sequence number');
          }
        } 
      
        newSessionInfo.logs.forEach((log, index) => {
          log.seqNumber = updatedSession.logsCount + index + 1;
          log.level = log.level.trim();
          db.writeRecord(dbTables.LOGS, `${updatedSession.id}_${log.seqNumber}`, log);
        });

        updatedSession.seqNumber = newSessionInfo.seqNumber;
        updatedSession.additional =  { ...updatedSession.additional, ...newSessionInfo.additional };
        updatedSession.logsCount = updatedSession.logsCount + newSessionInfo.logs.length;
        updatedSession.updatedAt = Date.now();

        db.writeRecord(dbTables.SESSIONS, updatedSession.id, updatedSession)
          .catch((error) => {
            console.error(error);
          });

        if (!oldSession) {
          events.push({
            roomId: 'all',
            type: SOCKET_B_NEW_ACTIVE_SESSION,
            payload: updatedSession,
          });
        } else if (newSessionInfo.additional) {
          events.push({
            roomId: 'all',
            type: SOCKET_B_ACTIVE_SESSION_UPDATED,
            payload: updatedSession,
          });
        }

        events.push({
          roomId: newSessionInfo.id,
          type: SOCKET_B_PUSH_LOGS,
          payload: {
            logs: newSessionInfo.logs.reverse(),
            total: updatedSession.logsCount,
          }
        });

        resolve(events);
      })
      .catch((error) => {
        reject(error);
      });
  })
};

module.exports = {
  getSessionLogs,
  getSessionLogsFileLink,
  pushLogsToSessionAndUpdateInfo,
};
