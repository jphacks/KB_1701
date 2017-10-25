var express = require('express');
var router = express.Router();

const mongoose = require('mongoose');
var client = require('cheerio-httpcli');//スクレイピング用
var request = require('request');
var headers = {'Content-Type':'application/json'};

//自作jsの読み込み
var slackRequests = require('../public/javascripts/server/SlackRequest');
var token = require('../public/javascripts/server/token');
var IPv4 = require('./modules/getMyIP');

const AccessToken = require('../models/accesstoken');

var slack_client_id = '254821626421.255281971077';
var slack_client_secret = '6dbab0ed4bfeb2f602d0831e1edcaf47';

var github_client_id = '9bd1ccc0db7adf39ff87';
var github_client_secret = 'f425b4c195b08d2099ba2e8e2847f8562944324f';


var hostURL = 'https://ec2-13-115-41-122.ap-northeast-1.compute.amazonaws.com:3000';

const User = require('../models/user');


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
      token.slack = slack_access_token;

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
      token.github = github_access_token;
      console.log('Github Token : '+github_access_token+'\n');
      res.redirect(hostURL+'/oauth/save');//Githubのoauth認証後はSlackのチャンネル生成へ
    } else {
      console.log('error: '+ response.statusCode);
    }
  });
});


router.get('/save', function(req, res, next) {
  console.log('GET request to the /oauth/save');
  AccessToken.find({"slack": slack_access_token},function(err,result){
    if (err) console.log(err);
    AccessToken.count(function(err,allAccessTokenNum){
      if (err) console.log(err);
       // 新規登録
      if (result.length == 0){
        var accesstoken = new AccessToken();
        accesstoken.id = allAccessTokenNum-1;
        accesstoken.slack  = slack_access_token;
        accesstoken.github = github_access_token; 
        
        accesstoken.save(function(err){
          if (err) console.log(err);
        });
      }
    })
  });
  console.log('Slack Token : '+slack_access_token+'\n');
  console.log('Github Token : '+github_access_token+'\n');


  var options = {
    url: 'https://slack.com/api/users.list?token='+ slack_access_token,
    json: true
  };

  request.get(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      for (const m of body.members) {
        console.log(m.name + ' : ' + m.id);
        User.find({"userid":m.id},function(err,result){
          if(result.length == 0){
            var user = new User();
            
            user.userid = m.id;
            user.username  = m.name;
            
            user.save(function(err){
              if (err) console.log(err);
            });
          }else if (result.length == 1){
            
          }
        })
      }
      res.redirect(hostURL+'/oauth/makechannel');//チャンネル生成後は/regist/schemaへ  
    } else {
      console.log('error: '+ response.statusCode);
    }
  });
});




router.get('/makechannel', function(req, res, next) {
  console.log('GET request to the /oauth/makechannel');
  console.log('Slack Token : '+slack_access_token+'\n');
  console.log('Github Token : '+github_access_token+'\n');

  slackRequests.makeChannnel(slack_access_token,'music');
  slackRequests.makeChannnel(slack_access_token,'self_introduction');
  slackRequests.makeChannnel(slack_access_token,'all_fukuoka');
  slackRequests.makeChannnel(slack_access_token,'all_kobe');

  res.redirect(hostURL+'/regist/schema');//チャンネル生成後は/regist/schemaへ
  
});
module.exports = router;
