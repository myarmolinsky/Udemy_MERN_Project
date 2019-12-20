const mongoose = require("mongoose"); //bring in mongoose
const config = require("config"); //bring in config
const db = config.get("mongoURI"); //bring in mongoURI string from default.json

const connectDB = async () => {
  // using async because we are calling mongoose.connect() which returns a promise
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true, //to use new parser since old one was deprecated
      useUnifiedTopology: true //to use new Server Discover and Monitoring Engine since old one was deprecated
    }); //await because mongoose.connect() returns a promise

    console.log("MongoDB Connected..."); //prints if mongoose.connect() call was successful
  } catch (err) {
    //if there was an error, catch it and do this:
    console.error(err.message); //print the error message
    //exit the process since there was a failure
    process.exit(1);
  }
};

module.exports = connectDB; //export the connectDB function
