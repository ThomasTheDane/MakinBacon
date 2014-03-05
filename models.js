var mongoose = require('mongoose');

var ActorSchema = mongoose.Schema({
    name: String,
    movies: [String]
});

var MovieSchema = mongoose.Schema({
	name: String,
	actors: [String]
});