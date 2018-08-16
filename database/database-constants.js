//base config
const CLUSTER_IP = process.env.AEROSPIKE_IP || '172.28.128.3';
const CLUSTER_PORT = process.env.AEROSPIKE_PORT || 3000;
const NAMESPACE = process.env.AEROSPIKE_NAMESPACE || 'test';

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
  CLUSTER_IP,
  CLUSTER_PORT,
  NAMESPACE,
};
