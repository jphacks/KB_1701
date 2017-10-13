var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');

const User = require('../models/user');
const Youtube = require('../models/youtube');
const Team = require('../models/team');
const Message = require('../models/message');

var client_id = '254821626421.255281971077';
var client_secret = '6dbab0ed4bfeb2f602d0831e1edcaf47';
var hostURL = '13.115.35.104:3000';


var musicid = 0;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


//slack appのOAth認証
router.get('/slack/OAth', function(req, res, next) {
  console.log('GET request to the /slack/OAth');
  console.log('code:'+req.query.code+'\n');
  console.log(req.body.access_token+'\n');
  res.redirect('https://slack.com/api/oauth.access?client_id='+client_id
    +'&client_secret='
    +client_secret
    +'&code='+req.query.code
    +'&redirect_uri=https://'+hostURL+'/slack/OAth');
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
});

router.post('/slack/bgm', function(req, res, next) {
  console.log('POST request to the /slack/bgm')
  musicid = musicid + 1;
  res.setHeader('Content-Type', 'application/json');

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
  console.log(req.body);
  res.json(req.body);
});

router.post('/github', function(req, res, next) {
  console.log('POST request to the /github');
  console.log(req.body);
  res.json(req.body);
});

module.exports = router;
