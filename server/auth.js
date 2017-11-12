// var mongoose = require('mongoose');
// mongoose.Promise = global.Promise;
// TODO: add this to env vars
var secret = "Lean MEAN Client Machine";

// User Registration route
// back end logic of on create??
// router.post('/users', function(req, res) {
//   var user = new User({
//     email: req.body.email,
//     username: req.body.username,
//     password: req.body.password,
//   });

//   if (req.body.username && req.body.password) {
//     user.save(function(err, new_object) {
//       console.log(err, new_object);

//       if (err) {
//         if (err.toJSON().code == 11000) {
//           res.json({ 
//             err,
//             message: 'Username or email already exist!' ,
//           });
//         }
//         else {
//           res.json({ 
//             message: err
//           });
//         } 
//       } else {
//         res.json({ message: 'User created!' });
//       }
//     });
//   } else {
//     res.json({ error: 'Ensure username, email or password was provided' });
//   }
// });

// User Login Route
// router.post('/authenticate',
//   function(req, res) {
//     User.findOne({ username: req.body.username }).select('email username password').exec(
//       function(err, user) {
//         if (err) throw err;
//         if (!user) {
//           console.log("NOPE USER", err, user);
//           console.log(req.body);
//           res.json({ error: 'Could not authenticate user' });
//         } else if (!req.body.password)
//           res.json({ error: 'No password provided!' });
//         else {
//           var validPassword = user.comparePassword(req.body.password);
//           if (validPassword) {
//             var user_details = {
//               username: user.username,
//               email: user.email,
//             }
//             var token = jwt.sign(user_details, secret, { expiresIn: '1m' });
//             res.json({ success: true, message: 'User Authenicated!', token });
//           } else res.json({ error: 'Could not authenticate password' });
//         }
//       });
//   });

module.exports = {
  // Auth middleware
  //      Send to login if no token with no message
  //      IF not valid, display you need to log in again
  //      If valid, continue to next callback

  contact: function(req, res, next) {
    console.log("THERE'S A TOKEN ON THE CLIENT!!!");
    // res.redirect('/login');
    // figure out which route to go...
    // "/profile"
  },

  authenticate: function(req, res, next) {

    var token = req.body.token;

    if (token) {
      jwt.verify(token, secret, function(err, decodedToken) {
        if (err) {
          // res.redirect with params
          console.log("Bad Token");
          res.json({ 
            error: 'Token invalid' 
          });
        }
        // REAL next
        else {
          console.log("GUUUD Token");
          req.body.token = decodedToken;
          next();
        }
      });
    } else  {
      console.log("No token at all");
      next();
      // res.redirect('/login');
    }
  },
}