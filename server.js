
//http server
var express = require('express');
var app=express();
var http=require('http').Server(app);

//socket io
var io=require('socket.io')(http);

//files access
var fs=require('fs');

//tree generator
var parser=require(__dirname+'/parser.js');
var tregen=require(__dirname+'/treeGenesis.js');

//======================================================================


var ids_cell=[];


var amount=require(__dirname+'/clients/trees/number_trees.json').amount;
console.log(parseInt(Math.random()*amount));
console.log(parseInt(Math.random()*amount));
console.log(parseInt(Math.random()*amount));
var tree=require(__dirname+'/clients/trees/tree'+/*parseInt(Math.random()*amount)*/2+'.json');
app.use(express.static(__dirname+'/clients'));


app.get('/', function(req, res){
res.sendFile(__dirname + '/clients/html/index.html');
});


app.get('/addexpressions', function(req, res){
res.sendFile(__dirname + '/clients/html/addexpressions.html');
});

app.get('/sendexp', function(req, res){
	var amount;
	/*fs.readFileSync(__dirname+"/clients/trees/number_trees.txt","utf8",function(err,data){
		amount=parseInt(data);
		if(err){console.log(err);}
		console.log("!!!!");
		console.log(amount);
		console.log(data);
		console.log("!!!!!");
	});*/
	//var amount=require(__dirname+'/clients/trees/number_trees.json').amount;
	var  amount =JSON.parse(fs.readFileSync(__dirname+'/clients/trees/number_trees.json')).amount;
	console.log(req.query.expression);
	var ris=(parser.parse(req.query.expression));
	var tree=tregen.TreeGenesis(ris);
		console.log("!!!!");
		console.log(amount);
		console.log("!!!!!");
	fs.writeFile(__dirname+"/clients/trees/tree"+amount+".json",tree,function(err){
		if(!err){fs.writeFile(__dirname+"/clients/trees/number_trees.json",'{"amount": '+(parseInt(amount)+1)+"}",function(err){
			if(err){console.log(err);}
			});
		}
		else{console.log(err);}
		
	});

	console.log(tregen.TreeGenesis(ris));
	
});



var id_n = 0;

var create_socket = function(socket)
	{
	var id = id_n;
	id_n++;
	
	console.log('user ' + id + ' connected');
	socket.emit('sendtree',tree);
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