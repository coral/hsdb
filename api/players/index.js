'use strict';

var mongoose = require('mongoose');
var thunkify = require('thunkify');
var parse = require('co-body');
var deepPopulate = require('mongoose-deep-populate');
var fs = require('fs');
var _ = require('lodash');
var ObjectId = mongoose.SchemaTypes.ObjectId;

mongoose.connect('mongodb://localhost/hsdb');


var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error - Players:'));
db.once('open', function (callback) {
console.log('Players connected');
});



var playerSchema = mongoose.Schema({
    name: String,
    nick: String,
    decks: [{type: ObjectId, ref: 'Decks'}]
})
playerSchema.plugin(deepPopulate);
var Player = mongoose.model('Player', playerSchema);



exports.index = function *(){

	var players = yield Player.find().sort('nick').populate('decks').deepPopulate('decks.cards').exec();
	this.body = players;

};

exports.show = function *(){
  var player = yield Player.findById(this.params.player).populate({path: 'decks', options: { sort: { 'deckClass': 1 } } }).exec();
  this.body = player;
};

exports.create = function *(name){

	var body = yield parse(this);
	console.log(body);
	if (!body.name) this.throw(400, '.name required');
	//var data = JSON.parse(data);
	var player = new Player({
	 name: body.name,
	 nick: body.nick
	});

	player.save(function (err, resp) {
		if (err) return console.error(err);
	});
	this.body = "OK"
	this.status = 201;


};

exports.update = function *(decks){
	var body = yield parse(this);

	var update = yield Player.findByIdAndUpdate(this.params.player, { $push: {
		decks: body.decks

	}}).exec();
	this.status = 202;
	this.body = update;
};

exports.importer = function *(name){

    Player.collection.remove(function(){});

    fs.readFile(__dirname + '/players.json', function (err, data) {
        if (err) throw err;
        var players = JSON.parse(data);
        _.forEach(players, function(n, key) {
                var save = Player.create({
                    nick: n.nick,
                    name: n.name
                });
        });
    });

    this.body = "OK";
    this.status = 200;
};
