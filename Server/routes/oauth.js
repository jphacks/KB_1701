var express = require('express');
var router = express.Router();

const mongoose = require('mongoose');
var client = require('cheerio-httpcli');//スクレイピング用
var WSS = require('ws').Server;
var request = require('request');
var headers = {'Content-Type':'application/json'};

//自作jsの読み込み
var slackRequests = require('../public/javascripts/server/SlackRequest');



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
let rtm;

// Start the server
var wss = new WSS({ port: 8081 });

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
      rtm = new RtmClient(slack_access_token);
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

  slackRequests.makeChannnel(slack_access_token,'regist DB test');

  wss.on('connection', function(socket) {
    console.log('Opened connection ');
    slackRequests.startRTM(rtm,slack_access_token,socket);
    // Send data back to the client
    var json = JSON.stringify({ message: 'Gotcha' });
    socket.send(json);

    // When data is received
    socket.on('message', function(message) {
      console.log('Received: ' + message);
    });

    // The connection was closed
    socket.on('close', function() {
      console.log('Closed Connection ');
    });

  });

  res.redirect(hostURL+'/music');//チャンネル生成後は○○へ(今は/musicへ)
  
});
module.exports = router;
