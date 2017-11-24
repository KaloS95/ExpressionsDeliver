module.exports = {TreeGenesis};

function TreeGenesis(postString){
	var i = postString.length-1;
	var id = 0;
	function readNext(){
		var str = '';
		var val = postString[i];
		i--;
		if(val.type == 'Operator'){
			var left = readNext();
			var right = readNext();

			var ris;
			switch(val.value){
				case '+': ris = left.value+right.value;break;
				case '-': ris = left.value-right.value;break;
				case '*': ris = left.value*right.value;break;
				case '/': ris = left.value/right.value;break;
				case '^': ris = Math.pow(left.value, right.value);break;
			}
			str += '{\n';
			str += '"innerHTML": "'+val.value+"<br/><input id='"+(id)+"' type='text' onkeydown='check(event)' data-result='"+ris+"'"+
			"/><br/><input id='"+"author_"+(id)+"'"+"' type='text' disabled onkeydown='checkAuthor(event)' />"+'",\n';
			str += '"children": [\n';
			str += left.string + ", \n";
			str += right.string;
			str += "]\n";
			str += '}\n';
			id++;
			return{string:str, value:ris};
		}
		else{
			str += '{"text": { "name": '+val.value+' }}\n';
			return{string:str, value:parseFloat(val.value)};
		}
	};

	return '{'+
 '"chart": {'+
 '"container": "#tree-simple", '+
		'"rootOrientation": "SOUTH"'+
 '}, '+
 
 '"nodeStructure": '+
	readNext().string+ '}';

};
