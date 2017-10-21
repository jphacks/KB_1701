const express = require('express');

// substitution table
const substitution = {
    '名前' : 'name',
    'ニックネーム' : 'nickname',
    'チーム名' : 'teamName',
    'githubアカウント': 'github',
    '得意分野': 'specialty',
    'たばこ' : 'tobacco'
};

exports.textToJson = function(messageJson){

    let selfIntroMesg = messageJson.text;
    let selfIntroJson = {};

    // change '\n' to ','
    selfIntroMesg = selfIntroMesg.replace(/\r?\n/g, ',');

    // change DBCS to SBCS
    if ( selfIntroMesg.match(/：/) ){
	selfIntroMesg = selfIntroMesg.replace(/：/g, ':');
    }
    if ( selfIntroMesg.match(/　/) ){
	selfIntroMesg = selfIntroMesg.replace(/　/g, ' ');
    }
    if ( selfIntroMesg.match(/，/) ){
	selfIntroMesg = selfIntroMesg.replace(/，/g, ',');
    }
    
    let colonSplitedArray = selfIntroMesg.split(':');
    let commaSplitedArray = new Array();
    for (let i = 0; i < colonSplitedArray.length; i++){
	// commaSplitedArray = [ 
	//     ['名前'],
	//     ['田中太郎', 'ニックネーム'],
	//     ['タロ', '得意分野'],
	//     ['A','B','C','たばこ']
	// ];
	commaSplitedArray.push(colonSplitedArray[i].split(','));
    }

    console.log(commaSplitedArray);

    for (let i = 0; i < commaSplitedArray.length - 1; i++){
	let temp = Array.from(commaSplitedArray[i + 1]);
	let lastElem = commaSplitedArray[i][commaSplitedArray[i].length - 1];
	let excludingLastElems = Array.from(temp);

	if ( i + 1 != commaSplitedArray.length - 1 ){
	    excludingLastElems.pop();
	}
	lastElem = lastElem.trim();
	for(let j = 0; j < excludingLastElems.length; j++){
	    excludingLastElems[j] = excludingLastElems[j].trim();
	}
	if (substitution[lastElem]) {
	    commaSplitedArray[i][commaSplitedArray[i].length - 1] = substitution[lastElem];
	    let key = substitution[lastElem];
	    let temp = Array.from(excludingLastElems);
	    let value = '';

	    for (let j = 0; j < temp.length; j++){
		value += (temp[j] + ',');
		if (j == temp.length - 1){
		    value = value.slice(0, -1);
		}
	    }
	    console.log('key: '+key+', value: '+value);
	    selfIntroJson[key] = value;
	}
    }
    console.log(selfIntroJson);
    return selfIntroJson;
};

