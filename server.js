var express = require('express');
var app = express();
var server = require('http').createServer(app);
var port = process.env.PORT || 3000;
server.listen(port);

var mongoose = require('mongoose');
var models = require('./models'),
    Actor = models.Actor,
    Movie = models.Movie;

mongoose.connect('mongodb://localhost/bacon');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

app.get('/actorName/:actorName', function (req, res){
	var actorName = req.params.actorName
 	Actor.findOne({name: actorName}).exec(function(err, actor){
	 	console.log(actor);
	 	console.log(actor.movies);

		// search it up
		function visit(frontier, fn) {
		 	var level = 0;
		    var levels = {};
	        while (0 < frontier.length) {
	            var next = [];
	            for (var i = 0; i < frontier.length; i++) {
	                var node = frontier[i];
	                fn(node);
	                levels[node] = level;
	                //make a call for actors of movies
	                nodeActors = [];
	                for(var movie in node.movies){
	                	Movie.findOne({name: movie}).exec(function(err, movie){
	                		nodeActors.push(movie);
	                	});
	                }
	                for (var adj in nodeActors) {
	                	if(adj.name == "Kevin Bacon"){
	                		return adj;
	                	}
	                    if (typeof levels[adj] === 'undefined') {
	                        next.push(adj);
	                    }
	                }
	            }
	            frontier = next;
	            level += 1;
	        }
	    }
 	    
 	    function bfs(node, fn) {
	    	visit([node], fn);
    	}
		
		var visited = [];
		if(actor){
		    bfs(actor, function (n) {
		    	console.log(n);
	        	visited.push(n);
			});
		}
    });
	res.send(actorName);
});
