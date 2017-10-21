const wd  = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const mon = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
	   "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
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
    const room     = $('#room').text();
    const peerID   = $('#peerID').text();
    const openTime = new Date( $('#openTime').text() );

    // MultiParty インスタンスを生成
    const multiparty = new MultiParty( {
	"key": "b6e0144a-5606-44b2-a305-f89a92e7e0a9",
	"reliable": true,
	"room": room,
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
    var socket = new WebSocket('ws://localhost:8081/');


    // When a connection is made
    socket.onopen = function() {
    console.log('Opened connection ');

    // send data to the server
    var json = JSON.stringify({ message: 'Hello ' });
    socket.send(json);
    }

    // When data is received
    // socket.onmessage = function(event) {
    // console.log(event.data);
    // alert(event.data);
    // }

    // A connection could not be made
    socket.onerror = function(event) {
    console.log(event);
    }

    // A connection was closed
    // socket.onclose = function(code, reason) {
    // console.log(code, reason);
    // }

    // // Close the connection when the window is closed
    // window.addEventListener('beforeunload', function() {
    // socket.close();
    // });







    
    // 現在日時の表示
    const yyyy = openTime.getFullYear();
    const m  = openTime.getMonth();
    const dd = ( "00" + openTime.getDate() ).slice(-2);
    const w  = openTime.getDay();
    const hh = ( "00" + openTime.getHours()).slice(-2);
    const mi = ( "00" + openTime.getMinutes()).slice(-2);
    
    $('#openTimeView').text( wd[w] +" "+ mon[m] +" "+ dd +", "+ yyyy +" at "+ hh +":"+ mi );

    // peerからテキストメッセージを受信したとき
    // socket.onmessage = function(event) {
    // console.log(event.data);
    // alert(event.data);
    // }

    socket.onmessage = function(event) {
    
    let message = JSON.parse(event.data);
    // alert(message.text);
	$('.divided').prepend(
		'<li>'+
		    '<article class="box post-summary">' +
		      '<h3>'+ message.text +'</h3>'+
		    '</article>'+
		'</li>'
	);
	nicoScreenObj.comments.push(message.text);
    }

    // 放送時間
    $(function(){
	setInterval(function(){
	    const now = new Date();
	    const hh = ( "00" + Math.floor( (( now.getTime() - openTime.getTime() ) / ( 1000*60*60 )) % 24 ) ).slice(-2);
	    const mi = ( "00" + Math.floor( (( now.getTime() - openTime.getTime() ) / ( 1000*60 )) % 60 ) ).slice(-2);
	    const ss = ( "00" + Math.floor( (( now.getTime() - openTime.getTime() ) / ( 1000 )) % 60 ) ).slice(-2);
	    $("#currentTime").text( hh +":"+ mi +":"+ ss );
	}, 100);
    });

});


// $(window).unload(function() {
//     const hostUrl = 'https://172.20.11.237:3000/live/logout'; //このipは書き換え必須
//     const jsondata = {
// 	"peerID"   : peerID
//     };
//     $.ajax({
//         type:          'post',
// 	dataType:      'json',
// 	contentType:   'application/json',
// 	scriptCharset: 'utf-8',
//         async:          true,
//         url:            hostUrl,
//         data:           JSON.stringify(jsondata),
//         success: function(){}
//     });
// });
