const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 43443;
const path = require('path');
const {
  getProductList,
  getIndividualProduct,
  getRelatedProducts,
  getProductStyles,
} = require('./controllers');

app.use(cors());

app.options('*', cors());

app.get('/products/list', getProductList);

app.get('/products/:product_id', getIndividualProduct);

app.get('/products/:product_id/related', getRelatedProducts);

app.get('/products/:product_id/styles', getProductStyles);

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);

module.exports = app;
