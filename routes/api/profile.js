const express = require("express"); //bring in express
const router = express.Router(); //bring in express router, allows us to make routes in separate files
const auth = require("../../middleware/auth"); //bring in our authentication middleware
const Profile = require("../../models/Profile"); //bring in our 'Profile' model
const User = require("../../models/User"); //bring in our 'User' model
const { check, validationResult } = require("express-validator"); //bring in express-validator b/c the user creating/updating their profile will be a post request that takes data

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

// @route POST api/profile
// @desc Create or update user profile (we will have different endpoints for updating experience and education)
// @access Private
router.post(
  "/", //for the second parameter, we have to use multiple middlewares (our auth middleware and the check middleware) so we use [] brackets
  [
    auth,
    [
      check("status", "Status is required") //we are checking for required fields. the required fields are 'status' and 'skills'. we want to make sure they are not empty
        .not()
        .isEmpty(),
      check("skills", "Skills is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req); //return whether there were any errors when checking
    if (!errors.isEmpty()) {
      //if there are errors, return a json with an array of the errors
      return res.status(400).json({ errors: errors.array() });
    }

    // If there were no errors
    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin
    } = req.body; //pull out all of this information from the request body

    // Build profile object
    const profileFields = {}; //initialize 'profileFields' to an empty object
    //go one by one to add each field
    profileFields.user = req.user.id; //get the user via the token that was sent
    //check if each field exists and if it does, set it
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(",").map(skill => skill.trim()); //we want to turn the skills string into an array of skills so we split it by commas
      //and we trim each skill with '.map(skill => skill.trim())' to remove extra spaces
    }
    // Build social object
    profileFields.social = {}; //initialize social
    if (youtube) profileFields.social.youtube = youtube;
    if (facebook) profileFields.social.facebook = facebook;
    if (twitter) profileFields.social.twitter = twitter;
    if (instagram) profileFields.social.instagram = instagram;
    if (linkedin) profileFields.social.linkedin = linkedin;

    // Update and insert the data now that all the properites are inside profileFields
    try {
      let profile = await Profile.findOne({ user: req.user.id }); //find a profile by the user id we get from the token
      if (profile) {
        // Update the profile
        profile = await Profile.findOneAndModify(
          //find a profile and modify it (we are using .findOneAndModify() because .findOneAndUpdate() is deprecated)
          { user: req.user.id }, //find a profile by the user id we get from the token
          { $set: profileFields }, //set the fields of the found profile to the fields in profileFields
          { new: true } //options? (I'm not sure what this is for, it was not explained)
        );

        return res.json(profile); //return the entire profile
      }

      // Create a profile if one is not found
      profile = new Profile(profileFields); //set the profile variable to a new Profile with our profileFields
      await profile.save(); //save the profile
      res.json(profile); //return the profile
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router; //export the router
