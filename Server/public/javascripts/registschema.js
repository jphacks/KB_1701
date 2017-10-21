var content_array={}
var id=1;
var endpoint = 'https://192.168.128.102:3000/regist/schema';
// var endpoint = 'https://localhost:3000/regist/schema';
var userid_key='userid'
var userid_value='{type: String, require: true, unique: true}'
addToJSON(userid_key,userid_value)
function add(){
    var div_element = document.createElement("div");
    div_element.innerHTML = '<input type="text" name="title" size="20" value="作りたいキー">  <input id="text'+id+'" type="text" name="title" size="20" value="作りたいキー">   <button onclick="add();">このボタンを押して動的にUIを追加！</button>';
    var parent_object = document.getElementById("entry");
    parent_object.appendChild(div_element);

    // changeTxt(document.getElementById("text"+String(id-1)).value);
    addToJSON(document.getElementById("text"+(id-1)).value,'{type: String}');
    // alert(id);
    id++;

    var content_array = "write text test!";
    fs.writeFile('test.txt', content_array , function (err) {
        console.log(err);
    });alert('aaa');
}
function changeTxt() {
  var first_flag=true;

  for (var key in content_array) {
    if (first_flag) {
      var txt='{';
      txt += userid_key;
      txt += key+':'+content_array[key];
      first_flag=false;
    }else{
      txt += ','+'<br>&nbsp;'+key+':'+content_array[key];
    }
  }
  txt+='<br>}';
  document.getElementById("text").innerHTML=txt;
    postrequest(txt);
}

function addToJSON(key,value){
  content_array[key]=value;
  changeTxt();
}
function postrequest(txt){
  var array={schemaid:'',content:''};
  array.schemaid=1;
  array.content=content_array;
json=JSON.stringify(array);
var request = new XMLHttpRequest();
var url = endpoint;
request.open("POST",url,true);
request.setRequestHeader('Content-Type', 'application/json');
request.onreadystatechange = function() {//Call a function when the state changes.
    if(request.readyState == XMLHttpRequest.DONE && request.status == 200) {
        alert('ok')
    }
}
alert(json);
request.send(json);
}
