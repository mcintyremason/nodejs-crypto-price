const util= require('util');
const fs = require('fs');
global.fetch = require('node-fetch')
const cc = require('cryptocompare')

var argv = (process.argv[2] != null ? process.argv[2] : 'data.json');
var jsonObj = JSON.parse(fs.readFileSync(argv));
var cryptoNamesArr = [];

for(const key of Object.keys(jsonObj.currencies)){
  cryptoNamesArr.push(jsonObj.currencies[key].name);
}

cc.priceMulti(cryptoNamesArr, 'USD')
  .then(prices => {
    for(const key of Object.keys(prices)){
      jsonObj.currencies[key].price = prices[key].USD;
      jsonObj.currencies[key].total = jsonObj.currencies[key].holdings * prices[key].USD;
      jsonObj.total += jsonObj.currencies[key].total;
    }
  }
).then(() => {
  util.log(jsonObj);
  fs.writeFile("./totals.json", JSON.stringify(jsonObj), function(err) {
    if(err) {
        return console.log(err);
    }
  });
})
.catch(console.error);;