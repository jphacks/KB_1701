// var hostURL = 'https://13.115.41.122:3000';
// var hostURL = 'https://172.20.11.172:3000';
var hostURL = 'https://192.168.100.32:3000';
var url = hostURL+'/regist/limit';  // リクエスト先URL

function setLimit(){
// limitid = document.forms.id_form1.id_tname.value;
// year = document.forms.id_form1.tnumbox.value;
// month = document.forms.id_form1.nocbox.value;
// day = document.forms.id_form1.addbox.value;
// hour = document.forms.id_form1.delbox.value;
// minute = document.forms.id_form1.commentbox.value;
var array={limitid:'',year:'',month:'',day:'',hour:'',minute:''};
array.id=limitid;
array.year=year;
array.month=month;
array.day=day;
array.hour=hour;
array.minute=minute;
data=JSON.stringify(array);

var request = new XMLHttpRequest();
request.onreadystatechange = function () {
  if (request.readyState != 4) {
    // リクエスト中
  } else if (request.status != 200) {
    // 失敗
  } else {
    // 送信成功
  }
};
request.setRequestHeader('Content-Type', 'application/json');
request.open('POST', url);
request.send(JSON.stringify(data));
}
