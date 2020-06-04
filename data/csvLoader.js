const path = require('path');
const mariadb = require('mariadb');
require('dotenv').config();

const loadCsv = (query) => {
  return mariadb
    .createConnection({
      host: 'localhost',
      user: 'root',
      password: process.env.DBPASS,
      database: 'product_db',
      port: 3306,
      permitLocalInfile: true,
    })
    .then((conn) => {
      console.log('running', query);
      return conn.query(query).then((query) => {
        console.log(query);
        conn.end();
      });
    })
    .catch((err) => {
      console.log('this is the error', err);
    });
};

const locationOfCsv = (productName) => {
  return path.resolve(__dirname, '../data/formatted', `${productName}.csv`);
};

let massLoad = () => {
  loadCsv(
    `LOAD DATA LOCAL INFILE '${locationOfCsv(
      'product'
    )}' INTO TABLE Product FIELDS TERMINATED BY ',' ENCLOSED BY '"' LINES TERMINATED BY '\r\n'`
  )
    .then(() => {
      return loadCsv(
        `LOAD DATA LOCAL INFILE '${locationOfCsv(
          'styles'
        )}' INTO TABLE Styles FIELDS TERMINATED BY ',' ENCLOSED BY '"' LINES TERMINATED BY '\r\n'`
      );
    })
    .then(() => {
      return loadCsv(
        `LOAD DATA LOCAL INFILE '${locationOfCsv(
          'skus'
        )}' INTO TABLE Skus FIELDS TERMINATED BY ',' ENCLOSED BY '"' LINES TERMINATED BY '\r\n'`
      );
    })
    .then(() => {
      return loadCsv(
        `LOAD DATA LOCAL INFILE '${locationOfCsv(
          'features'
        )}' INTO TABLE Features FIELDS TERMINATED BY ',' ENCLOSED BY '"' LINES TERMINATED BY '\r\n'`
      );
    })
    .then(() => {
      return loadCsv(
        `LOAD DATA LOCAL INFILE '${locationOfCsv(
          'related'
        )}' INTO TABLE Related_Products FIELDS TERMINATED BY ',' ENCLOSED BY '"' LINES TERMINATED BY '\r\n'`
      );
    })
    .then(() => {
      return loadCsv(
        `LOAD DATA LOCAL INFILE '${locationOfCsv(
          'photos_1'
        )}' INTO TABLE Photos FIELDS TERMINATED BY ',' ENCLOSED BY '"' LINES TERMINATED BY '\r\n'`
      );
    })
    .then(() => {
      return loadCsv(
        `LOAD DATA LOCAL INFILE '${locationOfCsv(
          'photos_2'
        )}' INTO TABLE Photos FIELDS TERMINATED BY ',' ENCLOSED BY '"' LINES TERMINATED BY '\r\n'`
      );
    })
    .then(() => {
      return loadCsv(
        `LOAD DATA LOCAL INFILE '${locationOfCsv(
          'photos_3'
        )}' INTO TABLE Photos FIELDS TERMINATED BY ',' ENCLOSED BY '"' LINES TERMINATED BY '\r\n'`
      );
    })
    .then(() => {
      return loadCsv(
        `LOAD DATA LOCAL INFILE '${locationOfCsv(
          'photos_4'
        )}' INTO TABLE Photos FIELDS TERMINATED BY ',' ENCLOSED BY '"' LINES TERMINATED BY '\r\n'`
      );
    })
    .then(() => {
      return loadCsv(
        `LOAD DATA LOCAL INFILE '${locationOfCsv(
          'photos_5'
        )}' INTO TABLE Photos FIELDS TERMINATED BY ',' ENCLOSED BY '"' LINES TERMINATED BY '\r\n'`
      );
    })
    .then(() => {
      return loadCsv(
        `LOAD DATA LOCAL INFILE '${locationOfCsv(
          'photos_6'
        )}' INTO TABLE Photos FIELDS TERMINATED BY ',' ENCLOSED BY '"' LINES TERMINATED BY '\r\n'`
      );
    })
    .catch((err) => console.log(err));
};

massLoad();
