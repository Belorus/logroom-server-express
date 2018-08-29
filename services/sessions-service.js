const db = require('../database/database-api');
const { dbTables } = require('../database/database-constants');
const { ACTIVE_SESSIONS_TIME_IN_MS } = require('../config');

function getSessions(type, additionalFilters) {
  return new Promise((resolve, reject) => {
    const filters = []
    const filterRangeTo = Date.now();
    const filterRangeFrom = filterRangeTo - ACTIVE_SESSIONS_TIME_IN_MS;
    const selectedFields = ['id', 'additional', 'logsCount', 'updatedAt'];
    if (type === 'active') {
      filters.push({
        type: 'range',
        field: 'updatedAt',
        from: filterRangeFrom,
        to: filterRangeTo,
      });
    }
    db.getListOfRecords(dbTables.SESSIONS, selectedFields, filters)
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
