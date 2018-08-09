const Aerospike = require('aerospike');
const { dbConfig, dbParams } = require('./database-config');
const { dbTables } = require('./database-constants');

const client = Aerospike.client(dbConfig);

function createIndex(table, field, type) {
  const options = {
    ns: dbParams.namespace,
    set: table,
    bin: field,
    index: `idx_${dbParams.namespace}_${table}_${field}`,
    datatype: type,
  };

  client.createIndex(options, function (error, job) {
    if (error) {
      console.error('Index creation error');
    } else {
      job.waitUntilDone(() => {
        console.log('Index was created successfully.');
      });
    }
  })
};

function connect() {
  return new Promise((resolve, reject) => {
    client.connect((error) => {
      if (error) {
        reject(error);
      } else {
        // createIndex(dbTables.SESSIONS, 'updatedAt', Aerospike.indexDataType.NUMERIC);
        resolve();
      }
    });
  })
};

function writeRecord(table, key, value) {
  return new Promise((resolve, reject) => {
    const dbKey = new Aerospike.Key(dbParams.namespace, table, key);
    client.put(dbKey, value, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

function getRecord(table, key) {
  return new Promise((resolve, reject) => {
    const dbKey = new Aerospike.Key(dbParams.namespace, table, key);
    client.get(dbKey, (error, record) => {
      if (error) {
        switch (error.code) {
          case Aerospike.status.AEROSPIKE_ERR_RECORD_NOT_FOUND:
            return resolve(null);
          default:
            return reject(error);
        }
      } else {
        resolve(record.bins);
      }
    });
  });
};

function getListOfRecords(table, selectedFields, filter) {
  return new Promise((resolve, reject) => {
    const records = [];
    const query = client.query(dbParams.namespace, table);

    if (filter) {
      query.where(Aerospike.filter[filter.type](filter.field, filter.from, filter.to));
    }

    if (selectedFields) {
      query.select(selectedFields);
    }

    const stream = query.foreach();
  
    stream.on('data', (record) => {
      records.push(record.bins);
    });
  
    stream.on('error', (error) => {
      reject(error);
    });
  
    stream.on('end', () => {
      resolve(records);
    });
  });
};

function batchReadRecords(readKeys) {
  return new Promise((resolve, reject) => {
    client.batchRead(readKeys, (error, records) => {
      if (error) {
        reject(error);
      } else {
        resolve(records.map((r) => r.record.bins));
      }
    });
  });
};

function generateKeyForBatchRead(table, key) {
  return { key: new Aerospike.Key(dbParams.namespace, table, key), read_all_bins: true };
}

module.exports = {
  connect,
  getListOfRecords,
  getRecord,
  writeRecord,
  batchReadRecords,
  generateKeyForBatchRead,
}
