var express = require('express');
var router = express.Router();

async function dbcheck(username){
    const mysql = require('mysql2/promise');
    const connection = await mysql.createConnection({ host: 'localhost', user: 'root', password: 'password', database: 'Website'});
    const rows = await connection.execute('SELECT * FROM `Users` WHERE `Username` = ?',[username]);
    return rows;
}

async function dblogin(username) {
    const mysql = require('mysql2/promise');
    const connection = await mysql.createConnection({ host: 'localhost', user: 'root', password: 'password', database: 'Website'});
    const rows = await connection.execute('SELECT `Password` FROM `Users` WHERE `Username` = ?',[username]);
    return rows;
}

async function dbregister(name,username,password,email) {
    const mysql = require('mysql2/promise');
    const connection = await mysql.createConnection({ host: 'localhost', user: 'root', password: 'password', database: 'Website'});
    const rows = await connection.execute('INSERT INTO `Users` (`Name`,`Username`,`Password`,`Email` ) VALUES(?,?,?,?) ',[name,username,password,email]);
    return rows;
}

/* GET users listing. */
router.get('/dashboard' , async function(req, res, next){
    //console.log("In Dashboard: ",req.session.user)
    res.render('dashboard', { user : req.session.user });
});

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
          return result[0];
      })
          .catch(function (error) {
              console.error(error);
          });
      if (resultbody.length < 1) {
          html = "user does not exist please go back to homepage";
          res.send(html);
      } else if(resultbody[0].Password === pass){
          req.session.user = user;
          res.redirect('/');
      } else if (resultbody[0].Password != pass){
          html = "Incorrect Password please go back to homepage";
          res.send(html);
      }
  }
  else{
    res.send("Username Taken please go back to homepage");
  }
});

router.get('/logout' , async function(req, res, next){
   req.session.reset();
   res.redirect('/');
});

router.post('/register' , async function(req, res, next){
  let username = await req.body.username;
  let password = await req.body.password;
  let email = await req.body.email;
  //Note that if you put an await message here (before dbregister), this is no longer a promise that needs to be resolve but instead becomes a request header object
  let dbresults = dbregister(req.body.name,req.body.username,req.body.password,req.body.email);
  let found = false;
  let indb = await dbcheck(req.body.username);
  if(indb[0].length > 1) {
    found = true;
  }
  let resultbody = "";
  if(!found) {
      await dbresults.then(function (result) {
          //double check that this users thing is correct
          let temp = [result[0], result[1], result[2],result[3]];
          resultbody = [result[0], result[1], result[2],result[3]];
          return resultbody;
      })
          .catch(function (error) {
              console.error(error);
          });
   //You need to add a check for successful database login here
   req.session.user = username;
   req.session.signedup = true;
   res.redirect('/');
  }
  else{
   res.send("User already exists please navigate back to home page");
  }
});

router.get('/login', function(req, res, next) {
   res.render('login.hbs');
});

module.exports = router;