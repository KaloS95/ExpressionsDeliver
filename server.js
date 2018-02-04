
//http server
var express = require('express');
var app = express();
var http = require('http').Server(app);

//socket io
//creo istanza io, struttura costruttore
var io = require('socket.io')(http);

//files access
var fs = require('fs');

//tree generator
var parser = require(__dirname+'/parser.js');
var tregen = require(__dirname+'/treeGenesis.js');

// ====================================================================== 


var ids_cell = [];
var punteggi = [];


//amount sa quanti alberi di espressioni sono presenti
var amount = require(__dirname+'/clients/trees/number_trees.json').amount;


//prende un numero randomico dal set e 
//require apre jsons in modo non rischioso
var tree = require(__dirname+'/clients/trees/tree'+/*parseInt(Math.random()*amount)*/0+'.json');
//prima di questa riga i file in quella cartella non possono essere caricati altrimenti
app.use(express.static(__dirname+'/clients'));


app.get('/', function(req, res){
res.sendFile(__dirname + '/clients/html/index.html');
});

//parte professore
app.get('/addexpressions', function(req, res){
res.sendFile(__dirname + '/clients/html/addexpressions.html');
});

app.post('/addexpressions', function(req, res){
res.sendFile(__dirname + '/clients/html/addexpressions.html');
});



app.get('/sendexp', function(req, res){
	var amount;
	//var amount = require(__dirname+'/clients/trees/number_trees.json').amount;
	var amount = JSON.parse(fs.readFileSync(__dirname+'/clients/trees/number_trees.json')).amount;
	//prendo l'espressione e la salvo in ris
	//parso l'espressione in un Json che mi rappresenta l'albero
	var ris = (parser.parse(req.query.expression));

	//crea l'albero dall'espressione appena presa
	var tree = tregen.TreeGenesis(ris);

	fs.writeFile(__dirname+"/clients/trees/tree"+amount+".json", tree, function(err){
		if(!err){fs.writeFile(__dirname+"/clients/trees/number_trees.json", '{"amount": '+(parseInt(amount)+1)+"}", function(err){
			if(err){console.log(err);}
			});
		}
		else{console.log(err);}
		
	});

	res.sendFile(__dirname + '/clients/html/expsent.html');

	
});


var id_n = 0;

var create_socket = function(socket)
	{
	var id = id_n;
	id_n++;
	var name;
	var score=0;
	var color;
	
	console.log('user ' + id + ' connected');

	socket.emit('sendtree', tree);

	socket.emit('arraysender', ids_cell);


	socket.on('disconnect', function()
		{
		console.log('user ' + id + ' disconnected');
		});
	//stringa che ricevo in id_casella
	socket.on('id-cas', function(id_casella, score)
		{
		console.log('user ' + id + ' completed '+ id_casella);
		//quando ricevo che l'id della casella ha il risultato corretto, mando broadcast
		io.emit('notifyall', id_casella, name);
		//popola array di caselle disabled
		ids_cell.push({cell: id_casella, author: name, color:color});

		//se l'author è lo steso incrementagli il punteggio...
		var index = punteggi.findIndex(x => x.author==name);
		if(index==-1){
			punteggi.push({author: name, score:score, color:color})
		}else{
			punteggi[index].score=score;
		}
		

		io.emit('punteggi',punteggi);

		

		});

	socket.on('name', function(arg){
		name = arg;
	});
	socket.on('color', function(col){
		color=col;
	})
	socket.on('score', function(score){
		score=score;
	})
	socket.on('displaylista',function () {
		
		punteggi.push({author: name, score:score, color:color})
		socket.emit('mostralista',punteggi);
	})

	}


//quando qualcuno si connette mi simula la creazione del "ponte" struttura socket mantenuta e non come nei browser che viene killata
io.on('connection', create_socket);



http.listen(3000, function(){
	console.log('listening on *:3000');
});