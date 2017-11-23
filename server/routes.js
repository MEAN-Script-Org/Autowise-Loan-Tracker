var emailHandler = require("./emailing");
var express = require('express');
var router = express.Router();

var auth  = require("./auth.js") ;
var loans = require("./db/loans.crud.js") ;
var users = require("./db/users.crud.js") ;

//----------------------------------------------------------------------------------------------------------------------
// AUTHENTICATION, EMAILS, ETC.
//----------------------------------------------------------------------------------------------------------------------

router.route('/auth')
      .post(auth.authenticate);

router.route('/email')
      .post(emailHandler);

router.route('/info').get(
  // fake funtion
  // future equivalent of 'users.read'
  function(req, res) {
    res.json({
      _id: 123456,
      email: "marcial.abrahantes@gmail.com",
      username: "Marcial1234",
      isAdmin: true,
    });
});

//----------------------------------------------------------------------------------------------------------------------
// LOANS
//----------------------------------------------------------------------------------------------------------------------

// Multiple loans
router.route('/loans')
      .put(loans.getAll)
      .post(loans.create);
      
// Individual loan
router.route('/loan/:loanID')
      .get(loans.read)
      .put(loans.update)
      .delete(loans.delete) ;
      
// Multiple loans under the specified user
router.route('/loans/:userID')
      .get(loans.loansByUserID);
      
// Multiple loans under the currently logged-in User
router.route('/loansByUser/:token')
      .get(users.userByID, loans.loansByUserID);
      
//----------------------------------------------------------------------------------------------------------------------
// USERS
//----------------------------------------------------------------------------------------------------------------------

// > Individual user
router.route('/user/:userID')
      .get(users.read)
      .put(users.update)
      .delete(users.delete) ;

// > 'Multiple' users
// I don't have a token when I create one, so ofc it's gonna be bad...
router.route('/users')
      .get(users.getAll, users.returnUsers) ;

//----------------------------------------------------------------------------------------------------------------------
// Routing parameters
//----------------------------------------------------------------------------------------------------------------------
router.param('loanID', loans.loanByID) ;
router.param('userID', users.userByID) ;
router.param('token', auth.decodeToken);
// router.param('userInfo', function(req, res, next, userInfo) { req.userInfo = userInfo; next(); }) ;

module.exports = router;