var express = require('express');
const { check, validationResult } = require('express-validator');
var router = express.Router();
const mysql = require('mysql');

let dbCon=mysql.createPool({
	    host : 'localhost',
		user : 'admin_fulda',
		password : 'fuldaschool',
		database : 'admin_fulda'
});


router.get('/products', function(req, res, next) {
	try{
	   	dbCon.getConnection(function(error, conn){
			if(!!error){
				conn.release();
				res.json({result:[]});
			}else{
				conn.query("select * from `Item` WHERE status=1" , function (err, rows, fields){
					conn.release();
					if(!!err){
						res.json({result:[]});
					}else{
						res.json(rows);
					}
				});
			}
		});
	}catch(err){
		res.json({result:[]});
	}
});

router.get('/products/:search', function(req, res, next) {
	try{
		console.log("==>");
	   	dbCon.getConnection(function(error, conn){
			if(!!error){
				conn.release();
				res.json({result:[]});
			}else{
				conn.query("select * from `Item` WHERE `Description` LIKE ? AND Status = 1",[req.params.search] , function (err, rows, fields){
					conn.release();
					if(!!err){
						res.json({result:[]});
					}else{
						res.json(rows);
					}
				});
			}
		});
	}catch(err){
		res.json({result:[]});
	}
});

router.get('/products/:id', function(req, res, next) {
	try{
	   	dbCon.getConnection(function(error, conn){
			if(!!error){
				conn.release();
				res.json({result:[]});
			}else{
				conn.query("select * from `Item` WHERE id=? AND Status = 1",[req.params.id] , function (err, rows, fields){
					conn.release();
					if(!!err){
						res.json({result:[]});
					}else{
						res.json(rows);
					}
				});
			}
		});
	}catch(err){
		res.json({result:[]});
	}
});

router.get('/buyorders/:id', function(req, res, next) {
	try{
	   	dbCon.getConnection(function(error, conn){
			if(!!error){
				conn.release();
				res.json({result:[]});
			}else{
				conn.query("SELECT * FROM `Buyer` b INNER JOIN `Item` i ON b.ItemId=i.id WHERE b.`UserId` = ?",[req.params.id] , function (err, rows, fields){
					conn.release();
					if(!!err){
						res.json({result:[]});
					}else{
						res.json(rows);
					}
				});
			}
		});
	}catch(err){
		res.json({result:[]});
	}
});

router.get('/sellorders', function(req, res, next) {
	try{
	   	dbCon.getConnection(function(error, conn){
			if(!!error){
				conn.release();
				res.json({result:[]});
			}else{
				conn.query("SELECT * FROM `Seller` WHERE (`UserId`) = ?",[req.headers.userid] , function (err, rows, fields){
					conn.release();
					if(!!err){
						res.json({result:[]});
					}else{
						res.json(rows);
					}
				});
			}
		});
	}catch(err){
		res.json({result:[]});
	}
});

router.get('/messages/:id', function(req, res, next) {
	try{
	   	dbCon.getConnection(function(error, conn){
			if(!!error){
				conn.release();
				res.json({result:[]});
			}else{
				conn.query("SELECT * FROM `Message` WHERE (`UserID` = ? OR `SellerID` = ?) AND `ItemId` = ?",[req.headers.userid,req.headers.userid,req.params.id] , function (err, rows, fields){
					conn.release();
					if(!!err){
						res.json({result:[]});
					}else{
						res.json(rows);
					}
				});
			}
		});
	}catch(err){
		res.json({result:[]});
	}
});

router.get('/messages', function(req, res, next) {
	try{
	   	dbCon.getConnection(function(error, conn){
			if(!!error){
				conn.release();
				res.json({result:[]});
			}else{
				conn.query("SELECT * FROM `Message` WHERE (`UserID` = ? OR `SellerID` = ?)",[req.headers.userid,req.headers.userid,req.headers.itemid] , function (err, rows, fields){
					conn.release();
					if(!!err){
						res.json({result:[]});
					}else{
						res.json(rows);
					}
				});
			}
		});
	}catch(err){
		res.json({result:[]});
	}
});

router.post('/messages', function(req, res, next) {
	try{
	   	dbCon.getConnection(function(error, conn){
			if(!!error){
				conn.release();
				res.json({code:1,message:'Unable to send message at this time,kindly retry'});
			}else{
				conn.query("select UserId from Seller WHERE Itemid=?",[req.body.itemid] , function (err, rows, fields){
					if(!!err){
						conn.release();
						res.json({code:1,message:'Unable to send message at this time,kindly retry'});
					}else{
						let Seller=rows[0].UserId;
						conn.query("INSERT INTO `Buyer` (`UserId`,`ItemId`) VALUES(?,?)",[req.body.userid,req.body.itemid] , function (err, rows, fields){
							if(!!err){
								conn.release();
								res.json({code:1,message:'Unable to send message at this time,kindly retry'});
							}else{
								conn.query("INSERT INTO `Message` (`MessageBody`,`UserID`,`TimeStamp`,`SenderId`,`ItemId`) VALUES(?,?,CURRENT_TIMESTAMP(),?,?)",[req.body.message,req.body.userid,Seller,req.body.itemid] , function (err, rows, fields){
									conn.release();
									if(!!err){
										res.json({code:1,message:'Unable to send message at this time,kindly retry'});
									}else{
										if(rows.affectedRows===1){
											res.json({code:0,message:'Message Sent Successfully.'});
										}else{
											res.json({code:1,message:'Unable to send message at this time,kindly retry'});
										}
									}
								});
							}
						});
					}
				});
			}
		});
	}catch(err){
		res.json({code:1,message:'Unable to send message at this time,kindly retry'});
	}
});

router.post('/login', function(req, res, next) {
	try{
	   	dbCon.getConnection(function(error, conn){
			if(!!error){
				conn.release();
				res.json({code:1,message:'Sorry unable to access the server at this time'});
			}else{
				conn.query("select * from `Users` WHERE username=? AND password =?",[req.body.username,req.body.password] , function (err, rows, fields){
					conn.release();
					if(!!err){
						res.json({code:1,message:'Sorry unable to access the server at this time'});
					}else{
						if(rows.length==1){
							res.json({code:0,message:rows});
						}else{
							res.json({code:1,message:'Sorry invalid username or password'});
						}
					}
				});
			}
		});
	}catch(err){
		res.json({code:1,message:'Sorry unable to access the server at this time'});
	}
});

router.post('/register', function(req, res, next) {
	try{
		let emailSplit = req.body.email.split("@");
		if(emailSplit[1]!=="mail.sfsu.edu"){
		    res.json({code:1,message:'Only SFSU students may register.'});
		}else{
			dbCon.getConnection(function(error, conn){
				if(!!error){
					conn.release();
					res.json({code:1,message:'Sorry unable to access the server at this time'});
				}else{
					conn.query("select * from `Users` WHERE username=? AND password =?",[req.body.username,req.body.password] , function (err, rows, fields){
						conn.release();
						if(!!err){
							res.json({code:1,message:'Sorry unable to access the server at this time'});
						}else{
							if(rows.affectedRows===1){
								res.json({code:0,message:rows});
							}else{
								res.json({code:1,message:'Sorry invalid username or password'});
							}
						}
					});
				}
			});
	   }
	}catch(err){
		res.json({code:1,message:'Sorry unable to access the server at this time'});
	}
});

module.exports = router;