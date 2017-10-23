var config_loader = require('dotenv');
config_loader.load();

function startServer() {
  var app = require("./server/app");
  var server = app.start();
}

function waitForHerokuVariables() {
  // we need this else the ".env" is worthless
  
  if (process.env.MONGO_URI)
    startServer();
  else {
    // console.log("loading...");
    config_loader.load();
    waitForHerokuVariables();
  }
}

waitForHerokuVariables();