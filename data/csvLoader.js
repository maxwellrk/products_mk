const csv = require('fast-csv');
const path = require('path');
const fs = require('fs');
const mariadb = require('mariadb');

const streamBuilder = (csvName, query) => {
  const stream = fs.createReadStream(
    path.resolve(__dirname, '../data/unformatted', `${csvName}.csv`)
  );

  csvData = [];

  const csvStream = csv
    .parse()
    .on('data', (data) => {
      csvData.push(data);
    })
    .on('error', (err) => console.log(err))
    .on('end', (end) => csvData.shift());

  const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: 'examplepass',
    database: 'product_db',
    port: 3306,
  });

  pool
    .getConnection()
    .then((conn) => {
      console.log(csvData);
      return conn.batch(query, [csvData]);
    })
    .then((resp) => console.log(resp))
    .catch((err) => {
      console.log('pool connection error', err);
    });

  stream.pipe(csvStream);
};

streamBuilder(
  'test',
  'INSERT INTO Product (product_id, name, slogan, description, category, default_price) VALUES (?, ?, ?, ?, ?, ?)'
);
