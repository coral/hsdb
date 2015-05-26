'use strict';

var mongoose = require('mongoose');
var thunkify = require('thunkify');
var parse = require('co-body');
var ObjectId = mongoose.SchemaTypes.ObjectId;

mongoose.connect('mongodb://10.0.1.2/hsdb');

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error - decks:'));
db.once('open', function (callback) {
  console.log("Decks connected");
});



var deckSchema = mongoose.Schema({
    deckClass: String,
    cards: [{type: ObjectId, ref: 'Cards'}]
})

var Decks = mongoose.model('Decks', deckSchema);


exports.index = function *(){

	var decks = yield Decks.find().sort('deckClass').populate('cards').exec();
	this.body = decks;

};


exports.show = function *(){
  var deck = yield Decks.findById(this.params.deck).populate('cards').exec();
  this.body = deck;
};


exports.showAsText = function *(){
  var deck = yield Decks.findById(this.params.deck).populate('cards').exec();


 var b = ""



    deck.cards.forEach(function (o) {

        b +=o.name + "\n"

    } );

    this.body = b;

};

exports.create = function *(name){

	var body = yield parse(this);
	if (!body.deckClass) this.throw(400, '.name required');

	var save = yield Decks.create({
	 deckClass: body.deckClass,
	});

	this.body = save;
	this.status = 201;


};

exports.update = function *(decks){
	var body = yield parse(this);

	var update = yield Decks.findByIdAndUpdate(this.params.deck, { $push: {
		cards: body.cards

	}}).exec();
	this.status = 202;
	this.body = update;
};

exports.deleteDeck = function *(decks){

};

exports.deleteCard = function *(decks){


	var update = yield Decks.findByIdAndUpdate(this.params.deck, { $pull: {
		cards: this.params.card

	}}).exec();

	this.status = 200;
	this.body = "OK";
};
