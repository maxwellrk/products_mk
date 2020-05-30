const express = require('express');
const app = express();
const mariadb = require('mariadb');
const port = process.env.PORT || 3000;

const pool = mariadb.createPool({
  host: 'localhost',
  user: 'root',
  password: 'examplepass',
  database: 'product_db',
});

app.get('/', (req, res) => res.send('Hello World!'));

app.get('/products/list', (req, res) => {
  const page = req.query.page || 1;

  const count = req.query.count || 5;

  pool
    .getConnection()
    .then((conn) => {
      return conn.query(
        `select * from Product where product_id >= ${
          count * page - count + 1
        } and Product_id <= ${count * page};`
      );
    })
    .then((info) => {
      res.send(info);
    })
    .catch((err) => {
      res.sendStatus(500);
    });
});

// `product_id` INT NOT NULL AUTO_INCREMENT,
//   `name` VARCHAR(100) NULL DEFAULT NULL,
//   `slogan` VARCHAR(400) NULL DEFAULT NULL,
//   `description` VARCHAR(600) NULL DEFAULT NULL,
//   `category` VARCHAR(50) NULL DEFAULT NULL,
//   `default_price` INT NULL DEFAULT NULL,

app.get('/products/:product_id', (req, res) => {
  pool
    .getConnection()
    .then((conn) => {
      return conn
        .query(
          `SELECT * From Product WHERE Product.product_id = ${req.params.product_id}`
        )
        .then((product) => {
          return conn
            .query(
              `SELECT Features.feature, Features.value FROM Product INNER JOIN Features ON Product.product_id = Features.product_id WHERE Product.product_id = ${req.params.product_id}`
            )
            .then((features) => {
              product[0].features = features;
              return product;
            });
        });
    })
    .then((info) => res.send(info))
    .catch((err) => {
      res.sendStatus(500);
    });
});

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
