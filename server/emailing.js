var atob = require('atob');
var nodemailer = require('nodemailer');

var money_formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  // the default value for minimumFractionDigits depends on the currency
  // minimumFractionDigits: 2,
});

var format_email_html = function (form) {
  var subject, message ;
  
  // Switch statement based on email type
  // Types are:
  // - Warranty plan interest
  // - Default type
  switch(form.type) {
    
    // Warranty plan interest email
    case 'warranty':
      subject = "Warranty plan interest for customer #" + form.userID ;
      
      message = [
        "",
        form.message,
        "",
        "",
        "This is an automatically generated email message"
      ];
      
      break ;
      
    // Default email
    default:
      subject = "Autowise: Your loan application has been updated";
      
      // Create and insert a link to the user's loan inside the message body
      var app_link = ["<a href='", process.env.BASE_URL, "loan/", form.id, "' target='_blank'>here</a>."].join("");
      console.log(app_link);
      
      message = [
        "",
        "Hi " + form.name + "!",
        "",
        form.message,
        "",
        "You can check your application by clicking " + app_link,
        "",
        "",
        "Sincerely,",
        "",
        "<b>Autowise Buying Service, Inc</b>"
      ];
      
      break ;
  }
  
  // Return object containing email subject and message array joined into a string on line-breaks
  return {subject: subject, message: message.join("<br>")}
}


module.exports = function (req, res) {
  
  // Get email info object
  var email_info = format_email_html(req.body) ;

  // Basic Email Settings
  // console.log(req.body);
  var mailOptions = {
    from: process.env.YAHOO_USERNAME,
    to: req.body.to,
    generateTextFromHTML: true,
    subject: email_info.subject,
    html: email_info.message,
  };

  var transporter = nodemailer.createTransport({
    service: "Yahoo",
    auth: {
      // Yahoo instructions =>
      //   Account Security => Two-step => New App => Other App
      //   Maybe also: Allow less-secure apps
      user: process.env.YAHOO_USERNAME,
      pass: process.env.YAHOO_PASSWORD,
    }
    // Gmail Instructions: Get a Gmail API key, adjust valid urls
  });
  
  // Token generation/retrival
  transporter.set('oauth2_provision_cb', function(user, renew, callback) {
    var accessToken = userTokens[user];
    if (!accessToken) {
      return callback(new Error('Unknown user'));
    } else {
      return callback(null, accessToken);
    }
  });

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
      res.json({error: error});
    } else {
      console.log('Message sent: ' + info.response);
      res.json({result: info.response});
    }
  });
};