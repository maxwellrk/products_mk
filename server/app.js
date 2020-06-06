const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

const {
  getProductList,
  getIndividualProduct,
  getRelatedProducts,
  getProductStyles,
  serveTestingFile,
} = require('./controllers');

app.use(cors());

app.options('*', cors());

app.get('/products/list', getProductList);

app.get('/products/:product_id', getIndividualProduct);

app.get('/products/:product_id/related', getRelatedProducts);

app.get('/products/:product_id/styles', getProductStyles);

app.get('/loaderio-c7146d4b885c425035dc77e6d7ef83d9.txt', serveTestingFile);

app.listen(process.env.PORT || 43443, () => {
  console.log(
    `Example app listening at http://localhost:${process.env.PORT || 43443}`
  );
});

module.exports = app;
