var net = require('net');
var Q = require("q");


// Automatic socket close on end
var next_unique_id = 1;
var socket_array={};
function exitHandler(options, err) {
	for(var key in socket_array){
		if(socket_array[key]){
			socket_array[key].end();
			socket_array[key]=null;
		}
	}
    if (options.cleanup) console.log('clean');
    if (err) console.log(err.stack);
    if (options.exit) process.exit();
}

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));
// end

function FreestylerConnector(host){
	this.id	  = next_unique_id++;
	this.host = host;
	this.port = 3332;
	this.connected = false;
	this.socket = null;
	socket_array[id+""]=null;
};
module.exports = FreestylerConnector;
FreestylerConnector.prototype.connect = function(){
	var deferred = Q.defer();
	this.socket = new net.Socket();
	socket_array[this.id+""]=this.socket;
	this.socket.connect(this.port, this.host, function() {
	this.connected = true;
		deferred.resolve();
	});
	var me = this;
	this.socket.on("error",function(e){
		if(!me.connected){
			deferred.reject(new Error(e));
		}
	});
	this.socket.on("close",function(e){
		me.connected = false;
		me.socket = null;
		socket_array[me.id+""]=null;
	});
	return deferred.promise;
};

var getControlsFromNumber = function(nr){
	var txt = nr+"";
	var t = "";
	for(var i=0;i!=txt.length;i++){
		switch(txt[i]){
			case "0": t+='FSOC'+(320+0-1)+'255'; break;
			case "1": t+='FSOC'+(320+1-1)+'255'; break;
			case "2": t+='FSOC'+(320+2-1)+'255'; break;
			case "3": t+='FSOC'+(320+3-1)+'255'; break;
			case "4": t+='FSOC'+(320+4-1)+'255'; break;
			case "5": t+='FSOC'+(320+5-1)+'255'; break;
			case "6": t+='FSOC'+(320+6-1)+'255'; break;
			case "7": t+='FSOC'+(320+7-1)+'255'; break;
			case "8": t+='FSOC'+(320+8-1)+'255'; break;
			case "9": t+='FSOC'+(320+9-1)+'255'; break;
		}
	}
	return t;
};

FreestylerConnector.prototype.setDMX = function(channel,value){
	if(!this.connected) throw new Error("not connected");
	var t = 'FSOC335255';
	t+=getControlsFromNumber(channel);
	t+='FSOC332255';// @
	t+='FSOC333255';//DMX
	t+=getControlsFromNumber(value);
	t+='FSOC337255';// ENTER
	this.socket.write(t);
};

FreestylerConnector.prototype.setDMXFromArray = function(array){
	if(!this.connected) throw new Error("not connected");
	for(var key in array){
		var t = 'FSOC335255';
		t+=getControlsFromNumber(parseInt(key));
		t+='FSOC332255';// @
		t+='FSOC333255';//DMX
		t+=getControlsFromNumber(array[key]);
		t+='FSOC337255';// ENTER
	}
	this.socket.write(t);
};
FreestylerConnector.prototype.toggleBlackout = function(){
	this.socket.write('FSOC002255');
};
