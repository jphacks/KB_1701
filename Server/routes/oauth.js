var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
var client = require('cheerio-httpcli');//スクレイピング用


var request = require('request');
var headers = {'Content-Type':'application/json'};


const User = require('../models/user');
const Youtube = require('../models/youtube');
const Team = require('../models/team');
const Message = require('../models/message');


//RTM用モジュール
const RtmClient = require('@slack/client').RtmClient;
const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;


var slack_client_id = '254821626421.255281971077';
var slack_client_secret = '6dbab0ed4bfeb2f602d0831e1edcaf47';

var github_client_id = '9bd1ccc0db7adf39ff87';
var github_client_secret = 'f425b4c195b08d2099ba2e8e2847f8562944324f';

// var hostURL = 'http://13.115.41.122:3000';
var hostURL = 'https://172.20.11.172:3000';
// var hostURL = 'https://localhost:3000';

var slack_access_token;
var github_access_token;
var musicid = 0;
var videoID;
var messageJson;

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("GET request to the /")
  res.render('index', 
    { title: 'Express' ,
      token: ""
    });
});



//slack appのoauth認証
router.get('/slack', function(req, res, next) {
  console.log('GET request to the /oauth/slack');

  var options = {
    url: 'https://slack.com/api/oauth.access?client_id='+slack_client_id
      +'&client_secret='+slack_client_secret
      +'&code='+req.query.code
      +'&redirect_uri='+hostURL+'/oauth/slack',
    json: true
  };

  request.get(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      slack_access_token = body.access_token;
      console.log(body.scope+'\n');
      console.log('Slack Token : '+slack_access_token+'\n');
      res.redirect('https://github.com/login/oauth/authorize?'
        +'client_id='+github_client_id
        +'&redirect_uri='+hostURL+'/oauth/github');//Slackのoauth認証後はGithubのoauth認証へ
    } else {
      console.log('error: '+ response.statusCode);
    }
  });
});


//github app のoauth認証
router.get('/github', function(req, res, next) {
  console.log('GET request to the /oauth/github');

  var options = {
    url: 'https://github.com/login/oauth/access_token?client_id='+ github_client_id
      +'&client_secret='+github_client_secret
      +'&code='+req.query.code,
    json: true
  };

  request.get(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      github_access_token = body.access_token;
      console.log('Github Token : '+github_access_token+'\n');
      res.redirect(hostURL+'/oauth/makechannel');//Githubのoauth認証後はSlackのチャンネル生成へ
    } else {
      console.log('error: '+ response.statusCode);
    }
  });
});

router.get('/makechannel', function(req, res, next) {
  console.log('GET request to the /oauth/makechannel');
  console.log('Slack Token : '+slack_access_token+'\n');
  console.log('Github Token : '+github_access_token+'\n');

  startRTM(slack_access_token);
  var options = {
    url: 'https://slack.com/api/channels.create?token='+slack_access_token
      +'&name=testbot',
    json: true
  };

  request.get(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body);
      res.redirect(hostURL+'/music');//チャンネル生成後は○○へ(今はmusic/loadへ)
    } else {
      console.log('error: '+ response.statusCode);
    }
  });
});

function startRTM(access_token){
  let rtm = new RtmClient(slack_access_token);
  rtm.start();
  rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, function (rtmStartData) {
    for (const c of rtmStartData.channels) {
      console.log(c.name + ' : ' + c.id);
	  if (c.name ==='musicrequest') {
      console.log("\nRegist Channel ID\n");
      channel = c.id 
    }
  }
  console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`);
  });
  rtm.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, function () {
    rtm.sendMessage("Hello!", channel);
  });
  rtm.on(RTM_EVENTS.MESSAGE, function (message) {
    messageJson = JSON.parse(JSON.stringify(message));


    if('message' in messageJson){
      console.log('have attachments field');
    }else if(messageJson.user != 'USLACKBOT'){
      
      console.log(videoID);
      saveData(messageJson);
      console.log(messageJson);
    }
    
    // console.log(messageJson.channel);
    // console.log(messageJson.user);
    // console.log(messageJson.text);
  });
}


function saveData(data){
  if(data.channel == 'C7HU7A7T6'){
    
    videoID = data.text.substring(33,44);//textからvideoIDのみを抽出，videoIDはすべての動画で11桁
    musicid = musicid + 1;
    // var musicid = musicid; //musicidは node.js側で連番をふるべき
    var url  = videoID;
    var title   = 'test title'; //フロントでスクレイピングする or サーバでスクレイピングする
    var userid   = data.user;


    // DBにyoutubeを格納．youtubeの構造は以下の通り
      // youtube = {
      //     musicid : musicid
      //     url : url;
      //     title : title;
      //     userid : userid;
      // }
    Youtube.find({ 'musicid' : musicid }, function(err, result){
      if (err) console.log(err);
      // 新規登録
      if (result.length == 0){
        var youtube = new Youtube();

        youtube.musicid = musicid;
        youtube.url = url;
        youtube.title = title;
        youtube.userid = userid;
        
        youtube.save(function(err){
          if (err) console.log(err);
        });
      }
    });
  }

}



module.exports = router;
