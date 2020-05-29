const csv = require('fast-csv');
const path = require('path');
const fs = require('fs');
const mariadb = require('mariadb');

const streamBuilder = (csvName, query) => {
  // const locationOfCsv = path.resolve(
  //   __dirname,
  //   '../data/formatted',
  //   `${csvName}.csv`
  // );

  const readStream = fs.createReadStream(locationOfCsv);

  mariadb
    .createConnection({
      host: 'localhost',
      user: 'root',
      password: 'examplepass',
      database: 'product_db',
      port: 3306,
      permitLocalInfile: true,
    })
    .then((conn) => {
      // readStream
      //   .pipe(csv())
      //   .on('data', (data) => {
      //     conn.query(query, data);
      //   })
      //   .on('error', (err) => console.log(err))
      //   .on('end', (end) => console.log('thisisend', end));

      conn.query(query);
    });
};

const locationOfCsv = () => {
  path.resolve(__dirname, '../data/formatted', `product.csv`);
};

streamBuilder(
  null,
  `LOAD DATA LOCAL INFILE '${locationOfCsv}' INTO TABLE Product FIELDS TERMINATED BY ',' ENCLOSED BY '"' LINES TERMINATED BY '\r\n'`
);

// streamBuilder(
//   'product',
//   'INSERT INTO Product (product_id, name, slogan, description, category, default_price) VALUES (?, ?, ?, ?, ?, ?)'
// );
// streamBuilder(
//   'styles',
//   'INSERT INTO Styles (style_id, product_id, name, sale_price, original_price, default_status) VALUES (?, ?, ?, ?, ?, ?)'
// );
// streamBuilder(
//   'related',
//   'INSERT INTO Related_Products (null, main_id, related_id) VALUES (?, ?, ?)'
// );
// streamBuilder(
//   'features',
//   'INSERT INTO Features (id, product_id, feature, value) VALUES (?, ?, ?, ?)'
// );
// streamBuilder(
//   'skus',
//   'INSERT INTO Skus (skus_id, style_id, size, quantity) VALUES (?, ?, ?, ?)'
// );
// streamBuilder(
//   'photos',
//   'INSERT INTO Photos (photo_id, style_id, url, thumb_url) VALUES (?, ?, ?, ?)'
// );
