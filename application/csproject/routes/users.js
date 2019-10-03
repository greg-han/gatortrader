var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'password',
    database : 'users'
});

connection.connect();
//This will take any user related POST or GET requests, and save it into a 
//user variable.
//user = GET etc etc.
//var mysql = 'SELECT SOMETHING SOMETHING ETC.' + user;
//Here, we will connect to the database and pull data, which will
//be encoded into a JSON object and placed into variable results
//Ideally, all of this would be inside of a router call. 
//connection.end();

/* GET users listing. */
//this is totally separtae from main routes and will be used later when we add users -Greg
router.get('/', function(req, res, next) {
    let error = "";
    //remember that this console.log goes to the server
    console.log("test"); 
    connection.query(mysql,function(error, results, fields){
     if(error) throw error;
     error = 'test' + results[0].test;  
     console.log('test' + results[0].test);
    });
  res.send("I see that");
});

module.exports = router;
