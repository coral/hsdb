var striptags = require('striptags');
var fs = require('fs');
var http = require('http');

var readline = require('readline-sync');




var exec = require('child_process').exec;


var sets = require ('./AllSets.json');

var request = require('http-sync');
var cheerio = require('cheerio');

var Entities = require('html-entities').AllHtmlEntities;

var entities = new Entities();

var colors = require('colors');

var baseurl = "http://www.hearthpwn.com/cards?filter-name=";

var output = [];

for (var i in sets) {
  for (var j in sets[i]) {

    var found = false;

    var url = baseurl + sets[i][j].name;
    var image = "";


    var response = request.request({
    method: 'GET',

    protocol: 'http',
    host: 'www.hearthpwn.com',
    port: 80, //443 if protocol = https
    path: ('/cards?filter-name='+ sets[i][j].name).replace(" ", "%20")
  });

    var f = [];

    var $ = cheerio.load(response.end().body);

    var tr = $('table.listing').find('tbody > tr');

    if (tr.text() == 'No results were found.') {
      console.log ("No search results for " + sets[i][j].name);
      if (sets[i][j].type == "Enchantment") console.log(" ---- but is enchantment, so we don't care.");

    } else  {



      tr.each(function (index, elem) {
        var h3 = entities.decode($(elem).find('h3').text().trim());
        var p = entities.decode($(elem).find('p').text() || "");
        var flavor = $(elem).find('div.card-flavor-listing-text').text() || "";

        if (h3 != sets[i][j].name) return;
        //
        // if (sets[i][j].text) {
        //   console.log( " - " + p.trim())
        //   console.log( " + " + striptags(sets[i][j].text).replace("\n", ""));
        // }

        if (tr.length != 1 && sets[i][j].text && p.trim().indexOf(striptags(sets[i][j].text).trim().replace("\n", "")) < 0) return;
        if (tr.length != 1 && sets[i][j].flavor && flavor.trim().indexOf(striptags(sets[i][j].flavor).trim().replace("\n", "")) < 0) return;

        if (sets[i][j].type == "Enchantment") return;
        if (sets[i][j].type == "Hero") return;

        if (found) console.log (("Double match for " + sets[i][j].name).red);



        f.push(elem)

      });





    }

    if (f.length > 1) {
      console.log(sets[i][j]);

      for (var q in f) {
        console.log((parseInt(q)+1) + "=");
        console.log($(f[q]).find('.visual-details-cell').text());
      }

      var answer = readline.question("# or 0 for not at all ");
        var a = parseInt(answer);
        if (a == 0) {
          f = [];
        } else {
          f = [f[a-1]];
        }


    }

    if (f.length > 0) {

      found = true;

      image = $(f[0]).find('.hscard-static').attr('src');
      sets[i][j].image = sets[i][j].id + '.png';

    } else {
      sets[i][j].image = 'notfound.png';

    }

    if (found) {
      console.log (("Match for " + sets[i][j].name + " " + tr.length).green);

      console.log(image);

      var child = exec('wget -O img/' +sets[i][j].id + '.png' + ' ' + image);



    }

    if (!found) {
      console.log ("No match for " + sets[i][j].name + " " + tr.length);
      if (sets[i][j].type == "Enchantment") {
        console.log(" ---- but is ENCHANTMENT, so we don't care.".yellow);

      } else if (sets[i][j].type == "Hero") {
        console.log(" ---- but is HERO, so we don't care.".yellow);

      } else if (sets[i][j].type == "Hero") {
        console.log(" ---- but is HERO, so we don't care.".yellow);

      } else {
        console.log(" ---- WE DO CARE, CHECK MANUALY.".red);

      }
    }


    output.push(sets[i][j]);
    fs.writeFileSync("cards.json", JSON.stringify(output, null, 4)); 
  }


}
