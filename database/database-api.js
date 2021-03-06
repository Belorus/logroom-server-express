const Aerospike = require('aerospike');
const { dbConfig, dbParams } = require('./database-config');
const { dbTables, BATCH_READ_RECORDS_LIMIT } = require('./database-constants');

const client = Aerospike.client(dbConfig);

function createIndex(table, field, type) {
  const options = {
    ns: dbParams.namespace,
    set: table,
    bin: field,
    index: `idx_${dbParams.namespace}_${table}_${field}`,
    datatype: type,
  };

  client.createIndex(options, (error, job) => {
    if (!error) {
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
        createIndex(dbTables.SESSIONS, 'updatedAt', Aerospike.indexDataType.NUMERIC);
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

function getListOfRecords(table, selectedFields, primaryFilter, additionalFilter) {
  return new Promise((resolve, reject) => {
    const records = [];
    const query = client.query(dbParams.namespace, table);

    if (primaryFilter) {
      switch (primaryFilter.type) {
        case 'equal' : {
          query.where(Aerospike.filter.equal(primaryFilter.field, primaryFilter.value));
          break;
        }
        case 'range' : {
          query.where(Aerospike.filter.range(primaryFilter.field, primaryFilter.from, primaryFilter.to));
          break;
        }
        default: break;
      }
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
      resolve(additionalFilter ? records.filter(additionalFilter) : records);
    });
  });
};

async function batchReadRecords(readKeys) {
  const readedRecords = [];
  const readOperationsCount = Math.ceil(readKeys.length / BATCH_READ_RECORDS_LIMIT);
  for (let i = 0; i < readOperationsCount; i++) {
    const startIndex = i * BATCH_READ_RECORDS_LIMIT;
    const endIndex = startIndex + BATCH_READ_RECORDS_LIMIT;
    const operationKeys = readKeys.slice(startIndex, endIndex)
    await client.batchRead(operationKeys)
      .then((records) => {
        readedRecords.push(...records.map((r) => r.record.bins));
      })
      .catch((error) => {
        throw new Error(error); 
      });
  };
  return readedRecords;
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
