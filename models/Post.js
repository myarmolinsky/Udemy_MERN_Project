const mongoose = require("mongoose");
const Schema = mongoose.Schema; //just so we don't have to use mongoose.Schema

const PostSchema = new Schema({
  user: {
    //we want a user to be connected to the post
    type: Schema.Types.ObjectId,
    ref: "users" //reference the 'User' model
  },
  text: {
    type: String,
    required: true
  },
  name: {
    //name of the user, not of the post
    //this will be used for if a user's account is deleted, the post will still say the name of the user who made it
    type: String
  },
  avatar: {
    //this will be used for if a user's account is deleted, the post will still show the avatar of the user who made it
  },
  likes: [
    //this is an array of likes
    {
      //inside the array of likes, we will have the user
      user: {
        //this way we will know which likes came from which user, a single user can only like a certain post once
        type: Schema.Types.ObjectId,
        ref: "users"
      }
    }
  ],
  comments: [
    //same thing as for 'likes' goes for 'comments'
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users"
      },
      text: {
        type: String,
        required: true
      },
      name: {
        type: String
      },
      avatar: {
        type: String
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Post = mongoose.model("post", PostSchema);
