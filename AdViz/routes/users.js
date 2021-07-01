var javascript = require('../public/js/javascript');
//var log = javascript.checkLogin;
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/', function(req, res, next) {
  //var l = JSON.stringify(req.body);
  //res.status(200).json(req.body);//user
 // alert("test");
  //res.send('Got a POST request');
 // log(req.body);
 
  var log = javascript.checkLogin(req.body);
 
  if(log!=undefined){
    res.status(200).json(log);
  }else{
    res.status(401).json(log);
  }
  
  //res.send('respond with a resource');
});

module.exports = router;
