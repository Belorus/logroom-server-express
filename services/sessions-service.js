const db = require('../database/database-api');
const { dbTables } = require('../database/database-constants');
const { ACTIVE_SESSIONS_TIME_IN_MS } = require('../config');

function getSessions(type, filters = {}) {
  return new Promise((resolve, reject) => {
    let primaryFilter = null;
    const filterRangeTo = Date.now();
    const filterRangeFrom = filterRangeTo - ACTIVE_SESSIONS_TIME_IN_MS;
    const selectedFields = ['id', 'additional', 'markers', 'logsCount', 'createdAt', 'updatedAt'];
    if (type === 'active') {
      primaryFilter = {
        type: 'range',
        field: 'updatedAt',
        from: filterRangeFrom,
        to: filterRangeTo,
      };
    }
  
    // const additionalFilter = (session) => {
    //   return (filters.appName ? session.additional.app_name === filters.appName : true) &&
    //     (filters.appVersion ? session.additional.app_version === filters.appVersion : true);
    // };
  
    db.getListOfRecords(dbTables.SESSIONS, selectedFields, primaryFilter)
      .then((sessions) => {
        resolve({ sessions, serverTimestamp: Date.now() });
      })
      .catch((error) => {
        reject(error);
      });
  });
}

module.exports = {
  getSessions,
};
