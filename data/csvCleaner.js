const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const CSV = require('csv-string');

csvCleaner = (csvName) => {
  const readStream = fs.createReadStream(
    path.resolve(__dirname, '../data/unformatted', `${csvName}.csv`)
  );

  const writeStream = fs.createWriteStream(
    path.resolve(__dirname, 'formatted', `${csvName}.csv`)
  );

  readStream.pipe(csv()).on('data', (data) => {
    let cleanData = {};

    for (let key in data) {
      if (csvName === 'product') {
        cleanData[key] =
          key === 'default_price'
            ? data[key].replace(/\D+/g, '')
            : data[key].trim();
      } else if (csvName === 'styles') {
        cleanData[key] = data[key] === 'null' ? 'NULL' : data[key];
      } else if (csvName === 'features') {
        if (key === 'value') {
          cleanData[key] =
            data[key] === 'null'
              ? 'NULL'
              : data[key].replace(/([a-z])([A-Z])/g, '$1 $2');
        } else {
          cleanData[key] = data[key];
        }
      } else if (csvName === 'related') {
        if (key !== 'id') {
          cleanData[key] = data[key];
        }
      } else {
        cleanData[key] = data[key];
      }
    }

    writeStream.write(CSV.stringify(cleanData));
  });
};

// csvCleaner('product');
// csvCleaner('styles');
// csvCleaner('features');
// csvCleaner('photos');
// csvCleaner('related');
csvCleaner('skus');
