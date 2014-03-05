var express = require('express');
var app = express();
var server = require('http').createServer(app);
var port = process.env.PORT || 3000;
server.listen(port);

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/bacon');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function callback () {
	
});

app.get('/', function (req, res){
	
	res.send('dickbutt');
});
