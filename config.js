const APP_HOST = process.env.APP_HOST || 'http://10.61.40.154';
const APP_PORT = process.env.APP_PORT || 4000;

const DATABASE_HOST = process.env.AEROSPIKE_HOST || '172.28.128.3';
const DATABASE_PORT = process.env.AEROSPIKE_PORT || 3000;
const DATABASE_NAMESPACE = process.env.AEROSPIKE_NAMESPACE || 'test';

const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = process.env.REDIS_PORT || 6379;

const DB_CONNECTION_DELAY_IN_MS = process.env.DB_CONNECTION_DELAY || 3000;

module.exports = {
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_NAMESPACE,
  REDIS_HOST,
  REDIS_PORT,
  APP_HOST,
  APP_PORT,
  DB_CONNECTION_DELAY_IN_MS,
};
