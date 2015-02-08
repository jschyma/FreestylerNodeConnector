#FreestylerNodeConnector
[![NPM Version][npm-image]][npm-url]

Freestyler is free lighting control software used by many leading dj's, venues and lighting designers and supported by a vast network of users worldwide.
http://www.freestylerdmx.be/

With Freestyler you are able to control lights with DMX-Interface.

This API is an interface for Freestyler to set DMX-Channels from Javascript.
```js
var FreestylerConnector = require("freestyler_node_connector");
var api = new FreestylerConnector("localhost");
api.connect().then(function(){
	api.setDMX(100,5);// Sets channel 100 to value 5
	api.setDMXFromArray({
		"100":10,
		"30":20
	});// Set Channel 100 and 30 to value 10 and 20
}).done();
```

##Known Errors
For some reason Freestyler does not accept more than about a 100 values to be set at once.

[npm-image]: https://img.shields.io/npm/v/freestyler_node_connector.svg?style=flat
[npm-url]: https://npmjs.org/package/freestyler_node_connector
