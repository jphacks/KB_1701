var express = require('express');
var request = require('request');

var accessDB = require('./AccessDB');
var ToJson = require('./TextToJson')

//RTM用モジュール
const RtmClient = require('@slack/client').RtmClient;
const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;

//DBスキーマ
const User = require('../../../models/user');
const Youtube = require('../../../models/youtube');
const Team = require('../../../models/team');
const Message = require('../../../models/message');
const Channel = require('../../../models/channel');

var channelName;

module.exports.getIcon = function(slack_access_token){
  var options = {
    url: 'https://slack.com/api/team.info?token='+slack_access_token,
    json: true
  };

  request.get(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body);
      // JSONから画像のURL取得
      console.log(body.team.icon.image_230);
    } else {
      console.log('error: '+ response.statusCode);
    }
  });
}

module.exports.makeChannnel = function(slack_access_token,chName){
  var options = {
    url: 'https://slack.com/api/channels.create?token='+slack_access_token
      +'&name='+chName,
    json: true
  };

  request.get(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body);
      // ここで作成したチャンネルのchannelIdとchannelNameをDBに登録
      // accessDB.saveChannel(body.channel.id,body.channel.name);
    } else {
      console.log('error: '+ response.statusCode);
    }
  });
}


module.exports.startRTM = function(rtm,slack_access_token,socket){
    rtm.start();
    rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, function (rtmStartData) {
        for (const c of rtmStartData.channels) {
            console.log(c.name + ' : ' + c.id);
            accessDB.saveChannel(c.id,c.name);
            if (c.name =='test') {
                console.log("\nRegist Channel ID\n");
                channel = c.id
            }
        }
    console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`);
    });

    rtm.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, function () {
        // rtm.sendMessage("Hello!", 'C7GMP2G2G');
        console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa connect")
    });


    rtm.on(CLIENT_EVENTS.RTM.DISCONNECT, function () {
        console.log('ws closed');
    });

    rtm.on(RTM_EVENTS.MESSAGE, function (message) {
        messageJson = JSON.parse(JSON.stringify(message));
        if('message' in messageJson){
            console.log('have attachments field');
        }else if(messageJson.user != 'USLACKBOT'){
            Channel.find({"channelId": messageJson.channel},function(err,result){
                console.log(message.channel);
		channelName = result.channelName;
            })


            if(channelName == 'self_introduction'){
                //自己紹介チャンネルにメッセージが届いた時
                console.log(messageJson);
                let user = ToJson.textToJson(messageJson);
                console.log(user);
                var userJson = JSON.parse(JSON.stringify(user));

                User.find({"userid":userJson.userid},function(err,result){
                    if (result.length == 0){
                        var user = new User();
                        user.userid = userJson.userid;
                        user.name = userJson.username;
                        user.team = userJson.teamName;
                        user.githubAccount = userJson.github;
                        user.specialty = userJson.specialty;
                        user.tobacco = userJson.tobacco;
                        user.save(function(err){
                          if (err) console.log(err);
                        });
                      }
                } );
            }else if(channelName == 'music'){
                //musicチャンネルにメッセージが届いた時
                console.log('on music');
                accessDB.saveData(messageJson.channel,messageJson);
                console.log(messageJson);
            }else if(channelName == 'help'){
                //helpチャンネルにメッセージが届いた時
                socket.send(JSON.stringify(message));//slackへの投稿をviewへ送信
                console.log(messageJson);
            }else if(channelName == 'all_kobe'){ //今はrandom
                //all_kobeチャンネルにメッセージが届いた時
                // console.log(messageJson.file.url_private);
                socket.send(JSON.stringify(message));//slackへの投稿をviewへ送信
                // console.log(messageJson);
            }else if(channelName == 'all_fukuoka'){

            
            }else{
                console.log(messageJson);
                let user = ToJson.textToJson(messageJson);
                console.log(user);
                
            }
        }
    });
}
