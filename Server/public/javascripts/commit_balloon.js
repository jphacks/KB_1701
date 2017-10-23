var teamnum = 0;

function setRandomLeft(imageWidth) {
	var targetElement = document.getElementById( "commitcontent" ) ;
	// var clientRect = targetElement.getBoundingClientRect() ;	// 要素の位置座標を取得
	// var x = clientRect.left ;									// 画面の左端から、要素の左端までの距離
	return (Math.random() * (document.getElementById("commitcontent").clientWidth - imageWidth)) + "px";
}

function setRandomTop(imageHeight) {
	var targetElement = document.getElementById( "commitcontent" ) ;
	// var clientRect = targetElement.getBoundingClientRect() ;	// 要素の位置座標を取得
	// var y = clientRect.top ;									// 画面の上端から、要素の上端までの距離
	return (Math.random() * (document.getElementById("commitcontent").clientHeight - imageHeight)) + "px";
}

function viewBalloon() {
	// team = document.forms.id_form1.id_tname.value;
	// tnum = document.forms.id_form1.tnumbox.value;
	// noc = document.forms.id_form1.nocbox.value;
	// add = document.forms.id_form1.addbox.value;
	// del = document.forms.id_form1.delbox.value;
	// comment = document.forms.id_form1.commentbox.value;
	//
	// var image = document.createElement("div");
	// image.innerHTML = '<p class="fukidashi'+tnum+'">Commit!!&nbsp&nbsp&nbsp&nbspby&nbsp'+team+'<br>No.'+noc+'&nbsp&nbsp&nbsp&nbsp+&nbsp'+add+'&nbspline&nbsp&nbsp&nbsp&nbsp-&nbsp'+del+'&nbspline<br>'+comment+'</p>';
	// image.style.position = "absolute";
	// image.style.top = setRandomTop("100");//画像の横の長さをsetRandomTopに。
	// image.style.left = setRandomLeft("100");//画像の縦の長さをsetRandomLeftに。
	// document.getElementById("commitcontent").appendChild(image);
	
	if(teamnum<9) teamnum++;
	else teamnum = 0;

	var image = document.createElement("div");
	// image.innerHTML = '<p class="fukidashi'+tnum+'">Commit!!&nbsp&nbsp&nbsp&nbspby&nbsp'+team+'<br>No.'+noc+'&nbsp&nbsp&nbsp&nbsp+&nbsp'+add+'&nbspline&nbsp&nbsp&nbsp&nbsp-&nbsp'+del+'&nbspline<br>'+comment+'</p>';
	image.innerHTML = '<p class="fukidashi'+teamnum+'">Commit!!</p>';
	image.style.position = "absolute";
	image.style.top = setRandomTop("100");//画像の横の長さをsetRandomTopに。
	image.style.left = setRandomLeft("100");//画像の縦の長さをsetRandomLeftに。
	document.getElementById("commitcontent").appendChild(image);
}
