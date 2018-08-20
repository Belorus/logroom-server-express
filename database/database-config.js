const { DATABASE_HOST, DATABASE_PORT, DATABASE_NAMESPACE } = require('../config');

const dbConfig = {
  hosts: [ { addr: DATABASE_HOST,  port:+DATABASE_PORT }],
};

const dbParams = {
  namespace: DATABASE_NAMESPACE,
};

module.exports = {
  dbConfig,
  dbParams,
};
