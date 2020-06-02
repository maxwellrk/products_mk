const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const CSV = require('csv-string');

csvCleaner = (csvName) => {
  const readStream = fs.createReadStream(
    path.resolve(__dirname, 'unformatted', `${csvName}.csv`)
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
        cleanData[key] = data[key] === 'null' ? '0' : data[key];
      } else if (csvName === 'features') {
        if (key === 'value') {
          cleanData[key] = data[key].replace(/([a-z])([A-Z])/g, '$1 $2');
        } else {
          cleanData[key] = data[key];
        }
      } else if (csvName === 'related') {
        if (key !== 'id') {
          cleanData[key] = data[key];
        }
      } else if (csvName === 'photos') {
        if (Object.keys(data).length > 4) {
          let tempObj = {};
          for (let subKey in data) {
            if (subKey >= 0 && subKey <= 2) {
              tempObj[subKey] = data[subKey].replace(/['"]+/g, '');
            }
            if (Number(subKey) >= 3) {
              tempObj[3] = data[subKey].split('\n')[0].replace(/['"]+/g, '');
              if (tempObj !== undefined)
                writeStream.write(CSV.stringify(tempObj));
              tempObj = {};
              if (data[subKey].split('\n').length > 1) {
                tempObj[0] = data[subKey]
                  .split('\n')[1]
                  .split(',')[0]
                  .replace(/['"]+/g, '');
                tempObj[1] = data[subKey]
                  .split('\n')[1]
                  .split(',')[1]
                  .replace(/['"]+/g, '');
                tempObj[2] = data[subKey]
                  .split('\n')[1]
                  .split(',')[2]
                  .replace(/['"]+/g, '');
              }
            }
          }
          break;
        } else {
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
csvCleaner('photos');
// csvCleaner('related');
// csvCleaner('skus');
