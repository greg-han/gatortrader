var express = require('express');
var router = express.Router();

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
router.get('/', function(req, res, next) {
  //some mysql
  let user = '';
  let signedup = '';
  console.log("req sesh: ",req.session.user);
  if(req.session.user != undefined){
     user = req.session.user;
  }
  if(req.session.signedup != undefined){
    signedup = "true";
  }
  res.render('index', { title: 'About Team 14', user : user,signedup: signedup });
})

router.get('/suraj',function(req, res, next) {
  res.render('suraj', { title: 'I am suraj' });
});

router.get('/shubham',function(req, res, next) {
  res.render('shubham', { title: 'I am shubham' });
});

router.get('/michael',function(req, res, next) {
  res.render('michael', { title: 'I am michael' });
});

router.get('/greg',function(req, res, next) {
  res.render('greg', { title: 'I am greg' });
});



module.exports = router;
