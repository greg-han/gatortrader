var express = require('express');
var router = express.Router();

async function dbcheck(username){
    const mysql = require('mysql2/promise');
    const connection = await mysql.createConnection({ host: 'localhost', user: 'root', password: 'password', database: 'Website'});
    const rows = await connection.execute('SELECT * FROM `Users` WHERE `Username` = ?',[username]);
    return rows;
    await connection.end();
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
    await connection.end();
}

async function dbfindsellerbyitem(itemid){
    const mysql = require('mysql2/promise');
    const connection = await mysql.createConnection({ host: 'localhost', user: 'root', password: 'password', database: 'Website'});
    const rows = await connection.execute('SELECT * FROM `Seller` WHERE (`ItemId`) = ? ',[itemid]);
    return rows;
    await connection.end();
}

async function dbfindbuyerbyitem(itemid){
    const mysql = require('mysql2/promise');
    const connection = await mysql.createConnection({ host: 'localhost', user: 'root', password: 'password', database: 'Website'});
    const rows = await connection.execute('SELECT * FROM `Buyer` WHERE (`ItemId`) = ? ',[itemid]);
    return rows;
}


async function dbinsertbuyer(userid,itemid){
    const mysql = require('mysql2/promise');
    const connection = await mysql.createConnection({ host: 'localhost', user: 'root', password: 'password', database: 'Website'});
    const rows = await connection.execute('INSERT INTO `Buyer` (`UserId`,`ItemId`) VALUES(?,?) ',[userid,itemid]);
    return rows;
    await connection.end();
}

async function dbinsertmessage(message,userid,senderid,itemid){
    const mysql = require('mysql2/promise');
    const connection = await mysql.createConnection({ host: 'localhost', user: 'root', password: 'password', database: 'Website'});
    const rows = await connection.execute('INSERT INTO `Message` (`MessageBody`,`UserID`,`TimeStamp`,`SenderId`,`ItemId`) VALUES(?,?,CURRENT_TIMESTAMP(),?,?) ',[message,userid,senderid,itemid]);
    return rows;
    await connection.end();
}

async function dbfinduser(userid){
    const mysql = require('mysql2/promise');
    const connection = await mysql.createConnection({ host: 'localhost', user: 'root', password: 'password', database: 'Website'});
    let rows;
    rows = await connection.execute('SELECT * FROM `Users` WHERE `Id` = ?',[userid]);
    return rows;
}

async function dbfindmessage(userid, senderid){
    const mysql = require('mysql2/promise');
    const connection = await mysql.createConnection({ host: 'localhost', user: 'root', password: 'password', database: 'Website'});
    let rows;
    rows = await connection.execute('SELECT * FROM `Message` WHERE `UserID` = ? AND `SenderId` = ?',[userid,senderid]);
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
     //find buyerid by username
     let dbbuyeruser = await dbcheck(user);
     let buyerid = dbbuyeruser[0][0].Id;
     //insert buyerid and itemid into buyer table
     let buyer = await dbinsertbuyer(buyerid,itemid);
     //find seller by item id to prepare for messaging
     let seller = await dbfindsellerbyitem(itemid);
     let sellerid = seller[0][0].UserId;
     if(buyerid == sellerid) {
       res.render("Nice try! can't buy what you're selling!");
     }
     else {
         let messageinsert = await dbinsertmessage(message, sellerid, buyerid, itemid);
         console.log("message insert: ", messageinsert);
         console.log("itemid: ", itemid);
         console.log("message: ", message);
         console.log("sellerid: ", sellerid);
         //This will re-direct to messages
         res.redirect('/users/dashboard/');
     }
  }
});

async function dbfinditem(id){
    const mysql = require('mysql2/promise');
    const connection = await mysql.createConnection({ host: 'localhost', user: 'root', password: 'password', database: 'Website'});
    let rows;
    rows = await connection.execute('SELECT * FROM `Item` WHERE `Id` = ? ' ,[id]);
    return rows;
}


//gives a list of users that are interested in item
router.get('/checkselling/:itemid', async function(req, res, next){
    let user = req.session.user;
     //Remember that you can also do hidden inputs, so data you send from here to handlebars can be a hidden part of a form somewhere
    let itemid = await req.params.itemid;
    let itemresult = await dbfinditem(itemid);
    let item = itemresult[0][0];
    console.log("Itemresult: ", item);
    let buyer = await dbfindbuyerbyitem(itemid);
    //sometimes you won't have a username, and this will be weird
    let myuser = await dbcheck(user);
    console.log("buyers",buyer[0]);
    let myuserid = myuser[0][0].Id;
    let buyers;
    let users;
    let buyersarray;
    let usersarray = [];
    if(buyer[0]) {
        buyers = buyer[0];
        for (let i = 0; i < buyers.length; i++) {
            let userobject = {
                name : '',
                message : '',
                itemid : '',
                timestamp: ''
            };
            let buyerid = buyers[i].UserId;
            users = await dbfinduser(buyers[i].UserId);
            let messageinfo = await dbfindmessage(myuserid,buyerid);
            let message = messageinfo[0][0].MessageBody;
            let timestamp = message[0][0].TimeStamp;
            console.log("message", messageinfo[0][0].MessageBody);
            if(users) {
              userobject.name = users[0][0].Name;
              userobject.message = message;
              userobject.timestamp = timestamp;
              userobject.itemid  = itemid;
              usersarray.push(userobject);
            }
        }
    }
    res.render('messagebuyers', { user : user, buyers : usersarray, item : item });
});

//once a user is selected, they will be routed here
router.get('/messagebuyer/:itemid', async function(req, res, next){
    let user = req.session.user;
    res.render('messagebuy', { user : user });
});

//all messages logic will go here
module.exports = router;
