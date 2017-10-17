$(function(){
    const room     = $('#room').text();
    const username = $('#username').text();
    const message  = $('#message').text();

    // MultiParty インスタンスを生成
    const multiparty = new MultiParty( {
	"key": "b6e0144a-5606-44b2-a305-f89a92e7e0a9",
	"reliable": true,
	"room": room,
	"debug": 3
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

    const nowTime = new Date();
    const watchingTime = {
        hh : ( "00" + Math.floor( 
    	nowTime.getTime() / ( 1000*60*60 ) % 24	
        )).slice(-2),

        mm : ( "00" + Math.floor( 
    	nowTime.getTime() / ( 1000*60 ) % 60	
        )).slice(-2),

        ss : ( "00" + Math.floor( 
    	nowTime.getTime() / ( 1000 ) % 60	
        )).slice(-2)
    };
    const data = {
        date    : watchingTime,
        username: username,
        message : message
    };

    multiparty.send(data);
});
