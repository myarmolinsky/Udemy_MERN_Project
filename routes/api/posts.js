const express = require("express"); //bring in express
const router = express.Router(); //bring in express router, allows us to make routes in separate files

// @route GET api/posts
// @desc Test route
// @access Public
router.get("/", (req, res) => res.send("Posts route"));

module.exports = router; //export the router
