const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const CSV = require('csv-string');

csvCleaner = (csvName, fileName) => {
  const readStream = fs.createReadStream(
    path.resolve(__dirname, '../data/unformatted', `${csvName}.csv`)
  );

  const writeStream = fs.createWriteStream(
    path.resolve(__dirname, 'formatted', `${csvName}.csv`)
  );

  //   const csvStream = csv
  //     .parse()
  //     .on('data', (data) => {
  //       writeStream.write();
  //     })
  //     .on('error', (err) => console.log(err))
  //     .on('end', (end) => console.log('thisisend', end));

  readStream.pipe(csv()).on('data', (data) => {
    let cleanData = {};

    for (let key in data) {
      cleanData[key] =
        key === 'default_price'
          ? data[key].replace(/\D+/g, '')
          : data[key].trim();
    }

    writeStream.write(CSV.stringify(cleanData));
  });
};

csvCleaner('product');
csvCleaner('features');
csvCleaner('photos');
csvCleaner('related');
csvCleaner('skus');
