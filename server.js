//do 'npm init' first
//then install dependencies with 'npm i <dependency>':
//'express' as main web framework for the backend,
//'express-validator' for data validation so that when we make a post request to our api, if there are fields that need ot be there that aren't, we will use this for validation,
//'bcryptjs' is used for password encryption (YOU NEVER WANT TO STORE PLAIN-TEXT PASSWORDS IN YOUR DATABASE),
//'config' for global variables,
//'gravatar' for profile avatars which can use profile images of emails associated with gravatar accounts,
//'jsonwebtoken' for passing along tokens for validation,
//'mongoose' a layer that sits ont op of the database so we can interact with it,
//'request' lets us make http requests to other apis (we will use this to access other github repositories),
//then install dev dependencies with 'npm i -D <dependency>':
//'nodemon' will constantly watch our server so that every time we refresh it we don't have to make a change,
//'concurrently' will allow us to run our backend express server and our frontend react-dev server at the same time with one single command

//we can run this with 'node server' or 'node server.js' but we made some npm scripts so we can run it with 'npm run server'
//in package.json under <scripts> we added "start: node server" which is the script Heroku will run when we deploy ('npm run start')
//and we added "server: nodemon server" which is the script we use for development ('npm run server')
//we will make all of our requests in Postman and enter http://localhost:5000
//its console should print 'API Running' to let us know our express server is up and running because that is the message we gave the app.get()'s callback

//for git committing do this:
//git add .
//git commit -m 'Comment'
//git push

const express = require("express"); //bring in express
const connectDB = require("./config/db"); //bring in db.js from folder 'config'

const app = express(); //initialize our app with express()

connectDB(); // Connect Database

app.get("/", (req, res) => res.send("API Running"));
//endpoint just to test out. sends a get request to '/' and create a callback with request, response (req, res) and just do a res.send()
//res.send() sends data to a browser.  This one just says "API Running"

const PORT = process.env.PORT || 5000;
//process.env.PORT will look for an environment variable called PORT to use (this is where we iwll get the port number when we deploy to Heroku)
//locally, however, we want it to run on port 5000 (if there is no environment variable set it will default to 5000)

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
//listen on a port and create a callback (do something when it connects, in this case console.log that the server started and which port it started on)
