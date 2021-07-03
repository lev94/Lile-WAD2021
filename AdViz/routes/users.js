//var javascript = require('../public/js/javascript');
//var log = javascript.checkLogin;
var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";

/* GET users listing. */
router.post('/', function(req, res, next) {
  //var user = req.body;
  MongoClient.connect(url, {useUnifiedTopology: true}, 
    function (err, client) { 
        if(err) { //better error handling needed 
             throw err;
        }             
        let db = client.db("advizDB");
  
        db.collection("users").findOne({userId: req.body.username, password: req.body.password}, 
        function(err, result) {
            if (err) { //better error handling needed 
             throw err;
            }
            console.log(result);
            if(result!=undefined){
              res.status(200).json(result);
            }else{
              res.status(401).json(result);
            }
            client.close();
        });
    }); 

  //var l = JSON.stringify(req.body);
  //res.status(200).json(req.body);//user
 // alert("test");
  //res.send('Got a POST request');
 // log(req.body);
 
  
 
  
  
  //res.send('respond with a resource');
});

module.exports = router;
