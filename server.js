var express = require('express');
var app=express();
var http=require('http').Server(app);
var io=require('socket.io')(http);

var ids_cell=[];
	
app.use(express.static(__dirname+'/clients'));


app.get('/', function(req, res){
res.sendFile(__dirname + '/clients/html/index.html');
});

var id_n = 0;

var create_socket = function(socket)
	{
	var id = id_n;
	id_n++;
	
	console.log('user ' + id + ' connected');
	socket.emit('arraysender',ids_cell);
	socket.on('disconnect', function()
		{
		console.log('user ' + id + ' disconnected');
		});
	//stringa che ricevo in id_casella
	socket.on('id-cas', function(id_casella)
		{
		console.log('user ' + id + ' completed '+ id_casella);
		//quando ricevo che l'id della casella ha il risultato corretto, mando broadcast
		io.emit('notifyall', id_casella);
		//popola array di caselle disabled
		ids_cell.push(id_casella);
		});



	}

io.on('connection', create_socket);



http.listen(3000,function(){
	console.log('listening on *:3000');
});