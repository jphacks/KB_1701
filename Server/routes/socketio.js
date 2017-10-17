const ioport = 9000;
const EventEmitter = require('events');

this.io = require('socket.io').listen(ioport);
this.io.on('connection', function(Socket){
    this.socket = Socket;
    console.log('new connection');
});

class _SocketIO extends EventEmitter{

    constructor(type, message) {
	super();
	this.socketOpen = false;

	// if (!this.socketOpen) {
	//     this.io = require('socket.io').listen(ioport);
	//     // console.log(this.io);

	//     console.log('socket.io open');

	//     this.io.on('connection', function(Socket){
	// 	this.socket = Socket;
	// 	console.log('new connection');

	// 	this.send(type, message);
	//     });
	// }
	// else{
	//     console.log('server is listening');
	// }
    };

    send(type, message){
	let ret = this.io.sockets.emit(type, message);
	console.log(ret);	
    };

    disconnect(){
	this.socket = null;
	this.socketOpen = false;
	this.io = null;
    };
}

module.exports = _SocketIO; 
