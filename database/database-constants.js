//base config
const CLUSTER_IP = process.env.AEROSPIKE_IP || '172.28.128.3';
const CLUSTER_PORT = process.env.AEROSPIKE_PORT || 3000;
const NAMESPACE = process.env.AEROSPIKE_NAMESPACE || 'test';

//tables (sets)
const SESSIONS = 'sessions';
const LOGS = 'logs';

module.exports = {
  dbTables: {
    SESSIONS,
    LOGS,
  },
  CLUSTER_IP,
  CLUSTER_PORT,
  NAMESPACE,
};
