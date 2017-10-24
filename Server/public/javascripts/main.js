

var socket;
socket = new WebSocket('wss://ec2-13-115-41-122.ap-northeast-1.compute.amazonaws.com:8081');

// サーバーに接続したとき
socket.onopen = function(msg) { 
  alert('online at main');
};

// サーバーからデータを受信したとき
socket.onmessage = function(msg) {
  let message = JSON.parse(event.data);
  // document.getElementById("word").textContent=message.text;//文章だけの時
  document.getElementById("word").textContent=message.file.initial_comment.comment;//画像にコメントがある時
  // alert(message.file.url_private);
  document.getElementById("icon").src = message.file.url_private;
  // alert(event.data);
};

// サーバーから切断したとき
socket.onclose = function(msg) {
  alert('offline'); 
};
