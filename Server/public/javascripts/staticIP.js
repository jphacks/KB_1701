// ejsファイルのheaderの先頭に以下の記述を追加
// <script src="/javascripts/staticIP.js">

// 他のJSファイル内での使い方
// const url = getHostUrl('https'(もしくは'ws'), '/nameOfEndpoint/...');
// (特にimport等をする必要はなし)

function getHostUlr(type, endpoint){
    const host = 'ec2-13-115-41-122.ap-northeast-1.compute.amazonaws.com';
    const httpsPort = 3000;
    const wsPort    = 8081;
    let port;

    // 型チェック
    if (type === 'https'){
	port = httpsPort;
    }
    else if(type === 'ws'){
	port = wsPort;
    }
    else{
	return alert('type: '+ type +' is invalid');
    }

    // endpointの形式を再成形
    if (endpoint.slice(0, 1) !== '/'){
	endpoint = '/' + endpoint;
    }

    const hostUrl = type + '://' + host + ':' + port + endpoint;
    return hostUrl;
};
