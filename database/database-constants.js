//tables (sets)
const SESSIONS = 'sessions';
const LOGS = 'logs';

//limits 
const BATCH_READ_RECORDS_LIMIT = 5000;

module.exports = {
  dbTables: {
    SESSIONS,
    LOGS,
  },
  BATCH_READ_RECORDS_LIMIT,
};
