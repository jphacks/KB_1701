

var socket = io.connect('https://ec2-13-115-41-122.ap-northeast-1.compute.amazonaws.com:8081');


// 接続したとき
socket.on('connect', function () {
  document.body.innerHTML = new Date().toString() + '<span>接続が確立しましたー</span><br>';
});

// メッセージを受信したとき
socket.on('message', function(event) {
  let message = JSON.parse(event.data);
  // document.getElementById("word").textContent=message.text;//文章だけの時
  document.getElementById("word").textContent=message.file.initial_comment.comment;//画像にコメントがある時
  // alert(message.file.url_private);
  document.getElementById("icon").src = message.file.url_private;
  // alert(event.data);
});