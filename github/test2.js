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

    // 同期通信でGETリクエスト
    request.get({
      url: url,
      headers: {
        'User-Agent': 'request'
      },
      json:true
    }, function (error, response, body) {
      //console.log(error);
      responseDate = body;
      callback(null,responseDate);
    });
  },
  function(commit_list, callback) {
    console.log('2');
    console.log(commit_list.length);

    // owner/repo/commitsのshaでurlを生成
    var single_commit = new Array(commit_list.length);
    var count = 0;
    for (var i = 0; i < commit_list.length;i++) {
      var single_commit_url=url+"/"+commit_list[i].sha;

      console.log(commit_list[i].sha);

      // 同期通信でGETリクエスト
      request.get({
        url: single_commit_url,
        headers: {
          'User-Agent': 'request'
        },
        json:true
      }, function (error, response, body) {
        console.log("test");
        console.log(count);
        single_commit[count]=body;
        if(count == commit_list.length-1){
          console.log('3');
          callback(null,single_commit);
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
  console.log(result);
  registCommit();
});
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

function getName(single_commit){
  var name = new Array(single_commit.length);

  for (var i = 0; i < single_commit.length; i++) {
    name[i] = single_commit[i].commit.author.name;
    //document.write(single_commit[i].commit.author.name+"<BR>");
  }
  return name;
}

function getChange(single_commit){
  var change = new Array(single_commit.length);
  for (var i = 0; i < single_commit.length; i++) {
    change[i] = single_commit[i].stats.total;
    //document.write(single_commit[i].stats.total+"<BR>");
  }
  return change;
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
  date_split = date[0].split("T");
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

function member(name){
  this.name = name;
  this.commitCount = 0;
  this.commit = Array();
}

function getCommitInfo(single_commit){

  var name = new Array(single_commit.length-1);
  var change = new Array(single_commit.length-1);
  var date = new Array(single_commit.length-1);

  //最初のコミットを取り除くため
  for (var i = 1; i < single_commit.length; i++) {
    name[i] = single_commit[i].commit.author.name;
    change[i] = single_commit[i].stats.total;
    date[i] = single_commit[i].commit.committer.date;
    for(var j = 0;j < group.length;j ++){
      if(group[j].name == name[i]){
        var commit = new Object();
        commit["change"] = change[i];
        commit["date"] = date[i];
        group[j].commit.push(commit);
        group[j].commitCount += 1;
      }
    }
  }

  //ソート時に代入するための一時的な変数
  var num = new member("num");

  for(var i = 0;i < group_member.length;i ++){
    for(var j = i;j < group_member.length;j ++){
      if(group[j].commitCount > group[i].commitCount){
        num = group[i];
        group[i] = group[j];
        group[j] = num;
      }
    }
  }
}

function commitURL(repository_url){
  var github_url = "https://github.com";
  // owner/repoの形
  repositoty_name = repository_url.substring(github_url.length+1,repository_url.length);
  // リクエスト先URL
  commit_url = "https://api.github.com/repos/"+repositoty_name+"/commits";
  return commit_url;
}

function registCommit(){

  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;

  var Zukan = new Schema({
      username : { type: String, require: true, unique: true },
      password : { type: String, require: true }
  });

  mongoose.model('Zukan',Zukan);

  //使用フェーズ
  const mongodbUri = "mongodb://localhost/test";
  const mongOptions = {
    useMongoClient: true,
    socketTimeoutMS: 0,
    keepAlive: true,
    reconnectTries: 30};
  mongoose.Promise = global.Promise;
  mongoose.connect(mongodbUri, mongOptions);

  var Zukan = mongoose.model('Zukan');
  var zukan = new Zukan();
  zukan.username = 'test7';
  zukan.password = 'testtest';

  zukan.save(function(err){
  	if(err){console.log(err);}

    //※注意：イベント駆動
  	Zukan.find({},function(err,docs){
          	for (var i=0,size=docs.length;i<size;++i){
                  	console.log(docs[i].username);
          	}
  	});
  });
}


// httpモジュールを読み込み、インスタンスを生成
var http = require('http');

// HTTPサーバーのイベントハンドラを定義
http.createServer(function (req, res) {

  console.log("test");

  var querystring = require('querystring');

  console.log("-------------------------------------------");

        var data = '';
        //readableイベントが発火したらデータにリクエストボディのデータを追加
        req.on('readable', function(chunk) {
            data += req.read();
        });
        //リクエストボディをすべて読み込んだらendイベントが発火する。
        req.on('end', function() {
            //パースする
            querystring.parse(data);
            res.end(data);
        });

        console.log("-------------------------------------------");

  repository_url="https://github.com/AkihiroKanda/gitproject";
  commit_url = commitURL(repository_url);
  commit_list = Test(commit_url);
  // document.write(commit_url+"<BR>");
  //single_commit=getSingleCommits(commit_url,commit_list);
  // document.write(single_commit+"<BR>");

  group_member = ["tomoki-hirai","ttpeanuts","Akihiro Kanda"];

  //getCommitInfo(single_commit);

  // for (var i = 0;i < group_member.length;i ++){
  //   console.log(group[i].name+" "+group[i].commit[0].change+" "+group[i].commitCount);
  // }


}).listen(20000); // 127.0.0.1の20000番ポートで待機
