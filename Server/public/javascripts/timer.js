var hostURL = 'https://ec2-13-115-41-122.ap-northeast-1.compute.amazonaws.com:3000';


var year = "2017";var month = "10";var day = "22";var hour = "18";var minute = "0";var centi = "1";
getLimit(1);
var convert = "1";var roop = "";
var cnt1 = "日";var cnt2 = "：";var cnt3 = "：";var cnt4 = ".";
var baseoffset = "-9";var cuttime = "";
var br1 = "";var br2 = "";var br3 = "";var br4 = "";
var com1 = "";var com2 = "";var com3 = "";var com4 = "Code Freeze";var end = "2";
var width = "500";var height = "65";
var font = "arial";var font2 = "7seg4";var size = "60";var l_height = "60";var bold = "";var italic = "";var line = "";
var space = "0px 0px 0px 0px";
var align = "2";var img = "";
var color1 = "00FF00";var color2 = "00FF00";var color3 = "000000";


function getLimit(l_id){
  var url = hostURL+'/regist/limit?limitid='+l_id; // リクエスト先URL
  var request = new XMLHttpRequest();
  request.onreadystatechange = function () {
    if (request.readyState != 4) {
      // リクエスト中
    } else if (request.status != 200) {
      // 失敗
    } else {
      // 取得成功
      var result = JSON.parse(request.responseText);
      year=result.year;
      month=result.month;
      day=result.day;
      hour=result.hour;
      minute=result.minute;
    }
  };
  request.response = 'json';
  request.open('GET', url);
  request.send(null);
}
