const mariadb = require('mariadb');

const pool = mariadb.createPool({
  host: 'localhost',
  user: 'root',
  password: process.env.DBPASS,
  port: '3306',
  database: 'product_db',
});

module.exports = {
  getProductList: (req, res) => {
    const page = req.query.page || 1;

    const count = req.query.count || 5;

    pool.getConnection().then((conn) => {
      return conn
        .query(
          `SELECT product_id AS id, name, slogan, description, category, default_price From Product where product_id >= ${
            count * page - count + 1
          } and Product_id <= ${count * page};`
        )
        .then((info) => {
          res.send(info);
          conn.end();
        })
        .catch((err) => {
          console.log(err);
          res.sendStatus(500);
          conn.end();
        });
    });
  },

  getIndividualProduct: (req, res) => {
    pool.getConnection().then((conn) => {
      return conn
        .query(
          `SELECT product_id AS id, name, slogan, description, category, default_price From Product WHERE Product.product_id = ${req.params.product_id}`
        )
        .then((product) => {
          return conn
            .query(
              `SELECT Features.feature, Features.value FROM Product INNER JOIN Features ON Product.product_id = Features.product_id WHERE Product.product_id = ${req.params.product_id}`
            )
            .then((features) => {
              product[0].features = features;
              return product[0];
            });
        })
        .then((info) => {
          res.send(info);
          conn.end();
        })
        .catch((err) => {
          console.log('this is an error', err);
          res.sendStatus(404);
          conn.end();
        });
    });
  },

  getRelatedProducts: (req, res) => {
    pool.getConnection().then((conn) => {
      return conn
        .query(
          `SELECT related_id FROM Related_Products WHERE main_id = ${req.params.product_id}`
        )
        .then((info) => {
          res.send(info.map((ele) => ele.related_id));
          conn.end();
        })
        .catch((err) => {
          res.send([]);
          conn.end();
        });
    });
  },

  getProductStyles: (req, res) => {
    pool.getConnection().then((conn) => {
      return conn
        .query(
          `SELECT style_id, name, original_price, sale_price, default_status AS 'default?' FROM Styles WHERE Styles.product_id = ${req.params.product_id}`
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
                        ].photos = [
                          {
                            thumbnail_url: ele.url,
                            url: ele.thumbnail_url,
                          },
                        ])
                      : returnObj.results[
                          positionOfStyles[ele.style_id]
                        ].photos.push({
                          //somehow these got mixed up need to fix it
                          thumbnail_url: ele.url,
                          url: ele.thumbnail_url,
                        });
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

                  returnObj.results.forEach((ele) => {
                    if (ele.photos === undefined) {
                      ele.photos = [
                        {
                          thumbnail_url: null,
                          url: null,
                        },
                      ];
                    }

                    if (ele.skus === undefined) {
                      ele.skus = {
                        null: null,
                      };
                    }
                  });

                  return returnObj;
                });
            })
            .then((info) => {
              res.send(info);
              conn.end();
            });
        })
        .catch((err) => {
          console.log('error caught', err);
          res.send({ product_id: req.params.product_id, results: [] });
          conn.end();
        });
    });
  },
};
