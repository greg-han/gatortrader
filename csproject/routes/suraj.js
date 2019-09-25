var express = require('express');
var router = express.Router();

router.get('/suraj',function(req, res, next) {
  //some mysql
  res.render('suraj', { title: 'I am suraj' });
});

module.exports = router;
