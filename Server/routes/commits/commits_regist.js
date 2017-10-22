
function Test(url){
  //asyncをrequire
  var async = require('async');
  //requestをrequire
  var request = require("request");

  async.waterfall([
  function(callback) {

    console.log('1');
    // 受け取りようの引数
    var responseDate = undefined;

    var get_sha_url = url+"?sha="+branch_name;
    // 同期通信でGETリクエスト
    request.get({
      url: get_sha_url,
      headers: {
        'User-Agent': 'request',
        'Authorization':'token c2d3babdfc93816c0a8f83b0694be2bfa3c9e1b6'
      },
      json:true
    }, function (error, response, body) {
      //console.log(error);
      responseDate = body;
      callback(null,responseDate);
    });
  },
  function(commit_list,callback){//すでにcommitsコレクションに格納されているshaの一覧を取得
    var already_commits_list = [];

    Commits.find({},function(err,docs){
      for (var i=0,size=docs.length;i<size;++i){
        for(var j = 0;j<docs[i].commit.length;j++){
          already_commits_list[j] = docs[i].commit[j].sha;
        }
      }
      callback(null,commit_list,already_commits_list);
    });
  },
  function(commit_list,already_commits_list,callback){

    let regist_commit_list = [];

    // console.log(commit_list);
    // console.log(already_commits_list);

    for (var i = 0; i < commit_list.length;i++) {
      var judge_flag = 0;//shaがすでにcommitコレクションに格納されているかを判断するためのフラグ
      for(var j = 0;j < already_commits_list.length;j++){

        if(commit_list[i].sha == already_commits_list[j]){
          judge_flag = 1;
        }
      }
      if(judge_flag == 1){
        break;
      }else {
        regist_commit_list[i] = commit_list[i].sha;
      }
    }
    callback(null,regist_commit_list);
  },
  function(regist_commit_list, callback) {

    console.log(regist_commit_list);
    console.log("--------------------------");

    // owner/repo/commitsのshaでurlを生成
    var single_commit = new Array(regist_commit_list.length);
    var count = 0;

    let commits_data = [];//全コミットの情報を格納する変数

    //for (var i = 0; i < 1;i++) {
    for (var i = 0; i < regist_commit_list.length;i++) {
      var single_commit_url=url+"/"+regist_commit_list[i];

      // 同期通信でGETリクエスト
      request.get({
        url: single_commit_url,
        headers: {
          'User-Agent': 'request',
          'Authorization':'token c2d3babdfc93816c0a8f83b0694be2bfa3c9e1b6'
        },
        json:true
      }, function (error, response, body) {

        let commit_data = new Object();//各コミットの情報を格納する変数

        console.log(count);
        single_commit[count]=body;

        commit_data.sha = body.sha;
        commit_data.comment = body.commit.message;
        commit_data.name = body.commit.committer.name;
        commit_data.time = body.commit.committer.date;
        commit_data.additions = body.stats.additions;
        commit_data.deletions = body.stats.deletions;
        commit_data.total = body.stats.total;

        commits_data[count] = commit_data;

        if(count == regist_commit_list.length-1){
          //console.log(commits_data[2]);
          callback(null,commits_data);
        }
        count+=1;
      });
    }
  }
], function(err, result) {
  if (err) {
    throw err;
  }
  console.log('all done.');
  //console.log(result);

  for(let i = 0;i<result.length;i++){
    result[i].time = parseUnixTime(result[i].time);
  }
  console.log(result);
  registCommit(result);

});
}

//引数のurlにGETリクエストを送信してcontributorsを返す関数
function GETContributos(url){
  //requestをrequire
  var request = require("request");
  // 受け取りようの引数
  var responseDate = undefined;
  // 同期通信でGETリクエスト

  request.get({
    url: url,
    headers: {
      'User-Agent': 'request'
    },
  }, function (error, response, body) {
    console.log(error);
    console.log(body);
    var responseDate = new Array(body.length);
    for(var i = 0;i<body.length;i++){
      responseDate = body[i].login;
    }
  });
  return responseDate;
}


//引数のURLにGETリクエストを送信する関数
function GETRequest(url){
  //requestをrequire
  var request = require("request");
  // 受け取りようの引数
  var responseDate = undefined;
  // 同期通信でGETリクエスト

  request.get({
    url: url,
    headers: {
      'User-Agent': 'request'
    },
  }, function (error, response, body) {
    console.log(error);
    console.log(body);
    responseDate = body;
  });
  return responseDate;
}

function getCommitList(url,callback){
  // リポジトリ名でurl生成する予定
  var response = GETRequest(url);
   return callback(url,response);
}

var getCommitInfo = function (url,commit_list){
  // owner/repo/commitsのshaでurlを生成
  var single_commit = new Array(commit_list.length);
  for (var i = 0; i < commit_list.length; i++) {
    var single_commit_url=url+"/"+commit_list[i].sha;
    response = GETRequest(single_commit_url);
    // document.write(response+"<BR>");
    single_commit[i]=response;
  }
  return single_commit;
}

function getDate(single_commit){
  var date = new Array(single_commit.length);
  for (var i = 0; i < single_commit.length; i++) {
    date[i] = single_commit[i].commit.committer.date;
    //document.write(single_commit[i].commit.committer.date+"<BR>");
  }
  parseUnixTime(date);
  return date;
}

function parseUnixTime(date){

console.log(date);

  date_split = date.split("T");

console.log(date_split[0]+":"+date_split[1]);

  ymd = date_split[0].split("-");
  hms = date_split[1].split(":");

  year = ymd[0];
  month = ymd[1];
  day = ymd[2];

  hour = hms[0];
  minute = hms[1];
  second = hms[2].substring(0,hms[2].length-1);
  // github apiで帰ってくるdateは世界標準時だと思われるので日本との時差9時間を加算
  var unixtime = new Date(year,month,day,hour,minute,second).getTime()+9*60*60*1000;
  //document.write(unixtime);
  return unixtime;
}

function commitURL(repository_url){
  var github_url = "https://github.com";
  // owner/repoの形
  repositoty_name = repository_url.substring(github_url.length+1,repository_url.length);
  // リクエスト先URL
  commit_url = "https://api.github.com/repos/"+repositoty_name+"/commits";
  return commit_url;
}

function registCommit(commits_data){

  var commits = new Commits();

  var commits_list;

  Commits.find({name:repo_name},function(err,docs){
    if(docs.length==1){
      commits_list = docs[0];

      for(let i = 0;i < commits_data.length;i++){
        commits_list.commit.push(commits_data[i]);
      }

      console.log(commits_data);
      console.log("ドキュメントを更新");
      Commits.update(
        { name:repo_name},
        { $set:{ commit: commits_list.commit } },
        function(err) {
          if (err) throw err;
          Commits.find({},function(err,docs){
                	for (let l=0,size=docs.length;l<size;++l){
                        	console.log(docs[l]);
                	}
        	});
        });

    }else{
      console.log("新しいドキュメントを作成");
      commits.name = repo_name;
      commits.commit = commits_data;

      commits.save(function(err){
      	if(err){console.log(err);}

      	Commits.find({},function(err,docs){
              	for (let k=0,size=docs.length;k<size;++k){
                      	console.log(docs[k]);
              	}
      	});
      });

    }
  });
}


var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var mongoose = require('mongoose');



//モデルの宣言
var Commits = require('../../models/commits');

router.use(bodyParser.urlencoded({
    extended: true
}));
router.use(bodyParser.json());

router.post('/', function(request, response){

  // リクエストボディを出力

  repo_name = JSON.parse(request.body.payload);

  branch_name = repo_name.ref.slice(11);
  console.log(branch_name);

  repo_name = repo_name.repository.full_name

  console.log(repo_name);

  response.send('POST request to the homepage');

  repository_url="https://github.com/"+repo_name;

  commit_url = commitURL(repository_url);
  commit_list = Test(commit_url);

});

module.exports = router;
