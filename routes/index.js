var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/users', function(req, res, next) {
  // get data from db
  // ...
  
  res.send({ title: 'Express' });
});

router.get('/users_statistic', function(req, res, next) {
  res.send({ title: 'Express' });
});

module.exports = router;
