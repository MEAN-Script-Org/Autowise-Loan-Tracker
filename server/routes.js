var emailHandler = require("./emailing");
var express = require('express');
var router = express.Router();

var loans = require("./db/loans.crud.js") ;
var users = require("./db/users.crud.js") ;

router.route('/send').post(emailHandler);

router.route('/people').get(
  function(req, res) {
    res.json({});
});

router.route('/time').get(
  function(req, res) {
    // Return current time
    console.log("sending time!!!" + Date());
    var server_time = new Date() - 0;
    res.json({time: server_time});
});

// > Multiple loans
router.route('/loans')
      .get(loans.list)
      .post(loans.create);

// > Individual loan
router.route('/loan/:loanID')
      .get(loans.read)
      .put(loans.update)
      .delete(loans.delete) ;

router.param('loanID', loans.loanByID) ;

// > Multiple users
router.route('/users')
      .get(users.list)
      .post(users.create) ;

// > Individual user
router.route('/user/:userID')
      .get(users.read)
      .put(users.update)
      .delete(users.delete) ;

router.param('userID', users.userByID) ;

module.exports = router;