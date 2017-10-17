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
	// API key の再発行が必要
	"key": "30c1f21a-2b6e-4200-97d2-74206e85c4f7",
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
    
    // 現在日時の表示
    const yyyy = openTime.getFullYear();
    const m  = openTime.getMonth();
    const dd = ( "00" + openTime.getDate() ).slice(-2);
    const w  = openTime.getDay();
    const hh = ( "00" + openTime.getHours()).slice(-2);
    const mi = ( "00" + openTime.getMinutes()).slice(-2);
    
    $('#openTimeView').text( wd[w] +" "+ mon[m] +" "+ dd +", "+ yyyy +" at "+ hh +":"+ mi );

    // peerからテキストメッセージを受信したとき
    multiparty.on('message', function(mesg) {

	$('.divided').prepend(
		'<li>'+
		    '<article class="box post-summary">' +
		      '<h3>'+ mesg.data.message +'</h3>'+
		      '<ul class="meta">'+
		        '<li class="icon fa-clock-o">' + mesg.data.date.hh +':'+ mesg.data.date.mm +':'+ mesg.data.date.ss+'</li>'+
		        '<li class="icon fa-comments">'+ mesg.data.username+'</li>'+
		      '</ul>'+
		    '</article>'+
		'</li>'
	);
	nicoScreenObj.comments.push(mesg.data.message);
    });

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


$(window).unload(function() {
    const hostUrl = 'https://172.20.11.237:3000/live/logout'; //このipは書き換え必須
    const jsondata = {
	"peerID"   : peerID
    };
    $.ajax({
        type:          'post',
	dataType:      'json',
	contentType:   'application/json',
	scriptCharset: 'utf-8',
        async:          true,
        url:            hostUrl,
        data:           JSON.stringify(jsondata),
        success: function(){}
    });
});