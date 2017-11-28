var express = require('express');

var auth = require("./auth.js");
var loans = require('./db/loans.crud.js');
var login_routes = require('./login_routes.js');
//----------------------------------------------------------------------------------------------------------------------
// PROFILE ROUTING
//======================================================================================================================

var profile_routes = express.Router();

//----------------------------------------------------------------------------------------------------------------------
// User (admin and customer) home/hub routing
//----------------------------------------------------------------------------------------------------------------------
profile_routes.route('/:token').all(
  login_routes.login,
  function(req, res, next) {
    // next page routing based on token status and admin
    var token = req.body.token;
    console.log();

    if (token.isAdmin || token.isSuperAdmin)
      res.render("admin", {path: "../"});
    else
      res.render("customerHub", {path: "../"});
});

//----------------------------------------------------------------------------------------------------------------------
// Admin user permissions routing
//----------------------------------------------------------------------------------------------------------------------
profile_routes.route('/changePermissions/:token').all(function(req, res) {
  res.render("changePermissions", {path: "../../"});
});

//----------------------------------------------------------------------------------------------------------------------
// Customer warranty plans routing
//----------------------------------------------------------------------------------------------------------------------
profile_routes.route('/warranties/:loan_id/:token').post(loans.update).all(function(req, res) {
  res.render("warranties", {path: "../../../"});
});

profile_routes.param('loan_id', loans.loanByID);
profile_routes.param('token', auth.decodeToken);

module.exports = profile_routes;