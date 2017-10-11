var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

<<<<<<< HEAD
=======
/* POST home page. */
router.post('/', function(req, res, next) {
  console.log(req.body);
  res.send('POST request to the index');
});

>>>>>>> 76a01f0b97760b0609263d24e71c7a6064a197a6
router.post('/slack', function(req, res, next) {
  console.log(req.body);
  res.send('POST request to the /slack');
});

router.post('/github', function(req, res, next) {
  console.log(req.body);
  res.send('POST request to the /github');
});

module.exports = router;
