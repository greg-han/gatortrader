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
//Here, we will connect to the database and pull data, which will
//be encoded into a JSON object and placed into variable results
//Ideally, all of this would be inside of a router call. 
//connection.end();

/* GET users listing. */
//this is totally separtae from main routes and will be used later when we add users -Greg
router.post('/loggedin' , function(req, res, next){
  var user = req.body.username;
  console.log(req);
  let error = "";
  //remember that this console.log goes to the server
  let mysqlquery = 'SELECT * FROM `user` WHERE username = "Mike"';
  let html = "";
  connection.query(mysqlquery,function(error, results, fields){
      if(error) throw error;
      console.log(results);
      if(results.length < 1) {
          html = "Please Sign Up";
      }
      else{
          html =  "";
      }
  });
  res.send("You're in login page");
});

router.post('/register' , function(req, res, next){
  res.send("You're in register page");
});

router.get('/login', function(req, res, next) {
   res.render('login.hbs');
   //res.send(html);
   //console.log('test' + results[0].test);
});

module.exports = router;