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

function connect(callback) {
  client.connect(() => {
    // createIndex(dbTables.SESSIONS, 'updatedAt', Aerospike.indexDataType.NUMERIC);
    callback();
  });
};

function writeRecord(table, key, value, callback = () => {}) {
  const dbKey = new Aerospike.Key(dbParams.namespace, table, key);
  client.put(dbKey, value, (error) => {
    if (error) {
      return callback(error);
    }
    return callback(null, 'ok');
  })
};

function getRecord(table, key, callback) {
  const dbKey = new Aerospike.Key(dbParams.namespace, table, key);
  client.get(dbKey, (error, record) => {
    if (error) {
      switch (error.code) {
        case Aerospike.status.AEROSPIKE_ERR_RECORD_NOT_FOUND:
          return callback(null, null);
        default:
          return callback(error);
      }
    }
    return callback(null, record.bins);
  });
};

function getListOfRecords(table, selectedFields, filter) {
  return new Promise((resolve, reject) => {
    const records = [];
    const query = client.query(dbParams.namespace, table);

    query.where(Aerospike.filter[filter.type](filter.field, filter.from, filter.to));
    query.select(selectedFields);

    const stream = query.foreach();
  
    stream.on('data', function (record) {
      records.push(record.bins);
    });
  
    stream.on('error', function (error) {
      reject(error);
    });
  
    stream.on('end', function () {
      resolve(records);
    });
  });
};

module.exports = {
  connect,
  getListOfRecords,
  getRecord,
  writeRecord,
}
