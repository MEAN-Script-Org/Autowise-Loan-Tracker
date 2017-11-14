var jwt = require('jsonwebtoken');
var User = require('./db/users.model.js') ;
var secret = "Lean MEAN Client Machine";

module.exports = {
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
              email: user.email,
              isAdmin: user.isAdmin,
              username: user.username,
            }

            var token = jwt.sign(user_details, secret, { expiresIn: '10h' });
            res.json(token);
          } 
          else
            res.json({ error: 'Invalid Username and password combination' });
        }
    });
  },

  decodeToken: function(req, res, next, token) {
    if (!token) {
      req.token = "nothing ever";
      next();
    }
    else {
      jwt.verify(token, secret, function(err, decodedToken) {
        if (err) {
          console.log("INVALID TOKEN!!!");
          console.log(token, err, decodedToken);
          req.token = false;
          next();
        }
        else {
          // console.log(token);
          console.log(decodedToken);
          req.token = decodedToken;
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
    var token = req.body.token;

    if (token) {
      jwt.verify(token, secret, function(err, decodedToken) {
        if (err) {
          console.log("Bad Token");

          if (req.body.no_next) {
            res.json({ 
              error: 'Token invalid' 
            });
          } else {
            ejs_msg = "Your session expired. Please log in again";
            ejs_class = "alert bg-warning";

            // this creates an infinite loopy...
            res.render('login', {
                message: ejs_msg,
                type: ejs_class,
            });
          }
        }

        // REAL next
        else {
          console.log("GUUUD Token");
          // console.log(decodedToken);

          if (!req.body.no_nextext)
            res.json(token);
          else {
            req.body.token = decodedToken;
            next();
          }
        }
      });
    } 
    else {
      if (req.body.no_next) {
        res.json({ 
          error: "No token at all" 
        });
      } 
      else {
        // console.log(req._parsedOriginalUrl, req.body, req.token, req.query);
        next();
        // res.redirect('/login');
      }
    }
  },
}