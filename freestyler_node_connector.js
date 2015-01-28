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
	socket_array[this.id+""]=null;
};
module.exports = FreestylerConnector;
FreestylerConnector.prototype.connect = function(){
	var deferred = Q.defer();
	this.socket = new net.Socket();
	socket_array[this.id+""]=this.socket;
	var me = this;
	var orig_socket = this.socket;
	this.socket.connect(this.port, this.host, function() {
		me.connected = true;
		deferred.resolve();
	});
	this.socket.on("error",function(e){
		console.log("e");
		if(!me.connected){
			deferred.reject(new Error(e));
		}
	});
	this.socket.on("close",function(e){
		if(me.socket===orig_socket){
			me.connected = false;
			me.socket = null;
			socket_array[me.id+""]=null;
		}
	});
	return deferred.promise;
};
FreestylerConnector.prototype.close = function(){
	socket_array[this.id+""]=null;
	this.socket.end();
	this.connected = false;
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
var nextnr = 0;
	var InternalRunner = function(tt,fs){
		this.id = nextnr++;
		this.ttt = tt+"";
		this.fss = fs;
		console.log(this.id);
		this.cb = function(){
					console.log("hier"+this.id);
					console.log(this.ttt);
					this.fss.socket.write(this.ttt);
				};
	};
FreestylerConnector.prototype.setDMXFromArray = function(array){
	if(!this.connected) throw new Error("not connected");
	var t = 'FSOC335255';
	var counter = 0;
	var bs_count = 0;
	for(var key in array){
		t+=getControlsFromNumber(parseInt(key));
		t+='FSOC332255';// @
		t+='FSOC333255';//DMX
		t+=getControlsFromNumber(array[key]);
		t+='FSOC337255';// ENTER
		counter++;
		/*if(counter>=90){// exactly 100 seem to much
				var me = this;
				var run = new InternalRunner(t,this);
				setTimeout(function(){run.cb();},10000*bs_count);
				bs_count++;
			t = 'FSOC335255';
			counter = 0;
		}*/
	}
	/*if(counter>0){
		var me = this;
		var runs = new InternalRunner(t,this);
		setTimeout(function(){runs.cb();},10000*bs_count);
		bs_count++;
	}*/
	this.socket.write(t);
};
FreestylerConnector.prototype.toggleBlackout = function(){
	this.socket.write('FSOC002255');
};
