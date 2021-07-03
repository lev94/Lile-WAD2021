var javascript = require('../public/js/javascript');
//var log = javascript.checkLogin;
var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const mongodb = require('mongodb');
const url = "mongodb://localhost:27017/";

/* GET users listing. */
router.post('/', function (req, res, next) {
  MongoClient.connect(url, {useUnifiedTopology: true}, 
    function (err, client) { 
        if(err) { //better error handling needed 
             throw err;
        }             
        let db = client.db("advizDB");
  
        db.collection("contacts").insertOne( req.body, 
        function(err, result) {
            if (err) { //better error handling needed 
             throw err;
            }
            console.log(result);
            res.status(201).json(result);

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

router.get('/', function (req, res, next) {
  if(req.query.id=="Admina"){
    MongoClient.connect(url, {useUnifiedTopology: true}, 
      function (err, client) { 
          if(err) { //better error handling needed 
               throw err;
          }             
          let db = client.db("advizDB");
    
          db.collection("contacts").find().toArray(
          function(err, result) {
              if (err) { //better error handling needed 
               throw err;
              }
              console.log(result);
              res.status(200).json(result);
  
              client.close();
          });
      }); 
  }else{
    MongoClient.connect(url, {useUnifiedTopology: true}, 
    function (err, client) { 
        if(err) { //better error handling needed 
             throw err;
        }             
        let db = client.db("advizDB");
  
        db.collection("contacts").find( {$or:[{owner: req.query.id}, { isPrivate: false}]}).toArray(
        function(err, result) {
            if (err) { //better error handling needed 
             throw err;
            }
            console.log(result);
            res.status(200).json(result);

            client.close();
        });
    }); 
  }
  
  //var log = javascript.getContacs(req.query.id);
 // res.status(200).json(log);

});
router.put('/:id', function (req, res, next) {
  MongoClient.connect(url, {useUnifiedTopology: true}, 
    function (err, client) { 
        if(err) { //better error handling needed 
             throw err;
        }             
        let db = client.db("advizDB");
  
        db.collection("contacts").replaceOne( {_id: mongodb.ObjectID(req.params.id)}, req.body,
        function(err, result) {
            if (err) { //better error handling needed 
             throw err;
            }
            console.log(result);
            res.status(204).json(result);

            client.close();
        });
    }); 
  //var log = javascript.updateContact(req.params.id, req.body);
  //res.status(204).json(log);

});
router.delete('/:id', function (req, res, next) {
  MongoClient.connect(url, {useUnifiedTopology: true}, 
    function (err, client) { 
        if(err) { //better error handling needed 
             throw err;
        }             
        let db = client.db("advizDB");
  
        db.collection("contacts").deleteOne( {_id: mongodb.ObjectID( req.params.id )},
        function(err, result) {
            if (err) { //better error handling needed 
             throw err;
            }
            console.log(result);
            res.status(204).json(result);

            client.close();
        });
    }); 
  //var log = javascript.deleteContact(req.params.id);
  //res.status(204).json(log);

});

module.exports = router;
