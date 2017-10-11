var emailHandler = require("./emailing");
var express = require('express');
var router = express.Router();
var names = require("./names");

router.route('/').post(emailHandler);

router.route('/people').get(
  function(req, res) {
    res.json(names);
});

router.route('/time').get(
  function(req, res) {
    console.log("sending time!!!" + Date());
    var server_time = new Date() - 0;
    res.json({time: server_time});
});

module.exports = router;