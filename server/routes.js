var emailHandler = require("./emailing");
var express = require('express');
var router = express.Router();
var names = require("./names");

var loans = require("./controllers/server.loan.controller.js") ;
var users = require("./controllers/server.user.controller.js") ;

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

// Loan CRUD routing ~

// > Multiple loans
router.route('/loans').get(loans.list) ;
router.route('/loans').post(loans.create) ;

// > Individual loan
router.route('/loan/:loanID').get(loans.read) ;
router.route('/loan/:loanID').put(loans.update) ;
router.route('/loan/:loanID').delete(loans.delete) ;

router.param('loanID', loans.loanByID) ;

// User CRUD routing ~

// > Multiple users
router.route('/users').get(users.list) ;
router.route('/users').post(users.create) ;

// > Individual user
router.route('/user/:userID').get(users.read) ;
router.route('/user/:userID').put(users.update) ;
router.route('/user/:userID').delete(users.delete) ;

router.param('userID', users.userByID) ;

module.exports = router;