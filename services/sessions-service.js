const db = require('../database/database-api');
const { dbTables } = require('../database/database-constants');
const { ACTIVE_SESSIONS_TIME_IN_MS } = require('../config');

function getSessions(type) {
  return new Promise((resolve, reject) => {
    const filterRangeTo = Date.now();
    const filterRangeFrom = filterRangeTo - ACTIVE_SESSIONS_TIME_IN_MS;
    const selectedFields = ['id', 'additional', 'logsCount', 'updatedAt'];
    let sessionsFilter = null; 
    if (type === 'active') {
      sessionsFilter = {
        type: 'range',
        field: 'updatedAt',
        from: filterRangeFrom,
        to: filterRangeTo,
      };
    }
    db.getListOfRecords(dbTables.SESSIONS, selectedFields, [sessionsFilter])
      .then((activeSessions) => {
        resolve(activeSessions);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

module.exports = {
  getSessions,
};
