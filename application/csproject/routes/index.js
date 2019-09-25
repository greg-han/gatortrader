var express = require('express');
var router = express.Router();

//mysql up here, save the dat ainto an object.
/* GET home page. */
router.get('/', function(req, res, next) {
  //some mysql
  res.render('index', { title: 'About Team 14' });
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
