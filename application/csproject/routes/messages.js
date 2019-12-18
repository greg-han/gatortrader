var express = require('express');
var router = express.Router();

var db_username = 'root';
var db_password ='password';
var db_name = 'Website';
var db_host = 'localhost';

async function dbcheck(username){
    const mysql = require('mysql2/promise');
    const connection = await mysql.createConnection({ host: 'localhost', user: db_username, password: db_password, database: db_name});
    const rows = await connection.execute('SELECT * FROM `Users` WHERE `Username` = ?',[username]);
    return rows;
    await connection.end();
}

async function dbsearch(search,filter){
    const mysql = require('mysql2/promise');
    const connection = await mysql.createConnection({ host: 'localhost', user: db_username, password: db_password, database: db_name});
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
    const connection = await mysql.createConnection({ host: 'localhost', user: db_username, password: db_password, database: db_name});
    const rows = await connection.execute('SELECT * FROM `Seller` WHERE (`ItemId`) = ? ',[itemid]);
    return rows;
    await connection.end();
}

async function dbfindbuyerbyitem(itemid){
    const mysql = require('mysql2/promise');
    const connection = await mysql.createConnection({ host: 'localhost', user: db_username, password: db_password, database: db_name});
    const rows = await connection.execute('SELECT * FROM `Buyer` WHERE (`ItemId`) = ? ',[itemid]);
    return rows;
}

async function dbfindmessagebyitem(itemid){
    const mysql = require('mysql2/promise');
    const connection = await mysql.createConnection({ host: 'localhost', user: db_username, password: db_password, database: db_name});
    const rows = await connection.execute('SELECT * FROM `Message` WHERE (`ItemId`) = ? ',[itemid]);
    console.log(rows);
    return rows;
}


async function dbinsertbuyer(userid,itemid){
    const mysql = require('mysql2/promise');
    const connection = await mysql.createConnection({ host: 'localhost', user: db_username, password: db_password, database: db_name});
    const rows = await connection.execute('INSERT INTO `Buyer` (`UserId`,`ItemId`) VALUES(?,?) ',[userid,itemid]);
    return rows;
    await connection.end();
}

async function dbinsertmessage(message,userid,senderid,itemid){
    const mysql = require('mysql2/promise');
    const connection = await mysql.createConnection({ host: 'localhost', user: db_username, password: db_password, database: db_name});
    const rows = await connection.execute('INSERT INTO `Message` (`MessageBody`,`UserID`,`TimeStamp`,`SenderId`,`ItemId`) VALUES(?,?,CURRENT_TIMESTAMP(),?,?) ',[message,userid,senderid,itemid]);
    return rows;
    await connection.end();
}

async function dbfinduser(userid){
    const mysql = require('mysql2/promise');
    const connection = await mysql.createConnection({ host: 'localhost', user: db_username, password: db_password, database: db_name});
    let rows;
    rows = await connection.execute('SELECT * FROM `Users` WHERE `Id` = ?',[userid]);
    return rows;
}

async function dbfindmessage(userid, senderid){
    console.log("I'm in here2");
    const mysql = require('mysql2/promise');
    const connection = await mysql.createConnection({ host: 'localhost', user: 'root', password: 'password', database: 'Website'});
    let rows;
    rows = await connection.execute('SELECT * FROM `Message` WHERE `UserID` = ? AND `SenderId` = ?',[userid,senderid]);
    console.log("rows",rows);
    return rows;
}

router.post('/sendmessage/:itemid', async function(req, res, next){
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
      req.session.uploadmessage="Nice try! can't buy what you're selling!";
      res.redirect('/item/'+itemid);
        // res.redirect(200,'/item/'+itemid,{message: "Nice try! can't buy what you're selling!"});
     }
     else {
         let messageinsert = await dbinsertmessage(message, sellerid, buyerid, itemid);
         //console.log("message insert: ", messageinsert);
         //console.log("itemid: ", itemid);
         //console.log("message: ", message);
         //console.log("sellerid: ", sellerid);
         //This will re-direct to messages
         res.redirect('/users/dashboard/');
     }
  }
});

//router.get('/sendmessage', async function(req, res, next){
//  // let user = await req.session.user;
//  res.redirect('/users/dashboard/');
//});

/*router.get('/sendmessage/:itemid', async function(req, res, next){
  // let user = await req.session.user;
  let itemid = await req.params.itemid;
  res.redirect('/item/'+itemid);
});
*/



async function dbfinditem(id){
    const mysql = require('mysql2/promise');
    const connection = await mysql.createConnection({ host: 'localhost', user: 'root', password: 'password', database: 'Website'});
    let rows;
    rows = await connection.execute('SELECT * FROM `Item` WHERE `Id` = ? ' ,[id]);
    return rows;
}


//gives a list of users that are interested in item
router.get('/checkselling/:itemid', async function(req, res, next){
    let user = await req.session.user;
     //Remember that you can also do hidden inputs, so data you send from here to handlebars can be a hidden part of a form somewhere
    let itemid = await req.params.itemid;
    let itemresult = await dbfinditem(itemid);
    let item = itemresult[0][0];
    let buyer = await dbfindbuyerbyitem(itemid);
    //console.log("buyer",buyer);
    //sometimes you won't have a username, and this will be weird
    let myuser = await dbcheck(user);
    let myuserid = myuser[0][0].Id;
    let buyers;
    let users;
    let buyersarray;
    let usersarray = [];
    if(buyer[0]) {
        console.log("I'm in here");
        buyers = buyer[0];
        console.log("buyer",buyer[0]);
        for (let i = 0; i < buyers.length; i++) {
            let userobject = {
                name : '',
                message : '',
                itemid : '',
                timestamp: ''
            };
            let buyerid = buyers[i].UserId;
            users = await dbfinduser(buyers[i].UserId);
            console.log("myuserid",myuserid);
            console.log("buyerid",buyerid);
            let messageinfo = await dbfindmessage(myuserid,buyerid);
            console.log("messageinfo",messageinfo);
            if(messageinfo[0].length>0){
              let message = messageinfo[0][0].MessageBody;
              let timestamp = message[0][0].TimeStamp;
              let messageid = message[0][0].Id;
              console.log("message", messageinfo[0][0].MessageBody);
              if(users && message) {
                userobject.name = users[0][0].Name;
                userobject.message = message;
                userobject.timestamp = timestamp;
                userobject.itemid  = itemid;
                usersarray.push(userobject);
              }
            }
        }
    }
    res.render('messagebuyers', { user : user, buyers : usersarray, item : item });
});

router.get('/checkmessage/:itemid', async function(req, res, next) {
   let user = await req.session.user;
   let itemid = await req.params.itemid;
   let itemresult = await dbfinditem(itemid);
   let item = itemresult[0][0];
   let userrow = await dbcheck(user);
   let userid = userrow[0][0].Id;
   let sellerdb = await dbfindsellerbyitem(itemid);
   let sellerid = sellerdb[0][0].UserId;
   let sellernamedb = await dbfinduser(sellerid);
   let sellername = sellernamedb[0][0].Name;
   //may or may not include
   //let sellerusername = sellernamedb[0][0].Username;
   let messagedb = await dbfindmessage(userid,itemid);
   let message=[];
   if(messagedb[0].length>0){
       message = messagedb[0][0].MessageBody;
    }
   res.render('sentmessage', { user : user, message : message, item : item, seller : sellername });
});

async function dbitemdelete(itemid){
  const mysql = require('mysql2/promise');
  const connection = await mysql.createConnection({ host: 'localhost', user: db_username, password: db_password, database: db_name});
  await connection.execute('DELETE FROM `Message` WHERE `ItemId` = ?',[itemid]);
  await connection.execute('DELETE FROM `Seller` WHERE `ItemId` = ?',[itemid]);
  await connection.execute('DELETE FROM `Buyer` WHERE `ItemId` = ?',[itemid]);
  await connection.execute('DELETE FROM `Item` WHERE `Id` = ?',[itemid]);
  await connection.end();
  //maybe maket his t/f if for noerror/error
  return true;
}
router.get('/deletemessage/:itemid', async function(req, res, next){
    let itemid = await req.params.itemid;
    await dbitemdelete(itemid);
    res.redirect('/users/dashboard');
});



//all messages logic will go here
module.exports = router;
