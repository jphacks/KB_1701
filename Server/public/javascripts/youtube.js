// var hostURL = 'https://13.115.41.122:3000';
// var hostURL = 'https://172.20.11.172:3000';
var hostURL = 'https://192.168.128.102:3000';


var nextMovieId;
var result;


var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
var socket = new WebSocket('ws://192.168.128.102:8081/');


// When a connection is made
socket.onopen = function() {
  console.log('Opened connection ');

  // send data to the server
  var json = JSON.stringify({ message: 'Hello ' });
  socket.send(json);
}

// When data is received
socket.onmessage = function(event) {
  console.log(event.data);
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



function onYouTubeIframeAPIReady() {
  //最初に再生する動画IDを取りに行く
  m_id=1;
  getMovieId(hostURL+'/music/load?musicid='+m_id);
}


function loadPlayer(videoID) {
  /* 埋め込むオブジェクトを生成（すでにある場合は削除）*/
  if(!player){
    player = new YT.Player(
      'player',{
        width: '640',   /* 動画プレーヤーの幅 */
        height: '390',   /* 動画プレーヤーの高さ */
        videoId: videoID,   /* YouTube動画ID */
        events: { /* イベント */
          "onReady": onPlayerReady,   /* プレーヤの準備完了時 */
          'onStateChange': onPlayerStateChange
        }
      }
    );
  }else{
    player.cueVideoById(videoID); /* 指定した動画のサムネイルを読み込む（自動再生しない） */
  }
}

function onPlayerReady(event) {
  event.target.playVideo();
}

function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.PLAYING) {
    //ここは動画がPlayingの時の処理

  }else if (event.data == YT.PlayerState.ENDED ) {
    m_id = m_id + 1;
    //ここでサーバ側に次の動画IDを取りに行く(GET:/music/load?musicid=[num])
    getMovieId(hostURL+'/music/load?musicid='+m_id);

    loadPlayer('z94oQMmqF8s');

  }else if(event.data == YT.PlayerState.CUED){
    event.target.playVideo();
  }
}


function stopVideo() {
  player.stopVideo();
}



function getMovieId(url){
  var url = url; // リクエスト先URL
  var request = new XMLHttpRequest();

  request.onreadystatechange = function () {
    if (request.readyState != 4) {
      // リクエスト中
    } else if (request.status != 200) {
      // 失敗
    } else {
      // 取得成功

      result = JSON.parse(request.responseText);

      loadPlayer(result.videoId);
     //document.getElementById("username").textContent=result.username;
      //document.getElementById("musicid").textContent=result.musicid;
      //document.getElementById("allMusicNum").textContent=result.allMusicNum;
      // alert(result);

    }
  };
  request.response = 'json';
  request.open('GET', url);
  request.send(null);
}
