var express = require('express');
var router = express.Router();
var { getUserStatistics, getUsers } = require('../sqlite/index');

router.get('/users', function(req, res, next) {
  getUsers((err, rows) => {
    if (err) {
      return res.status(400).send(err);
    }
    res.send(rows);
  })  
});

router.get('/users_statistic', function(req, res, next) {
  getUserStatistics((err, rows) => {
    if (err) {
      return res.status(400).send(err);
    }
    res.send(rows);
  })
});

module.exports = router;
