var express = require('express');
var router  = express.Router();

//database parameters
const host    = 'localhost';
const user    = 'gsds';
const password= 'password';
const database= 'Website';

	
async function dbcheck(username){
	const mysql      = require('mysql2/promise');
	const connection = await mysql.createConnection({ host: host, user: user, password: password, database: database});
    const rows 		 = await connection.execute('SELECT * FROM `Users` WHERE `Username` = ?',[username]);
    return rows;
}

async function dblogin(username) {
    const rows = await connection.execute('SELECT `Password` FROM `Users` WHERE `Username` = ?',[username]);
    return rows;
}

async function dbregister(name,username,password,email) {
	const mysql      = require('mysql2/promise');
	const connection = await mysql.createConnection({ host: host, user: user, password: password, database: database});
    const rows = await connection.execute('INSERT INTO `Users` (`Name`,`Username`,`Password`,`Email` ) VALUES(?,?,?,?) ',[name,username,password,email]);
    return rows;
}

async function dbget_pending_items(){
	const mysql      = require('mysql2/promise');
	const connection = await mysql.createConnection({ host: host, user: user, password: password, database: database});
    const rows = await connection.execute('SELECT * FROM `Item` WHERE (`Status`) = ? ',[0]);
    return rows;
}

async function dbget_approved_items(){
	const mysql      = require('mysql2/promise');
	const connection = await mysql.createConnection({ host: host, user: user, password: password, database: database});
    const rows = await connection.execute('SELECT * FROM `Item` WHERE (`Status`) = ? ',[1]);
    return rows;
}

async function dbfind_item(itemid){
	const mysql      = require('mysql2/promise');
	const connection = await mysql.createConnection({ host: host, user: user, password: password, database: database});
    const rows = await connection.execute('SELECT * FROM `Item` WHERE (`Id`) = ? ',[itemid]);
    return rows;
}

async function dbupdate_item(itemid,nstatus){
	const mysql      = require('mysql2/promise');
	const connection = await mysql.createConnection({ host: host, user: user, password: password, database: database});
	var   sql        = "UPDATE `Item` SET `Status` =? WHERE `Id` = ?";
    const rows = await connection.execute(sql, [nstatus, itemid]);
    return rows;
}

async function dbdelete_item(itemid){
	const mysql      = require('mysql2/promise');
    const connection = await mysql.createConnection({ host: host, user: user, password: password, database: database});
    await connection.execute('DELETE FROM `Message` WHERE `ItemId` = ?',[itemid]);
    await connection.execute('DELETE FROM `Seller` WHERE `ItemId` = ?',[itemid]);
    await connection.execute('DELETE FROM `Buyer` WHERE `ItemId` = ?',[itemid]);
	var   sql        = "DELETE FROM `Item` WHERE `Id` = ?";
    const rows = await connection.execute(sql, [itemid]);
    return rows;
}



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
router.get('/admindashboard' , async function(req, res, next){
	 page_title = "Admin Dashboard";
	 //console.log("Logged User",req.session.a_user);
	 //check if an admin user is logged in before proceeding
     if(!req.session.a_user) {
		//go back to login page with a message
		req.session.validate = true;
		res.redirect('a_login');
	}
     //Logged in user details
     let a_user 	= await req.session.a_user;
	 let a_userId   = await req.session.a_userId;
	 let a_userName = await req.session.a_name;
	 let a_userEmail= await req.session.a_email
	 
     let penditems_result = await dbget_pending_items();
	     penditems        = penditems_result[0];

	 let approveditems_result  = await dbget_approved_items();
		 approveditems         = approveditems_result[0];
	 //console.log("Items: ", penditems);
  
     res.render('admindashboard',{ message: "", title: page_title, display_msg: false, penditems: penditems, approveditems: approveditems, a_user: a_user, user: a_user, a_userName: a_userName});
});
//Analytics
router.get('/analytics' , async function(req, res, next){
    page_title = "Analytics";
    //console.log("Logged User",req.session.a_user);
    //check if an admin user is logged in before proceeding
    if(!req.session.a_user) {
       //go back to login page with a message
       req.session.validate = true;
       res.redirect('a_login');
   }
    //Logged in user details
    let a_user 	   = await req.session.a_user;
    let a_userId   = await req.session.a_userId;
    let a_userName = await req.session.a_name;
    let a_userEmail= await req.session.a_email
    

 
    res.render('analytics',{ message: "", title: page_title, display_msg: false, a_user: a_user, user: a_user, a_userName: a_userName});
});

//this will handle Admin User Login - Femi
router.post('/req-admin-login' , async function(req, res, next) {
    var user = await req.body.loginusername;
    var pass = await req.body.loginpassword;
	//Do a bit of validation before proceeding
	if(user == ""||pass == "" ) {
		//go back to login page with a message
		req.session.validate = true;
		res.redirect('a_login');
    }
    //check that the user is an admin
    if ('admin' != user) {
        //Not an Admin please go back to login
        req.session.wrong_user = true;
        res.redirect('a_login');
    }

    let resultbody = "";
    let html       = "";
    let found = false;
    let indb  = await dbcheck(user);
	//console.log("User details: ",indb[0]);
	//console.log("No of Recs: ",indb[0].length);
    if (indb[0].length > 0) {
        found = true;
    }

    if (found) {
        let resultbody = indb[0];
        // console.log("Posted Password: ",pass);
	    //console.log("Password from Database: ",resultbody[0].Password);
		//check password  
		if (resultbody[0].Password != pass) {
			//Incorrect Password please go back to login
			req.session.wrong_user = true;
		    res.redirect('a_login');
        }
        
        req.session.a_user   = user;
        req.session.a_userId = resultbody[0].Id;
        req.session.a_name   = resultbody[0].Name;
        req.session.a_email  = resultbody[0].Email;
        req.session.user     = user; //to persist admin also in the app
        let url = "admindashboard";
        res.redirect("/admin/" + url);
        
    }else{
      //Incorrect Username please go back to login
	  req.session.wrong_user = true;
      res.redirect("/admin/" + 'a_login');
   }
});

//logout
router.get('/logout' , async function(req, res, next){
   req.session.reset();
   res.redirect("/admin/" + 'a_login');
});


//load Login page
router.get('/a_login', function(req, res, next) {
   page_title = "Admin User Login";
   if(req.session.admin) {
       res.render('a_login', { message : "Please Login with the Admin Credentials", title: page_title, display_msg: true});
   }else if(req.session.validate) {
       res.render('a_login', { message : "Please Enter Your Login Details", title: page_title, display_msg: true});
	   req.session.validate = false;
   }
   else if(req.session.wrong_user) {
       res.render('a_login', { message : "Wrong Username or Password. Please try again", title: page_title, display_msg: true});
	   req.session.wrong_user = false;
   }
   else{
      res.render('a_login', { message: "Hello", title: page_title, display_msg: false});
   }
});

//Redirect root admin route to dashboard
router.get('/', function(req, res, next) {
   
       //Redirect to dashboard
		res.redirect('/admin/admindashboard');
   
 });

//this will handle Item Approval and Rejection by Admin - Femi
router.get('/changestatus/:itemid' , async function(req, res, next) {
    var newstatus = 1;
    var itemid    = await req.params.itemid;
    console.log("Itemid",itemid);
    let dbresults = dbupdate_item(itemid,newstatus);

    if (dbresults) {
       let url = "admindashboard";
       res.redirect("/admin/" + url);
        
    }else{
      let url = "admindashboard";
      res.redirect("/admin/" + url);
   }
});

//this will handle Item deletion by Admin - Femi
router.get('/deleteitem/:itemid' , async function(req, res, next) {
    var itemid    = await req.params.itemid;

    let dbresults = dbdelete_item(itemid);

    if (dbresults) {

       let url = "admindashboard";
       res.redirect("/admin/" + url);
        
    }else{
      let url = "admindashboard";
      res.redirect("/admin/" + url);
   }
});


module.exports = router;