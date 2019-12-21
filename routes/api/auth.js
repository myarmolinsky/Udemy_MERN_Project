const express = require("express"); //bring in express
const router = express.Router(); //bring in express router, allows us to make routes in separate files
const auth = require("../../middleware/auth"); //bring in our auth middleware
const User = require("../../models/User"); //bring in User model

/*
before every route you want to put 3 things
// @route <requestType> <endpoint>
// @desc <describeRoute>
// @access <accessValue: Public || Private> (a certain token may be required to access a certain route if the route is private)
*/

// @route GET api/auth
// @desc Test route
// @access Public
router.get("/", auth, async (req, res) => {
  //in order to use our auth middleware, we put it in as the second parameter between the path and the callback
  //for this to give us the callback we want, in our Postman we need to go to headers and add a Key called 'x-auth-token' with a value that is a token for one of the users
  try {
    // try catch because we will make a call to our database
    const user = await User.findById(req.user.id).select("-password"); //since this is a protected route and we used a token which has the id,
    //and in our middleware we set req.user to the user in the token, we can pass 'req.user' into User.findById()
    //we pass 'req.user.id' because we want the id of the user
    //doing '.select("-password") leaves the password out of the data returned since we do not need it
    res.json(user); //send the user
  } catch (err) {
    //if something goes wrong here, it's a server error
    console.err(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router; //export the router
