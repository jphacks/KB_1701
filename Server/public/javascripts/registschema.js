var data={}
var id=1;
var fs = require('fs');
var endpoint = 'https://192.168.128.102:3000/regist/schema';

function add(){
    var div_element = document.createElement("div");
    div_element.innerHTML = '<input type="text" name="title" size="20" value="作りたいキー">  <input id="text'+id+'" type="text" name="title" size="20" value="作りたいキー">   <button onclick="add();">このボタンを押して動的にUIを追加！</button>';
    var parent_object = document.getElementById("entry");
    parent_object.appendChild(div_element);

    // ChangeTxt(document.getElementById("text"+String(id-1)).value);
    addToJSON(document.getElementById("text"+(id-1)).value);
    // alert(id);
    id++;

    var data = "write text test!";
    fs.writeFile('test.txt', data , function (err) {
        console.log(err);
    });alert('aaa');
}
function ChangeTxt() {
  var first_flag=true;
  var userid='userid: {type: String, require: true, unique: true},<br>&nbsp;'
  for (var key in data) {
    if (first_flag) {
      var txt='{';
      txt += userid;
      txt += key+':'+data[key];
      first_flag=false;
    }else{
      txt += ','+'<br>&nbsp;'+key+':'+data[key];
    }
  }
  txt+='<br>}';
  document.getElementById("text").innerHTML=txt;
    postrequest(txt);
}

function addToJSON(key){
  data[key]="{type: String}";
  // json=JSON.stringify(data);
  // alert(json);
  ChangeTxt();
}
function postrequest(txt){
  var array={limitid:'',year:'',month:'',day:'',hour:'',minute:''};
data=JSON.stringify(array);
var request = new XMLHttpRequest();
var url = endpoint;
request.open("POST",url,true);
request.setRequestHeader('Content-Type', 'application/json');
request.onreadystatechange = function() {//Call a function when the state changes.
    if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
        alert('ok')
    }
}

request.send(data);
}
