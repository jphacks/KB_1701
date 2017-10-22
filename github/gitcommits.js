function GETRequest(options,callback){
  var https = require("https");
  var response;
  var request = https.request(options, function(response){
  var body = '';
  response.on("data", function(chunk){
      body += chunk.toString('utf8');
  });

  response.on('end', function () {
    // callbackでJSONに変換して返す
    callback(JSON.parse(body));
  });
  }).end();
}

function getOptionsForCommitList(username,reponame){
  var options = {
    host: 'api.github.com',
    path:   '/repos/' + username +'/'+ reponame + '/commits',
    method: 'GET',
    headers: {'user-agent': 'node.js'}
  };
  return options;
}

function getOptionsForSingleCommits(options,commit_list){
  var single_commit_options = new Array(commit_list.length);
  console.log(commit_list.length);
  for (var i = 0; i < commit_list.length; i++) {
    single_commit_options[i] = new Array();
    // optionsをsingle_commit_optionsにコピー
    for (var opt in options) {
      single_commit_options[i][opt]=options[opt];
    }
    // パスにshaを追加
    single_commit_options[i].path = options.path + '/'+commit_list[i].sha;
  }
  return single_commit_options;
}

function getNameFromJSON(single_commit){
  var name = new Array(single_commit.length);
  for (var i = 0; i < single_commit.length; i++) {
    name[i] = single_commit[i].commit.author.name;
  }
  return name;
}

function getChangeFromJSON(single_commit){
  var change = new Array(single_commit.length);
  for (var i = 0; i < single_commit.length; i++) {
    change[i] = single_commit[i].stats.total;
  }
  return change;
}

function getDateFromJSON(single_commit){
  var date = new Array(single_commit.length);
  for (var i = 0; i < single_commit.length; i++) {
    date[i] = single_commit[i].commit.committer.date;
  }
  date=parseUnixTime(date);
  return date;
}

function parseUnixTime(date){
  var unixtime = new Array(date.length);
  for (var i = 0; i < date.length; i++) {
    date_split = date[i].split("T");
    ymd = date_split[0].split("-");
    hms = date_split[1].split(":");

    year = ymd[0];
    month = ymd[1];
    day = ymd[2];

    hour = hms[0];
    minute = hms[1];
    second = hms[2].substring(0,hms[2].length-1);
    // github apiで帰ってくるdateは世界標準時だと思われるので日本との時差9時間を加算
    unixtime[i] = new Date(year,month,day,hour,minute,second).getTime()+9*60*60*1000;
  }
  return unixtime;
}

repository_url="https://github.com/AkihiroKanda/gitproject";

var username = 'tomoki-hirai';
var reponame = 'test';

options = getOptionsForCommitList(username,reponame);

GETRequest(options,function (commit_list)
{
  console.log(commit_list);
    // commit_listからsingle_commitsを取得するためのoptions
  single_commit_options = getOptionsForSingleCommits(options,commit_list);
  // console.log(single_commit_options[0].path);
  single_commits = new Array(0);
  // 全てのsingle_commitを取得したかを確認する用
  var n=0;
  for (var i = 0; i < commit_list.length; i++) {
    GETRequest(single_commit_options[i],function (single_commit){
      single_commits.push(single_commit);
      n++;
      // single_commitを全て取得した後の処理
      if (n==commit_list.length) {
        console.log(single_commits);
        // JSONから各種データを取得
        name=getNameFromJSON(single_commits);
        change=getChangeFromJSON(single_commits);
        date=getDateFromJSON(single_commits);
        console.log(name);
        console.log(change);
        console.log(date);
      }
    });
  }
});
