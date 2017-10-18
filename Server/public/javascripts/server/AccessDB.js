const mongoose = require('mongoose');

//DBスキーマ
const User = require('../../../models/user');
const Youtube = require('../../../models/youtube');
const Team = require('../../../models/team');
const Message = require('../../../models/message');
const Channel = require('../../../models/channel');

var musicid = 0;

module.exports.saveChannel = function(chID,chName){
    Channel.find({ 'channelId' : chID},function(err,result){
        if (err) console.log(err);
            // 新規登録
            if (result.length == 0){
                var channel = new Channel();

                channel.channelId = chID;
                channel.channelName = chName;
                  
                channel.save(function(err){
                if (err) console.log(err);
                });
            }
    });
}
module.exports.saveData = function(chID,data){
    
    if(data.channel == chID){
        
        let videoID = data.text.substring(33,44);//textからvideoIDのみを抽出，videoIDはすべての動画で11桁
        musicid = musicid + 1;
        // var musicid = musicid; //musicidは node.js側で連番をふるべき
        var url  = videoID;
        var title   = 'test title'; //フロントでスクレイピングする or サーバでスクレイピングする
        var userid   = data.user;


        // DBにyoutubeを格納．youtubeの構造は以下の通り
        // youtube = {
        //     musicid : musicid
        //     url : url;
        //     title : title;
        //     userid : userid;
        // }
        Youtube.find({ 'musicid' : musicid }, function(err, result){
            if (err) console.log(err);
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
        });
    }

}