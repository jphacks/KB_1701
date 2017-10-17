// 2. This code loads the IFrame Player API code asynchronously.


        // var hostURL = 'https://13.115.41.122:3000';
        var hostURL = 'https://172.20.11.172:3000';
        // var hostURL = 'https://localhost:3000';


        var nextMovieId;
        var result;


        var tag = document.createElement('script');

        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        // 3. This function creates an <iframe> (and YouTube player)
        //    after the API code downloads.
        var player;
        function onYouTubeIframeAPIReady() {
          //最初に再生する動画IDを取りに行く
          m_id=1;
          getMovieId(hostURL+'/music/load?musicid='+m_id);
          // loadPlayer('0VECSnz1a_4');
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

        // 4. The API will call this function when the video player is ready.
        function onPlayerReady(event) {
          event.target.playVideo();
        }

        // 5. The API calls this function when the player's state changes.
        //    The function indicates that when playing a video (state=1),
        //    the player should play for six seconds and then stop.
        
        function onPlayerStateChange(event) {
          if (event.data == YT.PlayerState.PLAYING) {
            
            
          }else if (event.data == YT.PlayerState.ENDED ) {
            m_id = m_id + 1;
            //ここでサーバ側に次の動画IDを取りに行く(GET:/music/load?musicid=[num])
            getMovieId(hostURL+'/music/load?musicid='+m_id);
            
            // var nextMovieId = result.videoId;
            // console.log(nextMovieId);
            loadPlayer('z94oQMmqF8s');

            // $.get(hostURL+"/music/load",
            //   { musicid: m_id},
            //   function(data){
            //     //リクエストが成功した際に実行する関数
            //     nextMovieId = data;
            //     console.log(data);
            //     var nextMovieId = 'NKN6yZz0qls';
            //     loadPlayer(nextMovieId);
            //   }
            // );
            //動画IDを取得したらnextMovieIdに格納
            
            
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
            }
          };
          request.response = 'json';
          request.open('GET', url);
          request.send(null);
        }