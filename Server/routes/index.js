var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
var client = require('cheerio-httpcli');//スクレイピング用
var request = require('request');

var WSS = require('ws').Server;

var slackRequests = require('../public/javascripts/server/SlackRequest');

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

// var hostURL = 'https://13.115.41.122:3000';
// var hostURL = 'https://172.20.11.172:3000';
// var hostURL = 'https://192.168.100.32:3000';
var hostURL ='https://192.168.128.102:3000'

var musicid = 0;


// Start the websocket server
var wss = new WSS({ port: 8081 });

var slack_access_token;
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
    AccessToken.find({"id": accessTokenNum-1},function(err,result){
      if (err) console.log(err);
      // let slack_access_token = result.slack;
      console.log(result[0].slack);

      slack_access_token = result[0].slack;
    })
  })
  //そのアクセストークンを使ってwebsocketの開通

  wss.on('connection', function(socket) {
    console.log('Opened connection ');
    let rtm = new RtmClient(slack_access_token);
    slackRequests.startRTM(rtm,slack_access_token,socket);
    // Send data back to the client
    var json = JSON.stringify({ message: 'Gotcha' });
    socket.send(json);

    // When data is received
    socket.on('message', function(message) {
      console.log('Received: ' + message);
    });


    socket.on('onclose', function() {
      console.log('On Close ');
      // wss = new WSS({ port: 8081 });
    });

    // The connection was closed
    socket.on('close', function() {
      console.log('Closed Connection ');
      // wss = new WSS({ port: 8081 });
    });

  });
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
        name = user[0].username;
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
  var schema = req.body.schema;

  MakeSchema.find({'schemaid': schemaid},function(err,result){
    if (err) console.log(err);
    if (result.length == 0){
        var schema = new MakeSchema();

        schema.schemaid = schemaid;
        schema.content  = schema;
        
        schema.save(function(err){
          if (err) console.log(err);
        });
      }
    res.json({ 'status' : 200 });

  })


  //DBから
  res.render('registSchema', { title: 'Express'});
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


//タイマー制限時間セット用エンドポイント
router.post('/regist/limit', function(req, res, next) {
  console.log('POST request to the /regist/limit');
  res.setHeader('Content-Type', 'application/json');

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
