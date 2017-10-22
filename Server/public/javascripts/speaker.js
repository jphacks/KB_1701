let nicoScreenObj = {
    "base":{
	color:"white", 
	speed:"normal", 
	interval:"normal",
	font_size:"30px", 
	loop:false 
    },
		
    "comments":[]
};

$(window).load(function(){

    // MultiParty インスタンスを生成
    const multiparty = new MultiParty( {
	"key": "b6e0144a-5606-44b2-a305-f89a92e7e0a9",
	"reliable": true,
	"debug": 3
    });

    // 自分のvideoを表示
    multiparty.on('my_ms', function(video) {
	let vNode = MultiParty.util.createVideoNode(video);
	vNode.volume = 0;
	$(vNode).appendTo("#streams");
	console.log("MY: " + video);
    });
    // peerが切れたら、対象のvideoノードを削除する
    multiparty.on('ms_close', function(peer_id) {
	$("#"+peer_id).remove();
    });

    multiparty.on('error', function(err) {
	console.log(err);
	alert(err);
    });

    // サーバとpeerに接続
    multiparty.start();
    
    // const socket = io.connect('https://172.20.11.172:8081');
    const url = getHostUrl('ws', '/');
    var socket = new WebSocket(url);

    // When a connection is made
    socket.onopen = function() {
    console.log('Opened connection ');

    // send data to the server
    var json = JSON.stringify({ message: 'Hello ' });
	socket.send(json);
    };

    // A connection could not be made
    socket.onerror = function(event) {
	console.log(event);
    };

    socket.onmessage = function(event) {
	let message = JSON.parse(event.data);
	nicoScreenObj.comments.push(message.text);
    };
});

