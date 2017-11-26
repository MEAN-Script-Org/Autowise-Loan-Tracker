var jwt = require('jsonwebtoken');
var User = require('./db/users.model.js') ;
var secret = "Lean MEAN Client Machine";

function invalid(req, res, next) {
  req.body.token = false;
  res.redirect("/profile");
  // next();
}

module.exports = {
  // split by ","
  // only do a check in the front end... can't be the most secure thing ever

  // User Login Route
  login: function(req, res) {
    User.findOne({ username: req.body.username }).exec(
      function(err, user) {
        if (err) throw err;

        if (!user) {
          res.json({ error: 'Invalid Username and password combination' });
        } 
        else if (!req.body.password) {
          res.json({ error: 'No password provided!' });
        } 
        else {
          var validPassword = user.comparePassword(req.body.password);

          if (validPassword) {
            var user_details = {
              id: user._id,
              name: user.name,
              email: user.email,
              isAdmin: user.isAdmin,
              username: user.username,
              md5hash: req.body.md5hash,
              isSuperAdmin: user.isSuperAdmin,
            }

            // turn token into a two peace deal
            var token = jwt.sign(user_details, secret, { expiresIn: '3h' });
            res.json(token);
          } 
          else
            res.json({ error: 'Invalid Username and password combination' });
        }
    });
  },

  decodeToken: function(req, res, next, token_array) {
    console.log(req.body, token);

    if (!token_array) {
      req.body.token = "nothing ever";
      next();
    }
    else {
      if (typeof token_array == 'string')
        token_array = token_array.split(",");
      var token = token_array[0];
      var md5hash = token_array[1];

      jwt.verify(token, secret, function(err, decodedToken) {
        if (err) {
          console.log(token, err, decodedToken);
          console.log("INVALID TOKEN!!!");
          invalid(req, res, next);
        }
        else if (decodedToken.md5hash != md5hash) {
          console.log(decodedToken, md5hash);
          console.log("GOOD TRY");
          invalid(req, res, next);
        }
        else {
          // REAL NEXT
          console.log(decodedToken);
          req.body.token = decodedToken;
          next();
        }
      });
    }
  },

  // Auth middleware *mess warning*
  //      Send to login if no token with no message
  //      IF not valid, display you need to log in again
  //      If valid, continue to next callback
  authenticate: function(req, res, next) {
    var token_array = req.body.token;
    
    if (token_array) {

      // console.log(token_array);
      if (typeof token_array == 'string')
        token_array = token_array.split(",");

      var token = token_array[0];
      var md5hash = token_array[1];

      jwt.verify(token, secret, function(err, decodedToken) {
        if (err || decodedToken.md5hash != md5hash) {
          console.log("Bad Token");
          console.log(decodedToken, md5hash);

          ejs_msg = "Your session expired. Please log in again";
          ejs_class = "alert bg-warning";

          // this creates an infinite loopy...
          res.render('login', {
              message: ejs_msg,
              type: ejs_class,
              path: '',
          });
        }

        // REAL next
        else {
          // console.log("GUUUD Token");
          // console.log(decodedToken);
          req.body.token = decodedToken;
          next();
        }
      });
    } 
    else {
      // console.log("WHAT ARE YOU DOING HERE?!") ;
      // this means no token passed at all... go bye bye
      console.log("no token evah");
      // console.log(req._parsedOriginalUrl, req.body); // , req.body, req.body.token, req.query);
      res.json({});
      // next();
      // res.redirect('/login');
    }
  },
}