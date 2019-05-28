var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    console.log('a user connected');

    socket.on('disconnect', function(){
	console.log('user disconnected');
    });
    
    socket.on('chat message', function(data){
	console.log('message: ' + data.msg);
	var currentRoom = Object.keys(socket.rooms)[0];
	io.to(currentRoom).emit('chat message', currentRoom + "#" + data.id + ": " + data.msg);
    });
    
    socket.on('join room', function(data){
	var currentRoom = Object.keys(socket.rooms)[0];
	if (currentRoom != data.newroom) {
	    socket.broadcast.to(currentRoom).emit('chat message', data.id + " left the room");
	    socket.leave(currentRoom);
	    socket.join(data.newroom);
	    socket.broadcast.to(data.newroom).emit('chat message', data.id + " joined the room");
	}
    });

    socket.on('new nick', function(data) {
	var currentRoom = Object.keys(socket.rooms)[0];
	socket.broadcast.to(currentRoom).emit('chat message', data.id + " changed nick to " + data.newId);
    });
    
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
