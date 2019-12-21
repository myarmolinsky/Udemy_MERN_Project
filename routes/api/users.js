const express = require("express"); //bring in express
const router = express.Router(); //bring in express router, allows us to make routes in separate files
const gravatar = require("gravatar"); //bring in gravatar
const bcrypt = require("bcryptjs"); //bring in bcrypt via bcryptjs
const { check, validationResult } = require("express-validator"); //bring both of these in from express-validator (express-validator/check is deprecated so we don't use it)
//check lets us add a second parameter in .post() as middleware which checkers given user input with provided rules
//if any errors are found, they can be seen inside the validationResult array

const User = require("../../models/User"); //bring in our User model
// the first '../' is to get out of the 'api' folder, the second '../' is to get out of the routers folder

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
  async (req, res) => {
    //req.body is how we will access data sent to us
    //for req.body to work, we have to initialize the middleware for the body-parser, which we did in server.js by calling 'app.use(express.json({extended: false}))'
    const errors = validationResult(req); //set 'errors' to validationResult of req which is an array of any errors that occurred when running all the checks
    if (!errors.isEmpty()) {
      //if there errors:
      return res.status(400).json({ errors: errors.array() }); //res.status(400) is a 'Bad Request', so we are returning the status and a json with an array of the errors
      //res.status(200) means everything is OK
    }

    const { name, email, password } = req.body; //pull these pieces of data out of the data that is sent to us

    //we will make a query with mongoose using User.findOne()
    //.findOne() returns a promise so we have to use async await
    try {
      // See if user exists (if they exist then we send back an error because we don't want two users with the same email)
      let user = await User.findOne({ email }); //this will get the user by searching by the given object
      if (user) {
        //if the user exists:
        return res //return is required before this res because it is not the last res. otherwise you would get an error. only the last res does not need a return before it
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] }); //bad request because the user already exists
        //in order to match the same type of error response that we get above when calling "res.status(400).json({ errors: errors.array() })", we pass .json() the above object
      } //everything after this if statement only runs if 'user' does not exist

      // Get user's gravatar
      const avatar = gravatar.url(email, {
        //gravatar finds a profile image associated with an email by calling gravatar.url(<email>, <object with image requirements>)
        s: "200", //s is size (pixels?)
        r: "pg", //r is rating (so we only want gravatars with a pg rating)
        d: "mm" //d is default and 'mm' gives you a default image
        //we can put '404' here instead of 'mm' which would give a "file not found error" but we want to have something there even if the user does not have a gravatar
      });

      user = new User({
        //create an instance of a new user with the fields that we want
        name,
        email,
        avatar,
        password //this password is not hashed/encrypted yet so we will need to do that
      }); //this does not save the user, it just creates a new instance
      //we need to call user.save() to actually save it to the database
      //before we save we want to encrypt the password with bcrypt

      // Encrypt password using bcrypt
      //first thing we need to do before encrypting the password is to create a 'salt' to do the hashing with
      const salt = await bcrypt.genSalt(10); //we can get a promise from bcrypt.genSalt() so we use await
      //we pass what is called "the rounds" into bcrypt.genSalt() (10 is what is recommended in the documentation)
      //the more rounds you have, the more secure the password is but the slower it can be
      user.password = await bcrypt.hash(password, salt); //bcrypt.hash takes in two parameters: the plain-text (in this case "password") and the salt
      //we put 'await' in front of anything that may return a promise
      await user.save(); //now we save the user to our database

      // Return jsonwebtoken because when a user registers, you want them to be logged in right away and for them to be logged in right away, they need that webtoken

      res.send("User registered");
    } catch (err) {
      //if something goes wrong here, then it's a server error
      console.error(err.message);
      res.status(500).send("Server error"); //500 is an Internal Server Error
    }
  }
);

module.exports = router; //export the router
