var endpoint = 'https://ec2-13-115-41-122.ap-northeast-1.compute.amazonaws.com:3000/regist/limit'


function setLimit(){
    // var limitid = document.forms.id_form1.id_tname.value;
    var year = document.forms.id_form1.year.value;
    // alert(year);
    var month = document.forms.id_form1.mon.value;
    // alert(month);
    var day = document.forms.id_form1.day.value;
    // alert(day);
    var hour = document.forms.id_form1.hour.value;
    // alert(hour);
    var minute = document.forms.id_form1.min.value;
    // alert(minute);

    var array={limitid:'',year:'',month:'',day:'',hour:'',minute:''};

    array.limitid=1;
    array.year=year;
    array.month=month;
    array.day=day;
    array.hour=hour;
    array.minute=minute;
    data=JSON.stringify(array);
    var request = new XMLHttpRequest();
    var url = endpoint;
    request.open("POST",url,true);
    request.setRequestHeader('Content-Type', 'application/json');

    request.onreadystatechange = function() {//Call a function when the state changes.
        if(request.readyState == XMLHttpRequest.DONE && request.status == 200) {
		//alert('ok');
        }
    }

    request.send(data);
}


