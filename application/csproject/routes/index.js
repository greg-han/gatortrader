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



module.exports = router;
