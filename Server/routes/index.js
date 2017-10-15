var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
var client = require('cheerio-httpcli');//スクレイピング用
var request = require('request');

const User = require('../models/user');
const Youtube = require('../models/youtube');
const Team = require('../models/team');
const Message = require('../models/message');


// var hostURL = 'https://13.115.41.122:3000';
var hostURL = 'https://172.20.11.172:3000';
// var hostURL = 'https://localhost:3000';

var musicid = 0;

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("GET request to the /")
  res.render('index',{ title: 'Express'});
});

router.get('/music', function(req, res, next) {
  console.log("GET request to the /music")
  //DBから
  res.render('music', { title: 'Express'});
});

router.get('/music/load', function(req, res, next) {
  console.log("GET request to the /music/load")
  //DBからyoutubeの動画IDを取得してフロントのyoutube.jsのvideoIdにセット

  
  res.redirect(hostURL+'/music');
});


/* POST home page. */
router.post('/', function(req, res, next) {
  console.log('POST request to the index');
  console.log(req.body);
  res.send('POST request to the index');
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

router.post('/slack/bgm', function(req, res, next) {
  console.log('POST request to the /slack/bgm')
  musicid = musicid + 1;
  res.setHeader('Content-Type', 'application/json');

  //ここでスクレイピングを実施
  client.fetch(req.body.url, function (err, $, res) {
    // HTMLタイトルを表示
    console.log($('simpleText').text());
    
  });

  // var musicid = musicid; //musicidは node.js側で連番をふるべき
  var url  = req.body.url;
  var title   = req.body.title; //フロントでスクレイピングする or サーバでスクレイピングする
  var userid   = req.body.userid;
  Youtube.find({ 'musicid' : musicid }, function(err, result){
      if (err) console.log(err);

    // DBにyoutubeを格納．youtubeの構造は以下の通り
    // youtube = {
    //     musicid : musicid
    //     url : url;
    //     title : title;
    //     userid : userid;
    // }

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
    res.json({ 'status' : 200 });
  });
});

router.post('/slack/help', function(req, res, next) {
  console.log('POST request to the /slack/help');
  console.log(req.body.challenge);
  res.send(req.body.challenge);
});

router.post('/slack/events', function(req, res, next) {
  console.log('POST request to the /slack/events');
  console.log(req.body.challenge);
  res.send(req.body.challenge);
});

router.post('/github', function(req, res, next) {
  console.log('POST request to the /github');
  console.log(req.body);
  res.json(req.body);
});

module.exports = router;
