const mariadb = require('mariadb');
const path = require('path');

const pool = mariadb.createPool({
  host: process.env.DBHOST,
  user: 'root',
  password: process.env.DBPASS,
  port: '3306',
  database: 'product_db',
  connectionLimit: 98,
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
    pool
      .getConnection()
      .then((conn) => {
        return conn
          .query(
            `select p.product_id, p.description, p.default_price,
          s.style_id, s.name, s.sale_price, s.original_price, s.default_status as 'default?',
          ph.thumb_url as url, ph.url as thumbnail_url, sk.size, sk.quantity 
          from Product p join Styles s on p.product_id = s.product_id 
          join Photos ph on ph.style_id = s.style_id
          join Skus sk on sk.style_id = s.style_id 
          where p.product_id = ${req.params.product_id};`
          )
          .then((results) => {
            let returnObj = {};
            let subObj = {};
            let usedPhotos = {};

            results.forEach((ele) => {
              if (subObj[ele.style_id] === undefined) {
                subObj[ele.style_id] = {
                  style_id: ele.style_id,
                  name: ele.name,
                  original_price: ele.original_price,
                  sale_price: ele.sale_price,
                  'default?': ele['default?'],
                  photos: [
                    { url: ele.url, thumbnail_url: ele.thumbnail_url },
                  ] || [
                    {
                      thumbnail_url: null,
                      url: null,
                    },
                  ],
                  skus: {
                    [ele.size]: ele.quantity,
                  } || {
                    [ele.skus]: {
                      null: null,
                    },
                  },
                };
                usedPhotos[ele.url + ele.style_id] = true;
                usedPhotos[ele.thumbnail_url + ele.style_id] = true;
              } else {
                if (
                  usedPhotos[ele.url + ele.style_id] !== true &&
                  usedPhotos[ele.thumbnail_url + ele.style_id] !== true
                ) {
                  subObj[ele.style_id].photos.push({
                    url: ele.url,
                    thumbnail_url: ele.thumbnail_url,
                  });
                  usedPhotos[ele.url + ele.style_id] = true;
                  usedPhotos[ele.thumbnail_url + ele.style_id] = true;
                }
                subObj[ele.style_id].skus[ele.size] = ele.quantity;
              }
            });
            returnObj.product_id = req.params.product_id;
            returnObj.results = Object.keys(subObj).map((ele) => subObj[ele]);
            res.send(returnObj);
            conn.end();
          });
      })
      .catch((err) => {
        console.log('error caught', err);
        res.send({ product_id: req.params.product_id, results: [] });
      });
  },
  serveTestingFile: (req, res) => {
    res.sendFile(
      path.join(__dirname, '../loaderio-d7fc4286634d168b5fc712d67970839e.txt')
    );
  },
};
