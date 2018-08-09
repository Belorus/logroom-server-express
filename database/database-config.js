const { CLUSTER_IP, CLUSTER_PORT, NAMESPACE } = require('./database-constants');

const dbConfig = {
  hosts: [ { addr: CLUSTER_IP, port: CLUSTER_PORT } ],
};

const dbParams = {
  namespace: NAMESPACE,
};

module.exports = {
  dbConfig,
  dbParams,
};
