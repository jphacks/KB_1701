var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/slack', function(req, res, next) {
  console.log(req.body);
  res.send('POST request to the /slack');
});

router.post('/github', function(req, res, next) {
  console.log(req.body);
  res.send('POST request to the /github');
});

module.exports = router;
