# Lean MEAN Client Machine Presents: 
<center> <h1>Autowise Loan Tracking</h1> </center>

## Dependencies
- [Node.js and npm](https://nodejs.org/en/download)
- [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
- [Python 3.x](https://www.python.org/downloads/) for automated tests
<!-- I need to figure out protractor webdriver with Selenium ~ ~ -->
<!-- - All nodes packages listed [here](network/dependencies) (these are auto installed once you run the instructions below) -->

## Use
- Clone or Download
- Installation
    - First time: `npm run first-install`
        + **Note:** make sure **NOT** to have the project open in an IDE/Text Edition (e.g. [Sublime Text](sublimetext.com) or any of the other crappier alternatives out there). If issues persist after closing it, try to run the command with admin privileges.
    + Any other time: `gulp`. [Gulp](https://gulpjs.com/) provides automatic server and front-end restarts after local file changes
        + For a cleaner command line, it helps if you add the clearing command of your OS first (`cls` on Windows, `clear` on Unix), then command separator (`;` or `&&`), and THEN `gulp`
+ Deployments
    + Automatically on every push to master if you have set up automatic deployment in Heroku
        * [Instructions](https://youtu.be/_tiecDrW6yY?t=179)
            *  Heroku → App → Deploy tab → On 'Deployment method' select 'GitHub' → Connect to GiHub → Search your repo → 'Connect' → 'Automatic deploys' → 'Enable automatic deploys'
    + Once connected with Heroku's git  (`git push heroku master`)
- Testing
    + First time: `npm run first-tests`
    + Later: `npm run tests`

<!-- Popular Heroku Command -->
<!-- For a Bigger DB: https://devcenter.heroku.com/articles/mongolab#changing-plans -->


<!-- - Basic admin email: autowisecars@yahoo.com.  -->
## Documentation
