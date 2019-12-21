const mongoose = require("mongoose"); //bring in mongoose

const UserSchema = new mongoose.Schema({
  //create our schema
  //mongoose.Schema() takes in an object with all the fields that we want
  name: {
    //we want our user to have a name of type String so we set 'name' to an object of type 'String'
    type: String,
    required: true //we also want this field to be required so we set 'required' to 'true'
  },
  email: {
    type: String,
    required: true,
    unique: true //we want the email to be unique, we do not want two people registering with the same email, so we set 'unique' to 'true'
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    //we are using gravatar for user avatars. some emails have a gravatar bound to them in which case we will set the user avatar to it but an avatar is not required
    type: String
  },
  date: {
    type: Date,
    default: Date.now //default puts a value in automatically. here we are putting in the current date automatically
  }
});

module.exports = User = mongoose.model("user", UserSchema); //export this as User which is a mongoose model
//mongoose.model() takes in 2 things: the model name (in this case "user") and the schema (which we just made, in this case "UserSchema")
