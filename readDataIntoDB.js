var fs = require('fs');
var mongoose = require('mongoose');
var models = require('./models'),
    Actor = models.Actor,
    Movie = models.Movie;
var sem = require('semaphore')(1);


mongoose.connect('mongodb://localhost/bacon');

function readLines(input, func) {
    var remaining = '';

    input.on('data', function(data) {
        remaining += data;
        var index = remaining.indexOf('\n');
        while (index > -1) {
            var line = remaining.substring(0, index);
            remaining = remaining.substring(index + 1);
            func(line);
            index = remaining.indexOf('\n');
    };
  });

    input.on('end', function() {
        if (remaining.length > 0) {
            func(remaining);
        };
    });
}

function func(data) {
    console.log(data);
}

function storeLine (line) {
    var splitLine = line.split(',\t');
    var actorName = splitLine[0];
    var movieName = splitLine[1];
    saveToDB(actorName, movieName);
    // console.log(actorName+'\n'+movieName)
};

function saveToDB (actorName, movieName) {
    // console.log('doing the thing');
    sem.take(function(){
        // console.log('lock')
        Actor.findOne({name: actorName}).exec(function(err, actor){
            console.log(actorName);
            if (err) {
                return console.log(err);
            };
            if (!actor){
                actor = new Actor({name: actorName, movies: []});
            };
            actor.movies.push(movieName);
            actor.save(function(err){
                if (err) {
                    return console.log(err);
                };
                Movie.findOne({name: movieName}).exec(function(err, movie){
                    if (err) {
                        return console.log(err);
                    };
                    if (!movie){
                        movie = new Movie({name: movieName, actors: []});
                    };
                    movie.actors.push(actorName);
                    movie.save(function(err){
                        if (err) {
                            return console.log(err);
                        };
                        console.log(actorName)    
                        sem.leave();
                    });
                });
            });
        });
    });
};

var input = fs.createReadStream('actresses.txt');
readLines(input, storeLine);

