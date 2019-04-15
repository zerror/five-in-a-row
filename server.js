var server = require('express')();
var http = require('http').Server(server);
var io = require('socket.io')(http);

server.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

http.listen(3001, function(){
  console.log('listening on *:3001');
});

io.on('connection', function (socket) {
	socket.emit('message', { test: 'data' });
	socket.on('ack', function (data) {
		console.log(data);
	});
});