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

async function dbinsertitem(name,category,price,description,photo){
   const mysql = require('mysql2/promise');
   const connection = await mysql.createConnection({ host: 'localhost', user: 'root', password: 'password', database: 'Website'});
   const rows = await connection.execute('INSERT INTO `Item` (`Name`,`Categories`,`Price`,`Description`,`Photo` ) VALUES(?,?,?,?,?) ',[name,category,price,description,photo]);
   return rows;
}

async function dbinsertseller(userid,itemid){
    const mysql = require('mysql2/promise');
    const connection = await mysql.createConnection({ host: 'localhost', user: 'root', password: 'password', database: 'Website'});
    const rows = await connection.execute('INSERT INTO `Seller` (`UserId`,`ItemId`) VALUES(?,?) ',[userid,itemid]);
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
    let itemid = itemdb[0].insertId;
    //after putting the item in the database with all of this data, get the item id and the user id of the person selling.
    let dbuser = await dbcheck(user);
    let sellerid = dbuser[0][0].Id;
    let sellerdb = await dbinsertseller(sellerid,itemid);
    //console.log("reqfile: ",req.file);
    res.redirect('/');
});

router.post('/postitemlazy',async function(req, res, next){
    if(req.file){
      req.session.reupload = "Please Re-Upload Image";
    }
    console.log("item description: ",req.body.itemdescription);
    req.session.itemdescription = await req.body.itemdescription;
    req.session.selllazy = "true";
    res.redirect('/users/login');
});

router.get('/dashboard' , async function(req, res, next){
    //console.log("In Dashboard: ",req.session.user)
    res.render('dashboard', { user : req.session.user });
});

//this is totally separtae from main routes and will be used later when we add users -Greg
router.post('/loggedin' , async function(req, res, next) {
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
            res.send(html);
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
    res.send(html);
  }
  if(found){
    //use template literals for this or learn how to inject html into send
    //res.send(<a href="/">"Username Taken please go back to homepage"</a>);
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
    res.send('User Exists, please choose another and navigate back to homepage');
  }
});

router.get('/login', function(req, res, next) {
   if(req.session.cart) {
       res.render('login.hbs', { message : "Please Login or Register to Sell/Purchase Item"});
   }
   else{
      res.render('login', { message : ""});
   }
});

module.exports = router;