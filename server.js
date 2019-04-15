var server = require('express')();
var http = require('http').Server(server);
var io = require('socket.io')(http);

const port = process.env.port || 3001;

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