const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
  user: {
    //we want to create a reference to the user model because every profile should be associated to a user
    type: mongoose.Schema.Types.ObjectId, //the type is an ObjectId. this is the _id we see in our database for each user
    ref: "users" //the model we are talking about
  },
  company: {
    type: String
  },
  website: {
    type: String
  },
  location: {
    type: String
  },
  status: {
    //developer, senior developer, instructor, student, etc
    type: String,
    required: true
  },
  skills: {
    type: [String], //skills will be an array of strings which is why there are [] brackets around 'String'
    required: true
  },
  bio: {
    type: String
  },
  githubusername: {
    type: String
  },
  experience: [
    //this is an array of other fields which will describe the user's experiences
    {
      title: {
        type: String,
        required: true
      },
      company: {
        type: String,
        required: true
      },
      location: {
        type: String
      },
      from: {
        type: Date,
        required: true
      },
      to: {
        type: Date
      },
      current: {
        //if they currently work there
        type: Boolean,
        default: false
      },
      description: {
        type: String
      }
    }
  ],
  education: [
    //array of fields describing user's education
    {
      school: {
        type: String,
        required: true
      },
      degree: {
        type: String,
        required: true
      },
      fieldofstudy: {
        type: String,
        required: true
      },
      from: {
        type: Date,
        required: true
      },
      to: {
        type: Date
      },
      current: {
        type: Boolean,
        default: false
      },
      description: {
        type: String
      }
    }
  ],
  social: {
    //social media links
    youtube: {
      type: String
    },
    twitter: {
      type: String
    },
    facebook: {
      type: String
    },
    linkedin: {
      type: String
    },
    instagram: {
      type: String
    }
  },
  date: {
    //current date
    type: Date,
    default: Date.now
  }
});

module.exports = Profile = mongoose.model("profile", ProfileSchema);
