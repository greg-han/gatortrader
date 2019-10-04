var express = require('express');
var router = express.Router();


async function dblogin(username,password) {
    const mysql = require('mysql2/promise');
    const connection = await mysql.createConnection({ host: 'localhost', user: 'root', password: 'password', database: 'users'});
    const rows = await connection.execute('SELECT * FROM `user` WHERE `username` = ?',[username]);
    return rows;
}

async function dbregister(username,password) {
    const mysql = require('mysql2/promise');
    const connection = await mysql.createConnection({ host: 'localhost', user: 'root', password: 'password', database: 'users'});
    //const [rows,fields] = await connection.execute('SELECT * FROM `user` WHERE `username` = ?',[username]);
    return [rows,fields];
}

/* GET users listing. */
//this is totally separtae from main routes and will be used later when we add users -Greg
router.post('/loggedin' , async function(req, res, next){
  var user = req.body.loginusername;
  let resultbody = "";
  let html = "";
  let dbresults = dblogin(user,"Stuff");
  await dbresults.then(function(result){
      //console.log("result: ",result[0]);
      resultbody = result[0];
      return result[0];
  })
  .catch(function(error){
      console.error(error);
  });
  if(resultbody.length < 1){
     html =  "user does not exist";
  }
  else{
     html = "You are logged in!";
  }
  res.send(html);
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