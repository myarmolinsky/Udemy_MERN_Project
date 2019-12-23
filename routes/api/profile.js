const express = require("express"); //bring in express
const router = express.Router(); //bring in express router, allows us to make routes in separate files
const auth = require("../../middleware/auth"); //bring in our authentication middleware
const Profile = require("../../models/Profile"); //bring in our 'Profile' model
const User = require("../../models/User"); //bring in our 'User' model

// @route GET api/profile/me //we will use api/profile to get all profiles so we are using api/profile/me to get specifically the user's profile
// @desc Get current user's profile
// @access Private //private because we will be using the current user's token to access their profile. this means we have to bring in the 'auth' middleware we made
router.get("/me", auth, async (req, res) => {
  //first parameter is '/me' because that is the endpoint we want to hit
  try {
    const profile = await Profile.findOne({
      user: req.user.id
    }).populate("user", ["name", "avatar"]);
    /*
    .findOne() because we only want to find one profile and we want to find it by the user's id
    this user pertains to our 'Profile' model's 'user' field which will be the ObjectId of the user
    we want to populate the fields of our Profile with the name of the user and the avatar which are in the 'User' model, not the profile model
    .populate() allows us to add stuff to our query
    the first parameter of .populate() is where we want to populate from, which is 'user' in this case
    and the second parameter is an array of fields we want to bring in from user
    */

    if (!profile) {
      //if there is no profile
      return res.status(400).json({ msg: "There is no profile for this user" });
    }

    // If there is a profile
    res.json(profile); //send the profile
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router; //export the router
