const express = require('express');
const router = express.Router();
const os = require('os');
const mongoose = require('mongoose');
const moment = require('moment');
const ipv4 = require('./modules/getMyIP');
const liveInfo = require('../models/liveInfo');

// skywayをnode向けに少しだけ変えたファイルを読み込む
require('../public/javascripts/SkyWay-MultiParty-master/dist/multiparty.node');

// speaker stanby
router.get('/', function(request, response){
    console.log("catch the sendToSpeakerJS request");

    // 10〜25個の文字列数と組み込む英数字をランダムに生成
    const num = Math.floor( 10 + Math.random() * 15 );
    let str = 'abcdefghijklmnopqrstuvwxyz'
            + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
            + '0123456789';
    str = str.split('');
    let $rand_str = '';
    for(let i = 0; i < num; i++) {
	$rand_str += str[Math.floor(Math.random() * str.length)];
    }

    // 自身のipを取得
    const ip = ipv4.getMyIP();
    console.log(ip);

    // //生成パラメータをutf-8エンコードして新規URL発行
    const randomId = encodeURIComponent($rand_str);
    const url = 'https://'+ ip +':3000/live/onAir?id='+ randomId;
    const room = "roomNo" + randomId;

    liveInfo.find({ "peerID" : randomId }, function(err, result){
	if (err)
	    console.log(err);
	
	// DBにliveInfoを格納．liveInfoの構造は以下を想定している
	// liveInfo = {
	//     room   : room,
	//     peerID : randomId,
	//     area   : String,
	//     open   : Date,
	// }

	if (result.length == 0){
	    let liveinfo = new liveInfo();

	    liveinfo.room     = room;
	    liveinfo.peerID   = randomId;
	    liveinfo.onAir    = true;

	    liveinfo.save(function(err){
		if (err) console.log(err);
		
		// リダイレクト
		response.render('redirect', { 'action' : url });
	    });
	}
	// peerIDが被っている場合
	else{
	    response.render('error', { 'errorCode': "already exsited"});
	}
    });
});

// speaker on air
router.get('/onAir', function(request, response){
    console.log("catch the redirect");
    
    const peerID = request.query.id;

    // DBからliveInfoを引当
    liveInfo.find( { "peerID" : peerID }, function(err, result){
	if (err)
	    console.log(err);
	
	// DBに存在しない場合
	if (result.length == 0){
	    console.log("no match");
	    response.render('error', { 'errorCode' : "No match"});
	}
	// DBから引当
	else{
	    if (result.length != 1){
		console.log("Duplication");
		response.render('error', { 'errorCode' : "Duplication in DB"});
	    }
	    else{
		const room     = result[0].room;
		const peerID   = result[0].peerID;
		const openTime = result[0].open;

		console.log("render speaker");
		response.render('speaker', 
				{ 
				    'room'    : room,
				    'peerID'  : peerID,
				    'openTime': openTime });
	    }
	}
    });
});

// slack comment for lablive
router.post('/liveComment', function(request, response){

    const username = request.query.username;
    const message  = request.query.message;

    // Areaをuserと紐付けてroomIDを取得するのか
    // slackのchannelをpostしてもらってroomIDを引き当てるのか
    // いずれにしてもroomIDの取得方法は要検討

    const multiparty = new MultiParty( {
	"key": "30c1f21a-2b6e-4200-97d2-74206e85c4f7",
	"reliable": true,
	"room": room,
	"debug": 3
    });

    multiparty.on('ms_close', function(peer_id) {
	$("#"+peer_id).remove();
    });

    multiparty.on('error', function(err) {
	console.log(err);
	alert(err);
    });

    multiparty.start();

    const nowTime = new Date();
    const watchingTime = {
	hh : ( "00" + Math.floor( 
	    nowTime.getTime() / ( 1000*60*60 ) % 24	
	)).slice(-2),

	mm : ( "00" + Math.floor( 
	    nowTime.getTime() / ( 1000*60 ) % 60	
	)).slice(-2),

	ss : ( "00" + Math.floor( 
	    nowTime.getTime() / ( 1000 ) % 60	
	)).slice(-2)
    };
    const data = {
	date    : watchingTime,
	username: username,
	message : message
    };

    multiparty.send(data);

});

// speaker log out
router.post('/logout', function(request, response){
    console.log("catch the speaker logout");

    const peerID = request.body.peerID;

    liveInfo.remove(
	{ "peerID" : peerID }, function(err, result){
	    if (err)
		console.log(err);

	    console.log('deleted the document with '+ peerID);
	});
});

module.exports = router;
