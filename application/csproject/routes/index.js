var express = require('express');
var router = express.Router();

var db_username="root";
var db_password="password";
var db_name="Website";
var db_host="localhost";

/* GET home page. */
/*
 Here is where all of the http requests will be requested and responded too. 
Notice that all of our names are in here, this means that when you go to website.com/suraj, it will set a GET request to router.get down there
That's what routing essentially is. We will need to do POST requests (Send data to server) later -Greg
*/

/*
Notice the JSON object { title : 'About Team 14' } This is why we are using Handlebars. We are sending this JSON object to the page that is labeled.
eg. 'suraj' is being sent { title : 'I am suraj'} You will notice in suraj.hbs, a {{title}} bracket. This takes whatever is labelled 'title' down here in the
response (res) object, and renders it as text. There are different thigns we can use like {{{}}}}, {}, etc. to render JSON, plaintext, or HTML 
please see handlebar documentation for more info. I hope this makes sense as it's the main reason why I chose this framework. -Greg
*/

async function dbfinditem(id){
  const mysql = require('mysql2/promise');
  const connection = await mysql.createConnection({ host: 'localhost', user: db_username, password: db_password, database: db_name});
  let rows;
  rows = await connection.execute('SELECT * FROM `Item` WHERE `Id` = ? ' ,[id]);
  return rows;
  await connection.end();
}

async function dbfindseller(itemid){
  const mysql = require('mysql2/promise');
  const connection = await mysql.createConnection({ host: 'localhost', user: db_username, password: db_password, database: db_name});
  let rows;
  rows = await connection.execute('SELECT * FROM `Seller` WHERE `ItemId` = ?',[itemid]);
  return rows;
  await connection.end();
}

async function dbfinduser(userid){
  const mysql = require('mysql2/promise');
  const connection = await mysql.createConnection({ host: 'localhost', user: db_username, password: db_password, database: db_name});
  let rows;
  rows = await connection.execute('SELECT * FROM `Users` WHERE `Id` = ?',[userid]);
  return rows;
  await connection.end();
}

async function dbrecentitem(){
  const mysql = require('mysql2/promise');
  const connection = await mysql.createConnection({ host: 'localhost', user: db_username, password: db_password, database: db_name});
  let rows;
  rows = await connection.execute('SELECT * FROM `Item` WHERE (`Status`) = ? ORDER BY `Date`',[1]);
  return rows;
  await connection.end();
}

async function dbcheapestitem(){
  const mysql = require('mysql2/promise');
  const connection = await mysql.createConnection({ host: 'localhost', user: db_username, password: db_password, database: db_name});
  let rows;
  rows = await connection.execute('SELECT * FROM `Item` WHERE (`Status`) = ? ORDER BY `Price` ASC',[1]);
  return rows;
  await connection.end();
}

router.get('/item/:id', async function(req,res,next){
    var user = await req.session.user;
    var item = await req.params.id;
    let itemresult = await dbfinditem(item);
    let sellerresult = await dbfindseller(item);
    let sellerid = sellerresult[0][0].UserId;
    let findseller = await dbfinduser(sellerid);
    let sellername = findseller[0][0].Username;
    //This is how to access returned objects
    let uploadmessage = await req.session.uploadmessage;

    req.session.destroy();
    req.session.user = user;

    res.render('item',{ user : user,uploadmessage:uploadmessage, item : itemresult[0][0], seller : sellername });
});

router.get('/', async function (req,res,next) {
  console.log("lowest");
  var user = await req.session.user;
  let dbcheapestitems = await dbcheapestitem();

  console.log("recent");
  let dbrecentitems = await dbrecentitem();

  res.render('index', {cheapestdb : dbcheapestitems[0], recentdb : dbrecentitems[0], user : user});
});

router.get('/sell', async function(req,res,next){
  var user = req.session.user;
  var description = req.session.itemdescription;
  req.session.destroy();
  req.session.user = user;
  res.render('sell',{ user : user, description : description });
});

router.get('/', function(req, res, next) {
  //some mysql
  let user = '';
  let signedup = '';
  if(req.session.user != undefined){
     user = req.session.user;
  }
  if(req.session.signedup != undefined){
    signedup = "true";
  }
  res.render('index', {title: 'About Team 14', user: user, signedup: signedup});
});

router.get('/root',function(req, res, next) {
  let user = '';
  if(req.session.user != undefined){
    user = req.session.user;
  }
  res.render('root', { title: 'I am root', user : user });
});

router.get('/shubham',function(req, res, next) {
  let user = '';
  if(req.session.user != undefined){
    user = req.session.user;
  }
  res.render('shubham', { title: 'I am shubham', user : user });
});

router.get('/michael',function(req, res, next) {
  let user = '';
  if(req.session.user != undefined){
    user = req.session.user;
  }
  res.render('michael', { title: 'I am michael', user : user });
});

router.get('/greg',function(req, res, next) {
  let user = '';
  if(req.session.user != undefined){
    user = req.session.user;
  }
  res.render('greg', { title: 'I am greg', user: user });
});

module.exports = router;
