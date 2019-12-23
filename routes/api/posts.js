const express = require("express"); //bring in express
const router = express.Router(); //bring in express router, allows us to make routes in separate files
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const User = require("../../models/User");
const Post = require("../../models/Post");
const Profile = require("../../models/Profile");

// @route POST api/posts
// @desc Create a post
// @access Private
router.post(
  "/",
  [
    auth,
    [
      check("text", "Text is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select("-password"); //get the user without their password

      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id //just need the user's id
      });

      const post = await newPost.save();

      res.json({ post }); //send post (once the post is added/saved, we will get it back in the response)
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route GET api/posts
// @desc Get all posts
// @access Private //private instead of public because you cannot see the posts page unless you're logged in
router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 }); //find all posts and sort them by date ('-1' for 'date' makes it so we see the most recent posts first)
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route GET api/posts/:id //':id' is a placeholder for the id of a post
// @desc Get post by ID
// @access Private
router.get("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id); //find a post with the id provided in the url

    if (!post) {
      //if there is no post with this id
      return res.status(404).json({ msg: "Post not found" });
    }

    res.json(post);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      //if there error is 'ObjectId', that means that the id provided to us in the url is not in the form on an ObjectId so return the same error as if the post is not found
      return res.status(404).json({ msg: "Post not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route DELETE api/posts/:id
// @desc Delete a post
// @access Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id); //find a post with the id provided in the url

    if (!post) {
      //if there is no post with this id
      return res.status(404).json({ msg: "Post not found" });
    }

    // Check user
    //we want to make sure that the user that is deleting the post is the user who owns the post
    if (post.user.toString() !== req.user.id) {
      //'post.user' is an ObjectId while 'req.user.id' is a String so we need to turn 'post.user' into a string with .toString()
      //check if the post user is not equal to the request user
      return res.status(401).json({ msg: "User not authorized" });
    }

    await post.remove(); //if the user making the request matches the user the post is by, remove the post

    res.json({ msg: "Post Removed" }); //return a message saying that the post was removed
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      //if there error is 'ObjectId', that means that the id provided to us in the url is not in the form on an ObjectId so return the same error as if the post is not found
      return res.status(404).json({ msg: "Post not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route PUT api/posts/like/:id //PUT because we are updating a post
// @desc Like a post
// @access Private
router.put("/like/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id); //find post by id

    // Check if the post has already been liked by this user
    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length > 0 //'like.user' has to be turned into a string with .toString() so that it matches 'req.user.id'
      //.filter() takes in a function and the parameter of our .filter() is like and what we do is compare the user who made the like to the user who is currently logged in
      //if .length is > 0, that means that the user has already liked the post
    ) {
      //post has already been liked by this user
      return res.status(400).json({ msg: "Post already liked" });
    }

    // If the user has not already liked the post
    post.likes.unshift({ user: req.user.id }); //add the current user to the beginning of the array of likes

    await post.save(); //save the post

    res.json(post.likes); //return the post's likes
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route PUT api/posts/unlike/:id //PUT because we are updating a post
// @desc Unlike a post
// @access Private
router.put("/unlike/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length ===
      0 //if the length is === 0, then the post has not yet been liked
    ) {
      return res.status(400).json({ msg: "Post has not yet been liked" });
    }

    // Get remove index
    const removeIndex = post.likes
      .map(like => like.user.toString())
      .indexOf(req.user.id); //this will get the correct index of the like so that we can remove it from the array of likes

    post.likes.splice(removeIndex, 1); //remove the like

    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router; //export the router
