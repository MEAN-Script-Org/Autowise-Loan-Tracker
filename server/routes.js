var emailHandler = require("./emailing");
var express = require('express');
var router = express.Router();
var names = require("./names");

var loans = require("./controllers/server.loan.controller.js") ;

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

// Loan CRUD routing
router.route('/loans').get(loans.list) ;
router.route('/loans').post(loans.create) ;
router.route('/loans').put(loans.update)
router.route('/loans').delete(loans.delete);

module.exports = router;