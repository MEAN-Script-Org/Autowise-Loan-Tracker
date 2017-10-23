var atob = require('atob');
var nodemailer = require('nodemailer');

var money_formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  // the default value for minimumFractionDigits depends on the currency
  // minimumFractionDigits: 2,
});

var format_email_html = function (form) {
  // <a href="swe-2017.herokuapp.com/loan/" target="_blank"> </a>
  var app_link = ["<a href='", process.env.BASE_URL, 
                  "loan/", form.id, "' target='_blank'>here</a>."].join("");

  console.log(app_link);

  var message = [
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

  return message.join("<br>");
}


module.exports = function (req, res) {

  // console.log(req.body);
  var message = format_email_html(req.body);
  var subject = "Autowise: Your loan application has been updated";

  // Basic Email Settings
  var mailOptions = {
    // from: process.env.YAHOO_USERNAME,
    from: process.env.GMAIL_USERNAME,
    to: req.body.to,
    generateTextFromHTML: true,
    subject: subject,
    html: message,
  };

  var transporter = nodemailer.createTransport({
    // service: "Yahoo",
    // clientId: process.env.CLIENT_ID,
    // auth: {
    //   user: process.env.YAHOO_USERNAME,
    //   pass: atob(process.env.YAHOO_PASSWORD)
    // }
    // This works
    clientId: process.env.CLIENT_ID,
    service: "Gmail",
    auth: {
      user: process.env.GMAIL_USERNAME,
      pass: atob(process.env.GMAIL_PASSWORD)
    }
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