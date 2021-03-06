var express = require('express');
const { check, validationResult } = require('express-validator');
var router = express.Router();

var db_username="admin_fulda";
var db_password="fuldaschool";
var db_name="admin_fulda";
var db_host="localhost";

async function dbcheck(username){
    try {
      const mysql = require('mysql2/promise');
      const connection = await mysql.createConnection({ host: db_host,user: db_username, password: db_password, database: db_name});
      const rows = await connection.execute('SELECT * FROM `Users` WHERE `Username` = ?',[username]);
      return rows;
      await connection.end();
    }catch(err){

    }
}

async function dblogin(username) {
    try {
      const mysql = require('mysql2/promise');
      const connection = await mysql.createConnection({ host: db_host,user: db_username, password: db_password, database: db_name});
      const rows = await connection.execute('SELECT `Password` FROM `Users` WHERE `Username` = ?',[username]);
      return rows;
      await connection.end();
    }catch(err){

    }
}

async function dbregister(name,username,password,email) {
    try {
      const mysql = require('mysql2/promise');
      const connection = await mysql.createConnection({ host: db_host,user: db_username, password: db_password, database: db_name});
      const rows = await connection.execute('INSERT INTO `Users` (`Name`,`Username`,`Password`,`Email` ) VALUES(?,?,?,?) ',[name,username,password,email]);
      return rows;
      await connection.end();
    }catch(err){

    }
}

async function dbinsertitem(name,category,price,description,photo){
    try {
     const mysql = require('mysql2/promise');
     const connection = await mysql.createConnection({ host: db_host,user: db_username, password: db_password, database: db_name});
     const rows = await connection.execute('INSERT INTO `Item` (`Name`,`Categories`,`Price`,`Description`,`Photo`,`Status`,`Date`) VALUES(?,?,?,?,?,?,NOW()) ',[name,category,price,description,photo,0]);
     return rows;
     await connection.end();
    }catch(err){

    }
}

async function dbinsertseller(userid,itemid){
    try {
      const mysql = require('mysql2/promise');
      const connection = await mysql.createConnection({ host: db_host,user: db_username, password: db_password, database: db_name});
      const rows = await connection.execute('INSERT INTO `Seller` (`UserId`,`ItemId`) VALUES(?,?) ',[userid,itemid]);
      return rows;
      await connection.end();
    }catch(err){

    }
}

async function dbfindbuying(userid){
    try {
      const mysql = require('mysql2/promise');
      const connection = await mysql.createConnection({ host: db_host,user: db_username, password: db_password, database: db_name});
      const rows = await connection.execute('SELECT * FROM `Buyer` WHERE (`UserId`) = ? ',[userid]);
      return rows;
      await connection.end();
    }catch(err){

    }
}

async function dbfindselling(userid){
    try {
      const mysql = require('mysql2/promise');
      const connection = await mysql.createConnection({ host: db_host,user: db_username, password: db_password, database: db_name});
      const rows = await connection.execute('SELECT * FROM `Seller` WHERE (`UserId`) = ? ',[userid]);
      return rows;
      await connection.end();
    }catch(err){

    }
}

async function dbfinditem(itemid){
    try {
      const mysql = require('mysql2/promise');
      const connection = await mysql.createConnection({ host: db_host,user: db_username, password: db_password, database: db_name});
      const rows = await connection.execute('SELECT * FROM `Item` WHERE (`Id`) = ? ',[itemid]);
      return rows;
      await connection.end();
    }catch(err){

    }
}

async function dbfindbuyerbyid(itemid){
    const mysql = require('mysql2/promise');
    const connection = await mysql.createConnection({host: db_host,user: db_username, password: db_password, database: db_name});
    const rows = await connection.execute('SELECT * FROM `Buyer` WHERE (`ItemId`) = ? ',[itemid]);
    return rows;
}


//just use the session in the item id.
/* GET users listing. */

let upload = require('../services/uploadimage');
router.post('/postitem', upload.single('avatar'), async function(req, res, next){
    var user = req.session.user;
    var filterMap = new Map();
    filterMap.set('E',"ELECTRONICS");
    filterMap.set('B',"books");
    filterMap.set('F',"furniture");
    filterMap.set('O',"Others");
    //don't forget to put limits on
    let itemname = await req.body.itemname;
    let itemcategory = await filterMap.get(req.body.category);
    let itemprice = await req.body.price;
    let itemdescription = await req.body.itemdescription;
    let itemphoto = await req.file.filename;
    let itemdb = await dbinsertitem(itemname,itemcategory,itemprice,itemdescription,itemphoto);
    console.log("itemdb",itemdb);
    let itemid = itemdb[0].insertId;
    //after putting the item in the database with all of this data, get the item id and the user id of the person selling.
    let dbuser = await dbcheck(user);
    let sellerid = dbuser[0][0].Id;
    let sellerdb = await dbinsertseller(sellerid,itemid);
    //console.log("reqfile: ",req.file);
    res.redirect('/users/dashboard');
});

router.post('/postitemlazy',async function(req, res, next){
    if(req.file){
      req.session.reupload = "Please Re-Upload Image";
    }
    //console.log("item description: ",req.body.itemdescription);
    req.session.itemdescription = await req.body.itemdescription;
    req.session.selllazy = "true";
    res.redirect('/users/login');
});

async function asyncArray(itemtables){
  let itemsarray = [];
  for(let i = 0; i < itemtables.length; i++){
      let dbbitem = await dbfinditem(itemtables[i].ItemId);
      let item = dbbitem[0][0];
      console.log("item: ", item);
      itemsarray.push(item);
  }
  return itemsarray;
}

router.get('/dashboard' , async function(req, res, next){
     //console.log("In Dashboard: ",req.session.user)
     //get userid from username
     let user = await req.session.user;
     let userdb = await dbcheck(user);
     if(user){
       let userid = userdb[0][0].Id;
       //get an array of items that the user is buying
       let buyingdb = await dbfindbuying(userid);
       let itemsbuying = buyingdb[0];
       //console.log("buyers: ", itemsbuying);
       let bitems = await asyncArray(itemsbuying);
       //get an array of items that the user is selling
       let sellingdb = await dbfindselling(userid);
       let itemsselling = sellingdb[0];
       //console.log("sellers: ", itemsselling);
       let sitems = await asyncArray(itemsselling);
       //console.log("itemsbuying: ", bitems);
       //console.log("itemsselling: ", sitems);
       res.render('dashboard', { user : user , buying : bitems, selling : sitems});
     }
     else{
       res.redirect('login');
     }
});

//this is totally separtae from main routes and will be used later when we add users -Greg
router.post('/loggedin', [
  check('loginusername', "Invalid Username").not().isEmpty().trim().escape().isLength({ min: 2 }).isLength({ max: 30 }),
  check('loginpassword', "Invalid password").not().isEmpty().trim().escape().isAlphanumeric().isLength({ min: 2 })
 ] , async function(req, res, next) {
  //Pass Input Validations as array parameter as shown above
  //Handle validation error if any
  const errors = validationResult(req);
  console.log("Login Error",errors.array());
  if (!errors.isEmpty()) {
    //res.render('login', { message : ""});
    console.log("I dey get error");
    res.render('login', { message: errors.array()[0]['msg'] });
    //if api caller return res.status(422).json({ errors: errors.array() });
   }else{
    var user = await req.body.loginusername;
    var pass = await req.body.loginpassword;
    let resultbody = "";
    let html = "";
    let found = false;
    let indb = await dbcheck(user);
    if (indb[0].length > 1) {
        found = true;
    }
    if (!found) {
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
            res.render('login.hbs', { message : html});
        } else if (resultbody[0].Password === pass) {
            req.session.user = user;
            if (!req.session.cart && !req.session.selllazy) {
                res.redirect('/');
            }
            if(req.session.selllazy) {
                if (req.session.selllazy) {
                    res.redirect('/sell');
                }
            }
            if(req.session.cart){
                let url = "/item/" + req.session.cart;
                //clear out the cart and everything else in the session
                let user = req.session.user;
                req.session.destroy();
                req.session.user = user;
                res.redirect(url);
             }
         }
    }
  if (resultbody[0].Password != pass) {
    html = "Incorrect Password please go back to homepage";
    //use template literals for this or look at how to inject html into send
    //res.send(<a href="/">html</a>);
    res.render('login.hbs', { message : html});
  }
  if(found){
    //use template literals for this or learn how to inject html into send
    //res.send(<a href="/">"Username Taken please go back to homepage"</a>);
    res.render('login.hbs', { message : "Username Taken please go back to homepage"});
  }
 }
});

router.get('/logout' , async function(req, res, next){
   req.session.reset();
   res.redirect('/');
});

router.post('/register', [
  check('name', 'Name cannot be empty and must be at least 5 characters').not().isEmpty().trim().escape().isLength({ min: 5 }),
  check('username', "Invalid Username").not().isEmpty().trim().escape().isLength({ min: 5 }).isLength({ max: 30 }),
  check('email', "Invalid email").not().isEmpty().trim().escape().isEmail(),
  check('password', "Invalid password").not().isEmpty().trim().escape().isAlphanumeric().isLength({ min: 5 })
 ] , async function(req, res, next){
 //Pass Input Validations as array parameter as shown above
//Handle validation error if any
const errors = validationResult(req);
console.log("Register Error",errors.array());
if (!errors.isEmpty()) {
  //res.render('login', { message : ""});
  console.log("I dey get error");
  res.render('login', { message: errors.array()[0]['msg'] });
  //if api caller return res.status(422).json({ errors: errors.array() });
}
else{
	  
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

  console.log(email);
  let emailSplit = email.split("@");
  console.log(emailSplit[0]);
  console.log(emailSplit[1]);
  req.session.wrongemail = "";
  if(emailSplit[1]!=="mail.sfsu.edu"){
    req.session.wrongemail = "Only SFSU students may register.";
    res.redirect('/users/login');
  }else{
    if(!found) {
        await dbresults.then(function (result) {
            //double check that this users thing is correct
            let temp = [result[0], result[1], result[2], result[3]];
            resultbody = [result[0], result[1], result[2], result[3]];
            return resultbody;
        })
            .catch(function (error) {
                console.error(error);
            });
        req.session.user = username;
        if(!req.session.cart) {
            res.redirect('/');
        }
        else{
            if(req.session.selllazy){
                res.redirect('/sell');
            }
            else {
                //Remember to clear the cart afterwards
                let url = "/item/" + req.session.cart;
                let user = req.session.user;
                req.session.destroy();
                req.session.user = user;
                res.redirect(url);
            }
        }
    }
    else{
       //use template literals for this or learn how to inject html into send
      //res.send(<a href="/">'User Exists, please choose another and navigate back to homepage'</a>);
      res.render('login.hbs', { registermessage : 'User Exists, please choose another and navigate back to homepage'});
     
    }
  }
 }
});

router.get('/register', function(req, res, next) {
   res.render('login', { message : ""});
});

router.get('/login', async function(req, res, next) {
   if(req.session.cart) {
       res.render('login.hbs', { message : "Please Login or Register to Sell/Purchase Item"});
   }
   else{
       let message = await req.session.wrongemail;
      res.render('login', { message : message});
   }
});

module.exports = router;