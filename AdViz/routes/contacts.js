var javascript = require('../public/js/javascript');
//var log = javascript.checkLogin;
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/', function (req, res, next) {
  //var l = JSON.stringify(req.body);
  //res.status(200).json(req.body);//user
  // alert("test");
  //res.send('Got a POST request');
  // log(req.body);

  var log = javascript.addContact(req.body);
  res.status(201).json(log);


  //res.send('respond with a resource');
});

router.get('/', function (req, res, next) {
  var log = javascript.getContacs(req.query.id);
  res.status(200).json(log);

});
router.put('/:id', function (req, res, next) {
  var log = javascript.updateContact(req.params.id, req.body);
  res.status(204).json(log);

});
router.delete('/:id', function (req, res, next) {
  var log = javascript.deleteContact(req.params.id);
  res.status(204).json(log);

});

module.exports = router;
