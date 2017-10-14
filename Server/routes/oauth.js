var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
var client = require('cheerio-httpcli');//スクレイピング用
var request = require('request');

const User = require('../models/user');
const Youtube = require('../models/youtube');
const Team = require('../models/team');
const Message = require('../models/message');


var slack_client_id = '254821626421.255281971077';
var slack_client_secret = '6dbab0ed4bfeb2f602d0831e1edcaf47';

var github_client_id = '9bd1ccc0db7adf39ff87';
var github_client_secret = 'f425b4c195b08d2099ba2e8e2847f8562944324f';

// var hostURL = 'http://13.115.41.122:3000/oauth';
var hostURL = 'https://172.20.11.172:3000/oauth';

var slack_access_token;
var github_access_token;


var musicid = 0;

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("GET request to the /")
  res.render('index', 
    { title: 'Express' ,
      token: ""
    });
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



//slack appのoauth認証
router.get('/slack', function(req, res, next) {
  console.log('GET request to the /oauth/slack');

  var options = {
    url: 'https://slack.com/api/oauth.access?client_id='+slack_client_id
      +'&client_secret='+slack_client_secret
      +'&code='+req.query.code
      +'&redirect_uri='+hostURL+'/slack',
    json: true
  };

  request.get(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      slack_access_token = body.access_token;
      console.log('Slack Token : '+slack_access_token+'\n');
      res.redirect('https://github.com/login/oauth/authorize?'
        +'client_id='+github_client_id
        +'&redirect_uri='+hostURL+'/github');//Slackのoauth認証後はGithubのoauth認証へ
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
      res.redirect(hostURL+'/makechannel');//Githubのoauth認証後はSlackのチャンネル生成へ
    } else {
      console.log('error: '+ response.statusCode);
    }
  });
});


router.get('/makechannel', function(req, res, next) {
  console.log('GET request to the /oauth/makechannel');
  console.log('Slack Token : '+slack_access_token+'\n');
  console.log('Github Token : '+github_access_token+'\n');

  
  var options = {
    url: 'https://slack.com/api/channels.create?token='+slack_access_token
      +'&name=joinHirai',
    json: true
  };

  request.get(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body);
      res.redirect(hostURL+'/music/load');//チャンネル生成後は○○へ(今はmusic/loadへ)
    } else {
      console.log('error: '+ response.statusCode);
    }
  });
});

module.exports = router;
