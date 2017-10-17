// This file needs to go ASAP
// TB changes to Heroku config var

// Export database object to application
module.exports = {
  db: {
    uri: 'mongodb://michaeltngo:pw@ds121225.mlab.com:21225/car-loan-users',
  }
};