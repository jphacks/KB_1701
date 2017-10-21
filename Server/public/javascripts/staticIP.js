const ip = '192.168.128.102';
const hostUrl = 'https://' + ip + ':3000';

class IP {

    get IP(){
	return ip;
    }

    get hostUrl(){
	return hostUrl;
    }
}

export default IP;
module.exports = IP;
