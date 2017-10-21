var content={}
var id=0;
var endpoint = getHostUlr('https', '/regist/schema');
// var endpoint = 'https://192.168.128.102:3000/regist/schema';
// var endpoint = 'https://localhost:3000/regist/schema';
var userid_key='userid'
var userid_value='{type: String, require: true, unique: true}'
addtoContent(userid_key,userid_value);

function add(clicked_button_id){
  if (id==clicked_button_id) {
    id++;
    var div_element = document.createElement("div");
    div_element.innerHTML = '<input type="text" name="title" size="20" value="作りたいキー">  <input id="text'+id+'" type="text" name="title" size="20" value="作りたいキー">   <button onclick="add('+id+');">このボタンを押して動的にUIを追加！</button>';
    var parent_object = document.getElementById("entry");
    parent_object.appendChild(div_element);
  }
    addtoContent(document.getElementById("text"+(clicked_button_id)).value,'{type: String}');
    showContent();
}

function showContent() {
  var first_flag=true;

  for (var key in content) {
    if (first_flag) {
      var txt='{';
      txt += key+':'+content[key];
      first_flag=false;
    }else{
      txt += ','+'<br>&nbsp;'+key+':'+content[key];
    }
  }
  txt+='<br>}';
  document.getElementById("content_text").innerHTML=txt;
    // postrequest(txt);
}

function addtoContent(key,value){
  content[key]=value;
}

function initContent(){
  content={}
  addtoContent(userid_key,userid_value);
  showContent();
}

function postrequest(){
  var array={schemaid:'',content:''};
  array.schemaid=1;
  array.content=content;
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
