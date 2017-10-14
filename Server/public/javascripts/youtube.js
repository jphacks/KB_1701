// 2. This code loads the IFrame Player API code asynchronously.
      var tag = document.createElement('script');
      const request = new XMLHttpRequest();


      // var hostURL = 'https://13.115.41.122:3000';
      var hostURL = 'https://172.20.11.172:3000';

      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      // 3. This function creates an <iframe> (and YouTube player)
      //    after the API code downloads.
      var player;
      function onYouTubeIframeAPIReady() {
        player = new YT.Player('player', {
          height: '360',
          width: '640',
          videoId: 'HJ43LlAWAZ8',
          events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
          }
        });
      }

      // 4. The API will call this function when the video player is ready.
      function onPlayerReady(event) {
        event.target.playVideo();
      }

      // 5. The API calls this function when the player's state changes.
      //    The function indicates that when playing a video (state=1),
      //    the player should play for six seconds and then stop.
      var done = false;
      function onPlayerStateChange(event) {
        if(event.data ==YT.PlayerState.PAUSED || event.data ==YT.PlayerState.ENDED){
            request.open("GET", hostURL+'/music/load');
            request.send();
          }
        if (event.data == YT.PlayerState.PLAYING && !done) {
          setTimeout(stopVideo, 6000);
          done = true;

          // while (1){
          //   setTimeout(2000);
          //   if(player.getPlayerState()==0) break;
          // }
   
        }
      }
      function stopVideo() {
        player.stopVideo();
      }