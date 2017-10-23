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
    
    var socket;
    socket = new WebSocket('wss://ec2-13-115-41-122.ap-northeast-1.compute.amazonaws.com:8081');
    
    // サーバーに接続したとき
    socket.onopen = function(msg) { 
      alert('online at skyway');
    };
    
    // サーバーからデータを受信したとき
    socket.onmessage = function(msg) {
        let message = JSON.parse(msg.data);
        nicoScreenObj.comments.push(message.text);
    };
    
    // サーバーから切断したとき
    socket.onclose = function(msg) {
      alert('offline'); 
    };
    
});

