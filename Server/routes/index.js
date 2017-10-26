const express = require('express');
const router = express.Router();
const path = require('path');
const mongoose = require('mongoose');
const client = require('cheerio-httpcli');//スクレイピング用
const request = require('request');
const http = require('http');
const fs = require('fs');
const ws = require('websocket.io');
const https = require('https');

var slackRequests = require('../public/javascripts/server/SlackRequest');
var commitRegist = require('../public/javascripts/server/CommitRegist');
var token = require('../public/javascripts/server/token');

var postFrag;

var PORT = 8081;
var opts = {
	key  : fs.readFileSync(path.join(__dirname, '../serverKey') + '/localhost.key', 'utf8'),
	cert : fs.readFileSync(path.join(__dirname, '../serverKey') + '/localhost.crt', 'utf8')
};

//RTM用モジュール
const RtmClient = require('@slack/client').RtmClient;
const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;

const User = require('../models/user');
const Youtube = require('../models/youtube');
const Team = require('../models/team');
const Message = require('../models/message');
const Limit = require('../models/limit');
const AccessToken = require('../models/accesstoken');
const Channel = require('../models/channel');
const MakeSchema = require('../models/schema');


var hostURL = 'https://ec2-13-115-41-122.ap-northeast-1.compute.amazonaws.com:3000';


var musicid = 0;
var slack_access_token;



var ssl_server = https.createServer(opts, function(req, res) {
  res.end();
});

ssl_server.listen(PORT, function() {
  console.log('Listening on ' + PORT);
});
 

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("GET request to the /")
  res.render('index',{ title: 'Express'});
});

router.get('/main', function(req, res, next) {
  console.log("GET request to the /music")


  res.render('main', { title: 'Express'});
});

router.get('/start', function(req, res, next) {
  console.log("GET request to the /start")
  slack_access_token = token.slack;
  
  console.log('token.slack: '+slack_access_token);
  
  //そのアクセストークンを使ってwebsocketの開通
  //socket ioによるクライアントとのリアルタイム通信

  var wss = ws.attach(ssl_server);
  WSS(wss);
  
  function WSS(wss){
    wss.on('connection', function(socket) {
      postFrag = socket;
      console.log('connection')
      let rtm = new RtmClient(slack_access_token);
      slackRequests.startRTM(rtm,slack_access_token,socket);
  
      // 受信したメッセージを全てのクライアントに送信する
      wss.clients.forEach(function(client) {
        client.send("test wss");
      });
  
      // クライアントからのメッセージ受信したとき
      socket.on('message', function(data) {
          console.log('data');
      });
  
      // クライアントが切断したとき
      socket.on('disconnect', function(){
        
        console.log('connection disconnect');
      });
  
      // 通信がクローズしたとき
      socket.on('close', function(){
	      WSS(wss);
        console.log('connection close');
      });
  
      // エラーが発生したとき
      socket.on('error', function(err){
        console.log(err);
      });

    });
  }
  
  res.render('start', { title: 'Express'});
});

router.get('/regist/schema', function(req, res, next) {
  console.log("GET request to the /regist/schema")
  //DBから
  res.render('registSchema', { title: 'Express'});
});




router.get('/regist/limit', function(req, res, next) {
  console.log("GET request to the /regist/limit")
  var limitid = req.query.limitid;
  var year;
  var month;
  var day;
  var hour;
  var minute;

  Limit.find({"limitid" : limitid},function(err,limit){
    if(err) console.log(err);
    year = limit[0].year;
    month = limit[0].month;
    day = limit[0].day;
    hour = limit[0].hour;
    minute = limit[0].minute;
    res.json({"year": year,"month": month,"day": day,"hour": hour,"minute": minute});
  });
});

router.get('/slack/get/channel', function(req, res, next) {
  console.log("GET request to the /regist/limit")
  var channelName = req.query.channelName;
  // var channelId;

  Channel.find({"channelName" : channelName},function(err,channel){
    if(err) console.log(err);
    var channelId = channel[0].channelId;

    res.json({"channelId": channelId});
  });
});


router.get('/music/load', function(req, res, next) {
  console.log("GET request to the /music/load")
  
  postFrag.send("test");
  console.log(req.query.musicid);
  var musicid = req.query.musicid;
  var videoId;
  var name;
  var allMusicNum;
  //DBからyoutubeの動画IDを取得してフロントのyoutube.jsのvideoIdにセット
  Youtube.count(function(err,allMusicNum){
    Youtube.find({"musicid" : musicid},function(err,youtube){
      if(err) console.log(err);
      if(allMusicNum == 0 || musicid > allMusicNum){
        username = "musicチャンネルに動画リクエストを！！！"
        videoId = 'G5rULR53uMk';
        musicid = allMusicNum;
        res.json({"videoId": videoId,"username": name,"musicid": musicid,"allMusicNum": allMusicNum});
      }else{
        if(err) console.log(err);
        userid = youtube[0].userid;
        videoId = youtube[0].url;
        musicid = youtube[0].musicid;
        console.log(youtube[0].url);
        console.log(youtube[0].userid);
        User.find({"userid" : userid},function(error,user){
          if(err) console.log(err);
          name = user[0].team;
          console.log("User Name: "+name);
          res.json({"videoId": videoId,"username": name,"musicid": musicid,"allMusicNum": allMusicNum});
        });
      }
    });
  });
});


/* POST home page. */
router.post('/', function(req, res, next) {
  console.log('POST request to the index');
  console.log(req.body);
  res.send('POST request to the index');
});

router.post('/regist/schema', function(req, res, next) {
  console.log("POST request to the /regist/schema")
  res.setHeader('Content-Type', 'application/json');

  var schemaid = req.body.schemaid;
  var content = req.body.content;

  MakeSchema.find({'schemaid': schemaid},function(err,result){
    if (err) console.log(err);
    if (result.length == 0){
        var schema = new MakeSchema();

        schema.schemaid = schemaid;
        schema.content  = content;
        
        schema.save(function(err){
          if (err) console.log(err);
        });
      }
    res.json({ 'status' : 200 });

  })
});

//自己紹介から取得したデータをDBへ格納
router.post('/slack/introduction', function(req, res, next) {
    console.log('POST request to the /slack/introduction');
    res.setHeader('Content-Type', 'application/json');

    var userid = req.body.userid;
    var username  = req.body.username;
    var team   = req.body.team;
    var area   = req.body.area;
    var githubAccount = req.body.githubAccount;
    var specialty = req.body.specialty;
    var tobacco = req.body.tobacco;

    User.find({ 'userid' : userid }, function(err, result){
      if (err) console.log(err);

    // DBにuserを格納．userの構造は以下の通り
    // user = {
    //     userid : userid
    //     username : username;
    //     team : team;
    //     area : area;
    //     githubAccount : githubAccount;
    //     specialty : specialty;
    //     tobacco : tobacco;
    // }

    // 新規登録
      if (result.length == 0){
        var user = new User();

        user.userid = userid;
        user.username  = username;
        user.team   = team;
        user.area = area;
        user.githubAccount = githubAccount;
        user.specialty = specialty;
        user.tobacco = tobacco;

        user.save(function(err){
          if (err) console.log(err);
        });
      }
    res.json({ 'status' : 200 });
  });

  User.find({ 'tobacco' : true }, function(err, result){
  });
});


//タイマー制限時間セット用エンドポイント
router.post('/regist/limit', function(req, res, next) {
  console.log('POST request to the /regist/limit');
  res.setHeader('Content-Type', 'application/json');


  console.log(req.body);
  var limitid  = req.body.limitid;
  var year   = req.body.year;
  var month   = req.body.month;
  var day = req.body.day;
  var hour = req.body.hour;
  var minute = req.body.minute;


  Limit.find({ 'limitid' : limitid }, function(err, result){
      if (err) console.log(err);

    // 新規登録
      if (result.length == 0){
        var limit = new Limit();

        limit.limitid  = limitid;
        limit.year   = year;
        limit.month   = month;
        limit.day = day;
        limit.hour = hour;
        limit.minute = minute;

        limit.save(function(err){
          if (err) console.log(err);
        });
      }
    res.json({ 'status' : 200 });
  });

});


module.exports = router;
