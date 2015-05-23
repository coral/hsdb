var fs = require('fs');
var data = require('./cards.json');

var filtered = data.filter(function (val) {
  return (val.collectible) ? true:false;
});

fs.writeFileSync("filtered.json", JSON.stringify(filtered, null, 4));
