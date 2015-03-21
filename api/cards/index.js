'use strict';

var mongoose = require('mongoose');
var thunkify = require('thunkify');
var parse = require('co-body');
var _ = require('lodash');
var fs = require('fs');

mongoose.connect('mongodb://localhost/hsdb');

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {

});



var cardSchema = mongoose.Schema({
    id: String,
    hsid: String,
    name: String,
    image: String,
    type: String,
    rarity: String,
    cost: String,
    attack: String,
    flavor: String,
    faction: String,
    playerClass: String,
    elite: String
})

var Cards = mongoose.model('Cards', cardSchema);


exports.index = function *(){

    var cards = yield Cards.find().sort('hsid').exec();
    this.body = cards;

};


exports.show = function *(){
    var card = yield Cards.findById(this.params.card).exec();
    this.body = card;
};

exports.search = function *(){
    var regex = new RegExp(this.params.q, 'i');
    var card = yield Cards.find({name: regex}).exec();
    this.body = card;
};

exports.create = function *(name){

    var body = yield parse(this);
    if (!body.cardClass) this.throw(400, '.name required');

    var save = yield Cards.create({
     cardClass: body.cardClass,
    });

    this.body = save;
    this.status = 201;


};

exports.importer = function *(name){

    Cards.collection.remove(function(){});

    fs.readFile(__dirname + '/cards.json', function (err, data) {
        if (err) throw err;
        var cardset = JSON.parse(data);
        var seen = [];
        _.forEach(cardset, function(n, key) {
            if (_.indexOf(seen, n.id) == -1) {
                seen.push(n.id);
                var save = Cards.create({
                    id: n.id,
                    name: n.name,
                    image: n.image,
                    type: n.type || "",
                    rarity: n.rarity || "",
                    cost: n.cost || "",
                    attack: n.attack || "",
                    flavor: n.flavor || "",
                    faction: n.faction || "",
                    playerClass: n.playerClass || "",
                    elite: n.elite || ""
                });
            }
        });
    });

    this.body = "OK";
    this.status = 201;
};


exports.update = function *(Cards){
    var body = yield parse(this);

    var update = yield Cards.findByIdAndUpdate(this.params.card, { $set: {
        cards: body.cards

    }}).exec();
    this.status = 202;
    this.body = update;
};
