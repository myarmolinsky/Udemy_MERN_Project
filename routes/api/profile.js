const express = require("express"); //bring in express
const router = express.Router(); //bring in express router, allows us to make routes in separate files
const auth = require("../../middleware/auth"); //bring in our authentication middleware
const Profile = require("../../models/Profile"); //bring in our 'Profile' model
const User = require("../../models/User"); //bring in our 'User' model
const Post = require("../../models/Post"); //bring in our 'Post' model
const { check, validationResult } = require("express-validator"); //bring in express-validator b/c the user creating/updating their profile will be a post request that takes data
const request = require("request"); //bring in request
const config = require("config"); //bring in config

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
        profile = await Profile.findOneAndUpdate(
          //find a profile and update it
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

// @route GET api/profile
// @desc Get all profiles
// @access Public
router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]); //.find() will find all profiles and .populate() will populate the fields with a name and avatar
    res.json(profiles); //return the profiles
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route GET api/profile/user/:user_id //':user_id' is a placeholder for a user's id. the ':' tells us that this is a placeholder
// @desc Get profile by user ID
// @access Public
router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id //this will pull the user id from the url where the placeholder ':user_id' is
    }).populate("user", ["name", "avatar"]);

    if (!profile) {
      //if there is no profile for this user
      return res.status(400).json({ msg: "Profile not found" });
    }

    res.json(profile); //return the profile
  } catch (err) {
    console.error(err.message);
    if (err.kind == "ObjectId") {
      //if the kind of error is an ObjectId error, then return the same error message as for an incorrect user id
      //this happens when the user_id provided in the url is not of the correct format(?)
      return res.status(400).json({ msg: "Profile not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route Delete api/profile/
// @desc Delete profile, user, & posts
// @access Private
router.delete("/", auth, async (req, res) => {
  try {
    // Remove user posts
    await Post.deleteMany({ user: req.user.id });
    // Remove profile
    await Profile.findOneAndRemove({ user: req.user.id }); //find the user's profile by their token and remove their profile
    // Remove user
    await User.findOneAndRemove({ _id: req.user.id }); //find the user by their token and remove them

    res.json({ msg: "User deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route PUT api/profile/experience //PUT because we're updating a part of a profile
// @desc Add profile experience
// @access Private
router.put(
  "/experience",
  [
    auth,
    [
      check("title", "Title is required")
        .not()
        .isEmpty(),
      check("company", "Company is required")
        .not()
        .isEmpty(),
      check("from", "From date is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    } = req.body;

    const newExp = {
      //create an object with the data the user submits
      title,
      company,
      location,
      from,
      to,
      current,
      description
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id }); //find the user's profile
      profile.experience.unshift(newExp); //.unshift() puts the newest addition to the array on top
      await profile.save(); //save the profile
      res.json(profile); //return the profile
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
    }
  }
);

// @route DELETE api/profile/experience/:exp_id //DELETE because we're deleting a part of a profile. ':exp_id' is a placeholder for the experience's id
// @desc Delete experience from profile
// @access Private
router.delete("/experience/:exp_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    // Get remove index
    const removeIndex = profile.experience
      .map(item => item.id) //map through it, making item be the id of the experience
      .indexOf(req.params.exp_id); //find the index of the id that matches the id in the url

    profile.experience.splice(removeIndex, 1); //remove one item starting from the index 'removeIndex'
    //splice removes objects from the given index forth. first parameter tells you which index to start at, second tells you how many items to remove

    await profile.save();

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server Error" });
  }
});

// @route PUT api/profile/education //PUT because we're updating a part of a profile
// @desc Add education to profile
// @access Private
router.put(
  "/education",
  [
    auth,
    [
      check("school", "School is required")
        .not()
        .isEmpty(),
      check("degree", "Degree is required")
        .not()
        .isEmpty(),
      check("fieldofstudy", "Field of study is required")
        .not()
        .isEmpty(),
      check("from", "From date is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    } = req.body;

    const newEdu = {
      //create an object with the data the user submits
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id }); //find the user's profile
      profile.education.unshift(newEdu); //.unshift() puts the newest addition to the array on top
      await profile.save(); //save the profile
      res.json(profile); //return the profile
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
    }
  }
);

// @route DELETE api/profile/education/:edu_id //DELETE because we're deleting a part of a profile. ':edu_id' is a placeholder for the experience's id
// @desc Delete education from profile
// @access Private
router.delete("/education/:edu_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    // Get remove index
    const removeIndex = profile.education
      .map(item => item.id) //map through it, making item be the id of the education
      .indexOf(req.params.edu_id); //find the index of the id that matches the id in the url

    profile.education.splice(removeIndex, 1); //remove one item starting from the index 'removeIndex'
    //splice removes objects from the given index forth. first parameter tells you which index to start at, second tells you how many items to remove

    await profile.save();

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server Error" });
  }
});

// @route Get api/profile/github/:username
// @desc Get user repos from Github
// @access Public
router.get("/github/:username", (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_id=${config.get(
        "githubClientId"
      )}&client_secret=${config.get("githubSecret")}`,
      //?is where start putting options for the repsonse we receive
      //'per_page=5' makes it so we only see 5 repos per page
      //'&' is put between different options
      //'sort=created:asc' makes it so the repos are sorted in ascending order based off the date they were created
      //'client_id' and 'client_secret' use the properties we added to default.json
      //we use the 'request' package to access the api of the given user's repos (username received from url)
      method: "GET", //method of request
      headers: { "user-agent": "node.js" } //excluding this causes issues, not sure why
    };

    request(options, (error, response, body) => {
      //make the request
      if (error) console.error(error);

      if (response.statusCode !== 200) {
        //if status is not OK then return status '404' with a json message of "No Github profile found"
        return res.status(404).json({ msg: "No Github profile found" });
      }

      res.json(JSON.parse(body)); //send the body which will just be a regular string with escaped quotes so we have to surround it with 'JSON.parse()' before we send it
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router; //export the router
