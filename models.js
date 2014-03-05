var mongoose = require('mongoose');

var ActorSchema = mongoose.Schema({
    name: String,
    movies: [String]
});

var MovieSchema = mongoose.Schema({
	name: String,
	actors: [String]
});

var Actor = mongoose.model('Actor', ActorSchema);
var Movie = mongoose.model('Movie', MovieSchema);
exports.Actor = Actor;
exports.Movie = Movie;