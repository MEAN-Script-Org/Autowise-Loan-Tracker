<!-- # Lean MEAN Client Machine Presents:  -->
# Autowise Loan Tracking

## Table of Contents
- Quick local links to subtitles
TBA

<!-- 
Definitions table?
Popup == modal == dialog?
 -->

<!-- ![image](documentation/images/test.png) -->
<!-- no need for forced section separators/dividors  -->

# Site Access and Deployment

## Project Dependencies
- [Node.js and npm](https://nodejs.org/en/download)
- [Heroku CLI](https://devcenter.heroku.com/articles/heroku-clii#download-and-install)
- [Python 3.x](https://www.python.org/downloads/) for automated tests
<!-- I need to figure out protractor webdriver with Selenium ~ ~ -->
<!-- - All nodes packages listed [here](network/dependencies) (these are auto installed once you run the instructions below) -->

## Local Installation and Execution
- Clone or Download
- Installation
    * Connect to Heroku
        - Run `heroku login` to authenticate into your Heroku account
        - Connect to the app: `heroku git:remote -a autowise`
            + **NOTE:** Gulp, will **NOT** work if you don't do this (and by extension **NOTHING WILL**)
    - First time: `npm run first-install`
        + **Note:** make sure **NOT** to have the project open in an IDE/Text Edition (e.g. [Sublime Text](sublimetext.com) or any of the other crappier alternatives out there). If issues persist after closing it, try to run the command with admin privileges.
    + Any other time: `gulp`. [Gulp](https://gulpjs.com/) provides automatic server and front-end restarts after local file changes
        + For a cleaner command line, it helps if you add the clearing command of your OS first (`cls` on Windows, `clear` on Unix), then command separator (`;` or `&&`), and THEN `gulp`
- Deployments
    + Automatically on every push to master if you have set up automatic deployment in Heroku
        * [Instructions](https://youtu.be/_tiecDrW6yY?t=179)
            *  TL;DW: Heroku → App → Deploy tab → On 'Deployment method' select 'GitHub' → Connect to GiHub → Search your repo → 'Connect' → 'Automatic deploys' → 'Enable automatic deploys'
    + Or, manually once connected with Heroku's git: `git push heroku master`
- Testing
    + First time: `npm run first-tests`
    + Later: `npm run tests`

<!-- Popular Heroku Command -->
<!-- For a Bigger DB: hfttps://devcenter.heroku.com/articles/mongolab#changing-plans -->



# App Functionality

## Loan Management
### Creating Loans
A Loan is created from a Buyer's Order. Loans are created from the **admin view** using the circular "+" button on the lower right corner of the page. Clicking this button opens the Buyer's Order modal (see [Buyer's Order](#) for more information).

(Add screenshot)

Upon creating a Loan, a User it's automatically assigned to it if the User already exists in the database. If a User has a matching full name (*case sensitive*) and DOB, as described on the Buyer's Order, the Loan will be attached to this User and it will appear on their account. If there is no User with this matching information, the loan will be *dangling* and not assigned to any User. However, if a customer creates an account with matching information later on, the Loan will be assigned to it (see [User Management](#) for more information).
- Note: We did **not** use DL #, as defined by our client, although this can be easily changed with in 2 lines of *loans.crud.js*.


### Modifying Loans
All Loans in the database can be accessed from the **admin view**. When a loan is expanded, you have the option to edit the original Buyer's Order with the _Buyer's Order_ button underneath the Loan header. This brings up the Buyer's Order popup again. Any *submitted* changes made here are saved as modifications to the current Loan.
<!-- make this into an anchor, since it will be quoted A LOT  -->
- Note: Updates to the purchaser/copurchaser's name or DOB will **not** result on automatic updates to possible users. This only happens loan or account CREATION. Modifying this will need some routing work (easy-medium difficulty).

(Add screenshot)
<!-- of ??? Buyers order? -->

A Loan's status may be changed with the _Change Status_ button under the Loan header. A popup appears that prompts you to select one of the 7 Loan statuses which are as follows:
- Received
- Submitted
- Pending
- Verified
- Approved
- Denied
- Archived

Confirming this popup updates the Loan to the selected status

A warranty plan may also be added to a Loan with the _Change Warranty_ button. A popup appears with input fields for a warranty plan type, duration, mileage, and cost. Confirming this popup updates the Loan with a warranty plan, or updates the existing plan if there was already one.

When a customer is logged in, they are presented with the **customer view**. A customer cannot create, modify, or delete any loans and may only see loans associated with their account. A customer may publish comments, as discussed in the following section.

### Comments on Loans
TBD

### Mass Loan Operations
Each Loan header has a checkbox to the left. Click this box to select or unselect the Loan.

(Add screenshot)

If a Loan is selected, when you hover over the circular "+" button in the lower right corner of the **admin view**, several additional buttons are revealed.
- The pencil button opens the change status popup as discussed in the Modifying Loans section. Confirming this popup will change all selected Loans to the status specified in the dropdown.
- The box button archives all selected Loans.
- The trash button (only visible to a _Super Admin_) deletes all selected Loans permanately.

(Add screenshot)



## User Management
TBD




# Database Structures

## Loan Schema
TBD
+ Loans
    - Status : enum?/strings. 
        - MUST BE VISIBLE on description/without clicking on them
        - They can be
            + RECEIVED/SUBMITTED
                - RECEIVED => FROM OFFICE
                - SUBMITTED => FROM BANK
            + APPROVED/DENIED
            + ^ most important ones
            + PENDING => everything in the process
            + VERIFIED => REVIEWED APP, things are ok
        + Archived : bool. True if (APPROVED/DENIED)
    - Costs
        - Taxes
        - Warranties ? => CHECK PICTURES. NEED MORE DETAILS
    - Types
        - Auto Loan => default
        - Repair
        - Admin - need more details on this. Administrative fees?
    - Trades
        - default to false/'[]' (empty array - which is 'falsey')
        - ADMIN puts in trade information later
    - Messages
        - Content : array with messages in reverse chronological order (easy to flip in angular)
            + Need more clafication of what to put 'on top' as important message
        - Date/timestamps - format tba later. not that important
        - visibleToConsumer : bool
        - important : bool
        - CHANGE TO MOCKUP: Same area as normal info
        
## User Schema
TBD      
- Users
    + username : string
    + passwords : hash
    + isAdmin : bool
    + loans : other DB object/array of ids of loans, 1+ possible
    
# File Descriptions & Folder Structure
The following details the folder structure of the application and the purposes of each file
Files are _italicized_

- client: files and scripts run or viewed on the client (user) side
  + angular: Angular code driving customer views
    * _account.controller.js:_ drives functionality of the user info view
    * _admin.controller.js:_ drives functionality of the admin loan database view
    * _app.js:_ registers the module app which all controllers belong to
    * _controller-template.js:_ template file for additional controllers
    * _customer.controller.js:_ drives functionality of the customer loan view
    * _custom-filters.js:_ drives functionality of the admin loan filtering
    * _factory.js:_ handles requests from the client to the server and back. Methods defined here are used in nearly every controller
    * _login.controller.js:_ drives functionality of the login and registration view
    * _nav.controller.js:_ drives functionality of website navigation
    * _permissions.controller.js:_ drives functionality of the super admin edit account permissions view
    * _warranties.controller.js:_ drives functionality of the customer warranties request view
  + css: files of CSS styles
  + dependencies: Angular JavaScript dependencies
  + fonts: fonts used by the CSS styles
  + js: additional JavaScript dependences
  + partials: smaller chunks of HTML content incorporated into main views
    * _header.ejs:_ Global HTML `<head>` content
    * _footer.ejs:_ Global JavaScript dependencies
    * _nav.ejs:_ Navigation bar atop each page
    * _accordion-comments.ejs:_ HTML for loan content and comments functionality
    * _account-contact-autowise.ejs:_ **TODO** Delete this file if there's no use for it
    * _actions-row.ejs:_ action buttons appearing under the header of a loan visible to admins
    * _admin-filters.ejs:_ admin loan filtering and search bar
    * _buyers-order.ejs:_ popup displaying the Buyer's Order
    * _google_buttons.ejs:_ admin loan hover create/edit/delete buttons
    * _modals.ejs:_ various modals/popups/dialogs
    * _progress-row.ejs:_ unused now?? -> will be used for customer view
    * _warranty-row.ejs:_ the warranty plan on a loan under the loan header
  + resources: images and other miscellaneous files
  + _account.ejs:_ user account information view 
  + _admin.ejs:_ admin loan database view (also referred to as the **admin view**)
  + _customer.ejs:_ customer loan view (also referred to as the **customer view**)
  + _login.ejs:_ login and register view
  + _permissions.ejs:_ super admin account management view
  + _warranties.ejs:_ customer warranty plan request view
  + _md5-device-fingerprint.js:_ ?? (no idea why this is here AND in the 'js' folder...)
- documentation: resources used in this document
- node_modules: imported JavaScript libraries. There should be no need to access the contents of this folder
- server: files and scripts run on the server side
  + db: files defining database objects and server-side database operations
    * _loans.crud.js:_ details CRUD operations on Loan database objects
    * _loans.model.js:_ defines the Loan database schema and several server side Loan operations
    * _users.crud.js:_ details CRUD operations on User database objects
    * _users.model.js:_ defines the User database schema and several server side User operations
  + _api_routes.js:_ defines routing for api requests including loan and user management
  + _app.js:_ server side application initialization, called from the'server.js' file at the top-level directory
  + _auth.js:_ provides authentication functionality including password verification and hashing
  + _emailing.js:_ provides emailing functionality
  + _express.js:_ defines top-level routing which is further detailed by one of the other routing files
  + _login_routes.js:_ defines routing for user login and registration requests
  + _profile_routes.js:_ defines routing for "logged-in" pages, such as the user account info view
- unit_testing: files and scripts used in app testing. More detail is presented in the Testing Specifications section
- _.env:_ ??
- _.env.example:_ ??
- _Procfile:_ ??
- _gulpfile.js:_ details configuration of gulp when the 'gulp' command is executed
- _server.js:_ top-level file that starts the server and runs the application
- _app.json:_ ??
- _package.json:_ details dependencies and libraries that are installed to the 'node_modules' folder
- _package-lock.json:_ ??
- _README.md:_ open it and find out
- _test.py:_ master testing file to be run in a Python environment (i.e. `python test.py` to run)
- _.gitignore:_ git ignore file
- _final client meeting notes.text:_ WHY IS THIS HERE

# Testing Specifications

TBD