
var year = "2017";var month = "10";var day = "22";var hour = "15";var minute = "0";var centi = "1";
var convert = "1";var roop = "";
var cnt1 = "日";var cnt2 = "：";var cnt3 = "：";var cnt4 = ".";
var baseoffset = "-9";var cuttime = "";
var br1 = "";var br2 = "";var br3 = "";var br4 = "";
var com1 = "";var com2 = "";var com3 = "";var com4 = "HackTime終了";var end = "2";
var width = "400";var height = "100";
var font = "arial";var font2 = "7seg4";var size = "27";var l_height = "27";var bold = "";var italic = "";var line = "";
var space = "0px 0px 0px 0px";
var align = "2";var img = "";
var color1 = "FFFFFF";var color2 = "00FF00";var color3 = "000000";

// var hostURL = 'https://13.115.41.122:3000';
// var hostURL = 'https://172.20.11.172:3000';
var hostURL = 'https://192.168.100.32:3000';
var url = hostURL+'/regist/limit?limitid=';

function getTimer(l_id){
  var url = url+l_id; // リクエスト先URL
  var request = new XMLHttpRequest();

  request.onreadystatechange = function () {
    if (request.readyState != 4) {
      // リクエスト中
    } else if (request.status != 200) {
      // 失敗
    } else {
      // 取得成功

      result = JSON.parse(request.responseText);

      year=result.year;
      month=result.month;
      day=result.day;
      hour=result.hour;
      minute=resulut.minute;
    }
  };
  request.response = 'json';
  request.open('GET', url);
  request.send(null);
}
