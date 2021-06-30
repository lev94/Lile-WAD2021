var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //next('index', { title: 'Login' });
  res.render('index', { title: 'Login' });
});

module.exports = router;
