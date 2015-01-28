//var FreestylerConnector = require("freestyler_node_connector");
var FreestylerConnector = require("./freestyler_node_connector.js");
//var api = new FreestylerConnector("localhost");
var api = new FreestylerConnector("192.168.56.101");

function createAFullSetObject(val_to_set){
	var set_object = {};
	for(var i=3;i!=159;i++){
		set_object[i+""]=val_to_set;
	}
	return set_object;
}
function loop(i,max,cb){
	setTimeout(function(){
		cb(i);
		i++;
		if(i<max){
			loop(i,max,cb);
		}
	},100);
}

api.connect().then(function(){
	

    /*loop(1,200,function(i){
		console.log("c:"+i+"v:"+5);
		api.setDMX(i,5);// Sets channel 100 to value 5
    });*/
	/*api.setDMXFromArray({
        "1":10,
        "2":20
    });// Set Channel 100 and 30 to value 10 and 20
	Sleep(1000);*/
	console.log(createAFullSetObject(100));
	api.setDMXFromArray(createAFullSetObject(1));
	console.log("hallo2292");
	//api.setDMX(101,5);
	//api.setDMX(102,6);
}).done();