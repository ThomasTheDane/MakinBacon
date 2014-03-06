var fs = require('fs');
var mongoose = require('mongoose');
var models = require('./models'),
    Actor = models.Actor,
    Movie = models.Movie;
var sem = require('semaphore')(1);


mongoose.connect('mongodb://localhost/bacon');
var prevActor='';
var prevMovie='';

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
        if (remaining.length>0){
            func(remaining);
        };
        sem.leave();
    });
}

function func(data) {
    console.log(data);
}

var movieList = [];
var actorList = [];

function storeLineActor (line) {
    var splitLine = line.split(',\t');
    var actorName = splitLine[0];
    var movieName = splitLine[1];
    storeActors(actorName, movieName);
};

function storeLineMovie (line) {
    var splitLine = line.split(',\t');
    var movieName = splitLine[0];
    var actorName = splitLine[1];
    storeMovies(actorName, movieName);        
};

function storeActors (actorName, movieName){
    if (prevActor && prevActor != actorName){
        var actor = new Actor({name:prevActor, movies:movieList});
        movieList = [];
        actor.save(function(err){
            if (err) {
                return console.log(err);
            };
        });
    };
    prevActor = actorName;

    if (movieList.indexOf(movieName)==-1){
        movieList.push(movieName)
    };
};

function storeMovies (actorName, movieName){
    if (prevMovie && prevMovie != movieName){
        var movie = new Movie({name:prevMovie, actors:actorList});
        actorList = [];
        movie.save(function(err){
            if (err) {
                return console.log(err);
            };
        });
    };
    prevMovie = movieName;

    if (actorList.indexOf(actorName)==-1){
        actorList.push(actorName)
    };
};

sem.take(function(){
    var actorInput = fs.createReadStream('actresses.txt');
    readLines(actorInput, storeLineActor);
});

sem.take(function(){
    var movieInput = fs.createReadStream('actressmovies.txt');
    readLines(movieInput, storeLineMovie);
});
