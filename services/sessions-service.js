const Aerospike = require('aerospike');
const db = require('../database/database-api');
const { dbTables } = require('../database/database-constants');

const ACTIVE_SESSIONS_TIME_IN_MS = 5 * 60 * 1000;

function getActiveSessions() {
  return new Promise((resolve, reject) => {
    const filterRangeTo = Date.now();
    const filterRangeFrom = filterRangeTo - ACTIVE_SESSIONS_TIME_IN_MS;
    const selectedFields = ['id', 'additional'];
    const filter = {
      type: 'range',
      field: 'updatedAt',
      from: filterRangeFrom,
      to: filterRangeTo,
    };
    db.getListOfRecords(dbTables.SESSIONS, selectedFields, filter)
      .then((activeSessions) => {
        resolve(activeSessions);
      }, (error) => {
        reject(error);
      });
  });
}

module.exports = {
  getActiveSessions,
};
