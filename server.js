var express = require('express');
var server = express();
var http = require('http').Server(server);
var io = require('socket.io')(http);

const path = require('path');
const port = process.env.PORT || 3001;

server.use(express.static(path.resolve(__dirname, './build')));

server.get('*', function(req, res){
  res.sendFile(__dirname + '/build/');
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});

io.on('connection', function (socket) {
	socket.emit('connection', "opened");

	socket.on('ack', function (data) {
		io.emit('user-connected', data);
	});

	socket.on('chat-message', function (msg) {
		io.emit('chat-message', msg);
	});

});