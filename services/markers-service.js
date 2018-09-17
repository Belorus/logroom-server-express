const uniqid = require('uniqid');

const db = require('../database/database-api');
const { dbTables } = require('../database/database-constants');

function getSessionMarkers(sessionId, marker) {
  return new Promise((resolve, reject) => {
    db.getRecord(dbTables.SESSIONS, sessionId)
      .then((session) => {
        if (session) {
          resolve(session.markers);
        } else {
          reject('Session not found');
        }
      })
      .catch((error) => {
        return reject(error);
      });
  })
};

function addSessionMarker(sessionId, marker) {
  return new Promise((resolve, reject) => {
    db.getRecord(dbTables.SESSIONS, sessionId)
      .then((session) => {
        if (session) {
          const newMarker = {
            ...marker,
            id: uniqid(),
          };
  
          session.markers.push(newMarker);

          db.writeRecord(dbTables.SESSIONS, sessionId, session)
            .then(() => {
              resolve(newMarker);
            })
            .catch((error) => {
              reject(error);
            });
        } else {
          reject('Session not found');
        }
      })
      .catch((error) => {
        return reject(error);
      });
  })
};

function deleteSessionMarker(sessionId, markerId) {
  return new Promise((resolve, reject) => {
    db.getRecord(dbTables.SESSIONS, sessionId)
      .then((session) => {
        if (session) {
          const markerIndex = session.markers.findIndex((m) => m.id === markerId);
          
          if (markerIndex > -1) {
            session.markers.splice(markerIndex, 1);
          } else {
            reject('Marker not found');
            return;
          }

          db.writeRecord(dbTables.SESSIONS, sessionId, session)
            .then(() => {
              resolve('ok');
            })
            .catch((error) => {
              reject(error);
            });
        } else {
          reject('Session not found');
        }
      })
      .catch((error) => {
        return reject(error);
      });
  })
};

module.exports = {
  deleteSessionMarker,
  addSessionMarker,
  getSessionMarkers,
};
