var express = require('express');
var request = require('request');

var accessDB = require('./AccessDB');

//RTM用モジュール
const RtmClient = require('@slack/client').RtmClient;
const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;




module.exports.makeChannnel = function(slack_access_token,chName){
  var options = {
    url: 'https://slack.com/api/channels.create?token='+slack_access_token
      +'&name='+chName,
    json: true
  };

  request.get(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body);
      // res.redirect(hostURL+'/music');//チャンネル生成後は○○へ(今はmusic/loadへ)
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
            if (c.name ==='musicrequest') {
                console.log("\nRegist Channel ID\n");
                channel = c.id 
            }
        }
    console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`);
    });

    rtm.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, function () {
        rtm.sendMessage("Hello!", channel);
    });

    rtm.on(RTM_EVENTS.MESSAGE, function (message) {
        messageJson = JSON.parse(JSON.stringify(message));
        if('message' in messageJson){
            console.log('have attachments field');
        }else if(messageJson.user != 'USLACKBOT'){
            socket.send(JSON.stringify(message));//slackへの投稿をviewへ送信
            accessDB.saveData(channel,messageJson);
            console.log(messageJson);
        }
    });
}
