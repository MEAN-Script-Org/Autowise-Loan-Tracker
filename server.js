
function startServer() {
  var app = require("./server/app");
  var server = app.start();
}

function waitForHerokuVariables() {
  // we need this else the ".env" is worthless
  
  require('dotenv').load()
  if (process.env.MONGO_URI)
    startServer();
  else
    waitForHerokuVariables();
}

waitForHerokuVariables();