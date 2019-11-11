var express = require('express');
var router = express.Router();

async function dbcheck(username){
    const mysql = require('mysql2/promise');
    const connection = await mysql.createConnection({ host: 'localhost', user: 'root', password: 'password', database: 'Website'});
    const rows = await connection.execute('SELECT * FROM `Users` WHERE `Username` = ?',[username]);
    return rows;
}

async function dbsearch(search,filter){
    const mysql = require('mysql2/promise');
    const connection = await mysql.createConnection({ host: 'localhost', user: 'root', password: 'password', database: 'Website'});
    let rows;
    let likesearch = ("%" + search + "%");
    if(!filter){
        rows = await connection.execute('SELECT * FROM `Item` WHERE `Description` LIKE ?' ,[likesearch]);
    }
    else{
        rows = await connection.execute('SELECT * FROM `Item` WHERE `Categories` = ? and `Description` LIKE ?' ,[filter,likesearch]);
    }
    return rows;
}

async function dbfindsellerbyitem(itemid){
    const mysql = require('mysql2/promise');
    const connection = await mysql.createConnection({ host: 'localhost', user: 'root', password: 'password', database: 'Website'});
    const rows = await connection.execute('SELECT * FROM `Seller` WHERE (`ItemId`) = ? ',[itemid]);
    return rows;
}

router.post('/sendmessage/:itemid', async function(req, res, next){
  console.log("well, we made it", req.session.user);
  let user = await req.session.user;
  let url = "/login";
  let itemid = await req.params.itemid;
  let message = await req.body.message;
  let sellerid = await req.body.sellerid;
  if(!user){
     req.session.cart = itemid;
     res.redirect('/users/login');
  }
  else{
     //this will return the seller table
     console.log("itemid: ", itemid);
     console.log("message: ",message);
     console.log("sellerid: ",sellerid);
     //This will re-direct to messages
     res.redirect('/');
  }
});


router.post('checkmessages', async function(req, res, next){

});

//all messages logic will go here

module.exports = router;
