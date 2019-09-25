var express = require('express');
var router = express.Router();

/* GET users listing. */
//this is totally separtae from main routes and will be used later when we add users -Greg
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
