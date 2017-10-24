var hostURL = 'https://ec2-13-115-41-122.ap-northeast-1.compute.amazonaws.com:3000';


var nextMovieId;
var result;
var player;
var m_id = 0;

var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var socket;
socket = new WebSocket('wss://ec2-13-115-41-122.ap-northeast-1.compute.amazonaws.com:8081');

// サーバーに接続したとき
socket.onopen = function(msg) { 
  alert('online at youtube');
};

// サーバーからデータを受信したとき
socket.onmessage = function(msg) {
  alert(msg.data);
};

// サーバーから切断したとき
socket.onclose = function(msg) {
  alert('offline'); 
};


function onYouTubeIframeAPIReady() {
  //最初に再生する動画IDを取りに行く
  m_id=1;
  getMovieId(hostURL+'/music/load?musicid=');
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
    //ここでサーバ側に次の動画IDを取りに行く(GET:/music/load?musicid=[num])
    getMovieId(hostURL+'/music/load?musicid=');

  }else if(event.data == YT.PlayerState.CUED){
    event.target.playVideo();
  }
}

function stopVideo() {
  player.stopVideo();
}



function getMovieId(url){
  var url = url + m_id; // リクエスト先URL
  var request = new XMLHttpRequest();

  request.onreadystatechange = function () {
    if (request.readyState != 4) {
      // リクエスト中
    } else if (request.status != 200) {
      // 失敗
    } else {
      // 取得成功

      result = JSON.parse(request.responseText);
      m_id = result.musicid+1;
      loadPlayer(result.videoId);
      document.getElementById("username").textContent=result.username;
      document.getElementById("musicid").textContent=result.musicid;
      document.getElementById("allMusicNum").textContent=result.allMusicNum;
      alert(result);

    }
  };
  request.response = 'json';
  request.open('GET', url);
  request.send(null);
}
