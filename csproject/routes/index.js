var express = require('express');
var router = express.Router();

//mysql up here, save the dat ainto an object.
/* GET home page. */
router.get('/', function(req, res, next) {
  //some mysql
  res.render('index', { title: 'About Team 14' });
});

module.exports = router;
