var express = require('express');
var router = express.Router();

async function dbcheck(username){
    const mysql = require('mysql2/promise');
    const connection = await mysql.createConnection({ host: 'localhost', user: 'root', password: 'password', database: 'users'});
    const rows = await connection.execute('SELECT * FROM `user` WHERE `username` = ?',[username]);
    return rows;
}

async function dblogin(username) {
    const mysql = require('mysql2/promise');
    const connection = await mysql.createConnection({ host: 'localhost', user: 'root', password: 'password', database: 'users'});
    const rows = await connection.execute('SELECT `password` FROM `user` WHERE `username` = ?',[username]);
    return rows;
}

async function dbregister(username,password,email) {
    const mysql = require('mysql2/promise');
    const connection = await mysql.createConnection({ host: 'localhost', user: 'root', password: 'password', database: 'users'});
    const rows = await connection.execute('INSERT INTO `user` (`username`,`password`, `loggedin`,`email` ) VALUES(?,?,?,?) ',[username,password,0,email]);
    return rows;
}

/* GET users listing. */
//this is totally separtae from main routes and will be used later when we add users -Greg
router.post('/loggedin' , async function(req, res, next){
  var user = await req.body.loginusername;
  var pass = await req.body.loginpassword;
  let resultbody = "";
  let html = "";
  let found = false;
  let indb = await dbcheck(user);
    if(indb[0].length > 1) {
        found = true;
  }
  if(!found) {
      let dbresults = dblogin(user);
      await dbresults.then(function (result) {
          resultbody = result[0];
          console.log("resultbody", result[0]);
          return result[0];
      })
          .catch(function (error) {
              console.error(error);
          });
      if (resultbody.length < 1) {
          html = "user does not exist";
      } else if(resultbody.password === pass){
          html = "You are logged in!";
      } else if (resultbody.password != pass){
          html = "Incorrect Password";
      }
      res.send(html);
  }
  else{
    res.send("Username Taken");
  }
});

router.post('/register' , async function(req, res, next){
  let username = await req.body.username;
  let password = await req.body.password;
  let email = await req.body.email;
  let dbresults = await dbregister(req.body.username,req.body.password,req.body.email);
  let found = false;
  let indb = await dbcheck(req.body.username);
  if(indb[0].length > 1) {
    found = true;
  }
  let resultbody = "";
  if(!found) {
      await dbresults.then(function (result) {
          let temp = [result[0], result[1], result[2]];
          resultbody = [result[0], result[1], result[2]];
          console.log(resultbody);
          return resultbody;
      })
          .catch(function (error) {
              console.error(error);
          });
   res.send("You're in register page");
  }
  else{
   res.send("User already exists");
  }
});

router.get('/login', function(req, res, next) {
   res.render('login.hbs');
});

module.exports = router;