var express = require('express');
var router = express.Router();

var client_id = '254821626421.255281971077';
var client_secret = '6dbab0ed4bfeb2f602d0831e1edcaf47';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/slack/OAth', function(req, res, next) {
  console.log('GET request to the /slack/OAth');
  console.log('code:'+req.query.code+'\n');
  console.log(req.body.access_token+'\n');
  res.redirect('https://slack.com/api/oauth.access?client_id='+client_id
    +'&client_secret='
    +client_secret
    +'&code='+req.query.code
    +'&redirect_uri=http://172.20.11.172:3000/slack/OAth');
});

/* POST home page. */
router.post('/', function(req, res, next) {
  console.log('POST request to the index');
  console.log(req.body);
  res.send('POST request to the index');
});

router.post('/slack/introduction', function(req, res, next) {
  console.log('POST request to the /slack/introduction');
  console.log(req.body);
  res.json(req.body);
});

router.post('/slack/bgm', function(req, res, next) {
  console.log('POST request to the /slack/bgm');
  console.log(req.body);
  res.json(req.body);
});

router.post('/slack/help', function(req, res, next) {
  console.log('POST request to the /slack/help');
  console.log(req.body);
  res.json(req.body);
});

router.post('/github', function(req, res, next) {
  console.log('POST request to the /github');
  console.log(req.body);
  res.json(req.body);
});

module.exports = router;
