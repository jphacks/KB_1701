var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* POST home page. */
router.post('/', function(req, res, next) {
  console.log('POST request to the index');
  console.log(req.body);
  res.send('POST request to the index');
});

router.post('/slack', function(req, res, next) {
  console.log('POST request to the /slack');
  console.log(req.body);
  res.json(req.body);
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
