var express = require('express');
var server = express();
var http = require('http').Server(server);
var io = require('socket.io')(http);

const path = require('path');
const port = process.env.PORT || 3001;

server.use(express.static(path.resolve(__dirname, './build')));

server.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});

io.on('connection', function (socket) {
	socket.emit('message', { test: 'data' });
	socket.on('ack', function (data) {
		console.log(data);
	});
});