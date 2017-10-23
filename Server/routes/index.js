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
  //AccessToken DBからslackのaccessトークンを取得
  AccessToken.count(function(err,accessTokenNum){

    if (err) console.log(err);
    AccessToken.find({"id": 0},function(err,result){
      if (err) console.log(err);
      let slack_access_token = result.slack;
      console.log(result[0].slack);

      slack_access_token = result[0].slack;
    })
  })
  
  console.log(slack_access_token);
  
  //そのアクセストークンを使ってwebsocketの開通
  //socket ioによるクライアントとのリアルタイム通信

  var wss = ws.attach(ssl_server);
  WSS(wss);
  
  function WSS(wss){
    wss.on('connection', function(socket) {
      console.log('connection')
      let rtm = new RtmClient('xoxp-254821626421-255344150323-255592928501-523d5e89f3c371e794c2467a4762bbe6');
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
  console.log(req.query.musicid);
  var musicid = req.query.musicid;
  var videoId;
  var name;
  var allMusicNum;
  //DBからyoutubeの動画IDを取得してフロントのyoutube.jsのvideoIdにセット
  Youtube.find({"musicid" : musicid},function(err,youtube){
    if(err) console.log(err);
    videoId = youtube[0].url;
    userid = youtube[0].userid;
    console.log(youtube[0].url);
    console.log(youtube[0].userid);


    Youtube.count(function(err,allMusicNum){
      if(err) console.log(err);
      User.find({"userid" : userid},function(error,user){
        if(err) console.log(err);
        name = user[0].team;
        console.log("User Name: "+name);
        res.json({"videoId": videoId,"username": name,"musicid": musicid,"allMusicNum": allMusicNum});
      });
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



//music DB が空の時に最初の1つめを入れるための臨時エンドポイント
router.post('/slack/bgm', function(req, res, next) {
  console.log('POST request to the /slack/bgm')
  console.log(req.body);
  musicid = musicid + 1;
  res.setHeader('Content-Type', 'application/json');

  var url  = req.body.url;
  var title   = req.body.title; //フロントでスクレイピングする or サーバでスクレイピングする
  var userid   = req.body.userid;
  Youtube.find({ 'musicid' : musicid }, function(err, result){
      if (err) console.log(err);

    // 新規登録
      if (result.length == 0){
        var youtube = new Youtube();

        youtube.musicid = 1;
        youtube.url = url;
        youtube.title = title;
        youtube.userid = userid;

        youtube.save(function(err){
          if (err) console.log(err);
        });
      }
    res.json({ 'status' : 200 });
  });
});


router.post('/commits_regist', function(req, res, next) {
  console.log('POST request to the /commits_regist');
  res.setHeader('Content-Type', 'application/json');

  repo_name = JSON.parse(req.body.payload);
  
    branch_name = repo_name.ref.slice(11);
    console.log(branch_name);
  
    repo_name = repo_name.repository.full_name
  
    console.log(repo_name);
  
    res.send('POST request to the homepage');
  
    repository_url="https://github.com/"+repo_name;
  
    commit_url = commitRegist.commitURL(repository_url);
    commit_list = commitRegist.Test(commit_url);
  
    Commits.find({"name" : repo_name},function(err,result){
      if (err) console.log(err);
      // 新規登録
      if (result.length == 0){
        console.log('commit save');
        var commits = new Commits();
  
        commits.name = repo_name;
        commits.commit = commit_list;
  
        commits.save(function(err){
          if (err) console.log(err);
        });
      }
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
