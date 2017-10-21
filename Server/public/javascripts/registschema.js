var data={}
var id=1;
function add(){
    var div_element = document.createElement("div");
    div_element.innerHTML = '<input type="text" name="title" size="20" value="作りたいキー">  <input id="text'+id+'" type="text" name="title" size="20" value="作りたいキー">   <button onclick="add();">このボタンを押して動的にUIを追加！</button>';
    var parent_object = document.getElementById("entry");
    parent_object.appendChild(div_element);

    // ChangeTxt(document.getElementById("text"+String(id-1)).value);
    addToJSON(document.getElementById("text"+(id-1)).value);
    // alert(id);
    id++;
}
function ChangeTxt() {
  var first_flag=true;
  for (var key in data) {
    if (first_flag) {
      var txt='{';
      txt += key+':'+data[key];
      first_flag=false;
    }else{
      txt += ','+'<br>&nbsp;'+key+':'+data[key];
    }
  }
  txt+='<br>}';
    document.getElementById("text").innerHTML=txt;
}

function addToJSON(key){
  data[key]="a";
  // json=JSON.stringify(data);
  // alert(json);
  ChangeTxt();
}
