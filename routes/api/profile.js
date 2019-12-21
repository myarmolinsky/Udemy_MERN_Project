const express = require("express"); //bring in express
const router = express.Router(); //bring in express router, allows us to make routes in separate files

/*
before every route you want to put 3 things
// @route <requestType> <endpoint>
// @desc <describeRoute>
// @access <accessValue: Public || Private> (a certain token may be required to access a certain route if the route is private)
*/

// @route GET api/profile
// @desc Test route
// @access Public
router.get("/", (req, res) => res.send("Profile route")); //when we want to create a route, we do router.get(), not app.get() or app.post()
//this router makes a get request to '/' and has a callback which uses request, response (req, res) to send data to our browser that says 'User route'

module.exports = router; //export the router
