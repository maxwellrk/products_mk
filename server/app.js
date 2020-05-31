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

app.get('/products/:product_id/related', (req, res) => {
  pool
    .getConnection()
    .then((conn) => {
      return conn.query(
        `SELECT related_id FROM Related_Products WHERE main_id = ${req.params.product_id}`
      );
    })
    .then((info) => {
      res.send(info.map((ele) => ele.related_id));
    })
    .catch((err) => {
      res.send(500);
    });
});

app.get('/products/:product_id/styles', (req, res) => {
  pool
    .getConnection()
    .then((conn) => {
      return conn
        .query(
          `SELECT style_id, name, sale_price, original_price, default_status AS 'default?' FROM Styles WHERE Styles.product_id = ${req.params.product_id}`
        )
        .then((info) => {
          let queryParams = '';
          const positionOfStyles = {};
          info.forEach((ele, index) => {
            positionOfStyles[ele.style_id] = index;
            index === 0
              ? (queryParams += `p.style_id = ${ele.style_id}`)
              : (queryParams += ` or p.style_id = ${ele.style_id}`);
          });

          return conn
            .query(
              `SELECT style_id, thumb_url as thumbnail_url, url FROM Photos p WHERE ${queryParams}`
            )
            .then((photos) => {
              return conn
                .query(
                  `SELECT style_id, size, quantity FROM Skus p WHERE ${queryParams}`
                )
                .then((skus) => {
                  const returnObj = {};

                  returnObj.product_id = req.params.product_id;

                  returnObj.results = info;

                  photos.forEach((ele) => {
                    returnObj.results[positionOfStyles[ele.style_id]].photos ===
                    undefined
                      ? (returnObj.results[
                          positionOfStyles[ele.style_id]
                        ].photos = [ele])
                      : returnObj.results[
                          positionOfStyles[ele.style_id]
                        ].photos.push(ele);
                  });

                  skus.forEach((ele) => {
                    returnObj.results[positionOfStyles[ele.style_id]].skus ===
                    undefined
                      ? (returnObj.results[
                          positionOfStyles[ele.style_id]
                        ].skus = { [ele.size]: ele.quantity })
                      : (returnObj.results[positionOfStyles[ele.style_id]].skus[
                          ele.size
                        ] = ele.quantity);
                  });
                  return returnObj;
                });
            });
        });
    })

    .then((info) => res.send(info))
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
});

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
