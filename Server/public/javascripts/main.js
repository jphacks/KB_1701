const url = getHostUlr('ws', '/');
var socket = new WebSocket(url);

// When a connection is made
socket.onopen = function() {
  console.log('Opened connection ');

  // send data to the server
  var json = JSON.stringify({ message: 'Hello ' });
  socket.send(json);
}

// When data is received
socket.onmessage = function(event) {
  let message = JSON.parse(event.data);
  // document.getElementById("word").textContent=message.text;//文章だけの時
  document.getElementById("word").textContent=message.file.initial_comment.comment;//画像にコメントがある時
  alert(message.file.url_private);
  document.getElementById("icon").src = message.file.url_private;
  // alert(event.data);
}

// A connection could not be made
socket.onerror = function(event) {
  console.log(event);
}

// A connection was closed
// socket.onclose = function(code, reason) {
//   console.log(code, reason);
// }

// Close the connection when the window is closed
// window.addEventListener('beforeunload', function() {
//   socket.close();
// });
