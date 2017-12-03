
<!-- @Marcial: Images stored at "Documentation/Images" -->

<!-- ![Image](Documentation/Images/Test.png) -->
# Site Access and Deployment

## Proejct Dependencies
- [Node.js and npm](https://nodejs.org/en/download)
- [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
- [Python 3.x](https://www.python.org/downloads/) for automated tests
<!-- I need to figure out protractor webdriver with Selenium ~ ~ -->
<!-- - All nodes packages listed [here](network/dependencies) (these are auto installed once you run the instructions below) -->

## Local Installation and Execution
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
<!-- For a Bigger DB: hfttps://devcenter.heroku.com/articles/mongolab#changing-plans -->

# App Functionality

## Loan Management
### Creating Loans
A Loan is created from a Buyer's Order. Loans are created from the **admin view** using the circular "+" button on the lower right of the view. Clicking this button opens the Buyer's Order dialog (see the section on the Buyer's Order for more information).

(Add screenshot)

Upon creating a Loan, it is automatically assigned to an existing User in the database. If a User has a matching DL # and DOB as described on the Buyer's Order, the Loan will be attached to this User and it will appear on their account. If there is no User with this matching information, the loan will be *dangling* and not assigned to any User. However, if a customer creates an account with matching information, the Loan can be resolved to the created User (see User Management for more information).

### Modifying Loans
All Loans in the database can be accessed from the **admin view**. When a loan is expanded, you have the option to edit the original Buyer's Order with the _Buyer's Order_ button underneath the Loan header. This brings up the Buyer's Order dialog again. Any changes made here are saved as modifications to the current Loan.

(Add screenshot)

A Loan's status may be changed with the _Change Status_ button under the Loan header. A dialog appears that prompts you to select one of the 7 Loan statuses which are as follows:
- Received
- Submitted
- Pending
- Verified
- Approved
- Denied
- Archived

Confirming this dialog updates the Loan to the selected status

A warranty plan may also be added to a Loan with the _Change Warranty_ button. A dialog appears with input fields for a warranty plan type, duration, mileage, and cost. Confirming this dialog updates the Loan with a warranty plan, or updates the existing plan if there was already one.

When a customer is logged in, they are presented with the **customer view**. A customer cannot create, modify, or delete any loans and may only see loans associated with their account. A customer may publish comments, as discussed in the following section.

### Comments on Loans
TBD

### Mass Loan Operations
Each Loan header has a checkbox to the left. Click this box to select or unselect the Loan.

(Add screenshot)

If a Loan is selected, when you hover over the circular "+" button in the lower right corner of the **admin view**, several additional buttons are revealed.
- The pencil button opens the change status dialog as discussed in the Modifying Loans section. Confirming this dialog will change all selected Loans to the status specified in the dropdown.
- The box button archives all selected Loans.
- The trash button (only visible to a _Super Admin_) deletes all selected Loans permanately.

(Add screenshot)

## User Management
TBD

----
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