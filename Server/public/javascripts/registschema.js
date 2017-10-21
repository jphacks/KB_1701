function add(){
    var div_element = document.createElement("div");
    div_element.innerHTML = '<input type="text" name="title" size="50" value="作りたいキー">  <input type="text" name="title" size="50" value="作りたいキー">   <button onclick="add();">このボタンを押して動的にUIを追加！</button>';
    var parent_object = document.getElementById("entry");
    parent_object.appendChild(div_element);
}