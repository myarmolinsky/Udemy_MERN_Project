const express = require("express"); //bring in express
const router = express.Router(); //bring in express router, allows us to make routes in separate files
const { check, validationResult } = require("express-validator/check"); //bring both of these in from express-validator/check
//check lets us add a second parameter in .post() as middleware which checkers given user input with provided rules
//if any errors are found, they can be seen inside the validationResult array

/*
before every route you want to put 3 things
// @route <requestType> <endpoint>
// @desc <describeRoute>
// @access <accessValue: Public || Private> (a certain token may be required to access a certain route if the route is private)

EXAMPLE:
// @route GET api/users
// @desc Test route
// @access Public
router.get("/", (req, res) => res.send("User route")); //when we want to create a route, we do router.get(), not app.get() or app.post()
this router makes a get request to '/' and has a callback which uses request, response (req, res) to send data to our browser that says 'User route'

our registration route is a POST request to api/users
GET vs POST: GET is used to retrieve data from a webpage while POST is used to submit data (such as via a form or uploading a file)
*/

/*
POSTMAN:
for users.js, after choosing to make a post request, we go to Headers and add a Key of 'Content-Type' with a Value of 'application/json'
then in the Body we choose 'raw' and send some raw json
*/

// @route POST api/users
// @desc Register user
// @access Public
router.post(
  "/",
  [
    check("name", "Name is required") //first parameter in check is which piece of data we are checking, second parameter is a custom error message
      //if a custom error message is not passed, then some generic error message will be used
      .not()
      .isEmpty(), //.not().isEmpty() is our rule for this piece of data. it means that we want this piece of data to not be empty
    check("email", "Please include a valid email").isEmail(), //.isEmail makes sure this piece of data is structured like an email
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }) //isLength({ min:6 }) makes sure this piece of data is at least 6 characters long
  ],
  (req, res) => {
    //req.body is how we will access data sent to us
    //for req.body to work, we have to initialize the middleware for the body-parser, which we did in server.js by calling 'app.use(express.json({extended: false}))'
    const errors = validationResult(req); //set 'errors' to validationResult of req which is an array of any errors that occurred when running all the checks
    if (!errors.isEmpty()) {
      //if there errors:
      return res.status(400).json({ errors: errors.array() }); //res.status(400) is a 'Bad Request', so we are returning the status and a json with an array of the errors
      //res.status(200) means everything is OK
    }
    res.send("User route");
  }
);

module.exports = router; //export the router
