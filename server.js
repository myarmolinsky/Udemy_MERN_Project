/*
SETUP:
do 'npm init' first
then install dependencies with 'npm i <dependency>':
'express' as main web framework for the backend,
'express-validator' for data validation so that when we make a post request to our api, if there are fields that need ot be there that aren't, we will use this for validation,
'bcryptjs' is used for password encryption (YOU NEVER WANT TO STORE PLAIN-TEXT PASSWORDS IN YOUR DATABASE),
'config' for global variables,
'gravatar' for profile avatars which can use profile images of emails associated with gravatar accounts,
'jsonwebtoken' for passing along tokens for validation,
'mongoose' a layer that sits ont op of the database so we can interact with it,
'request' lets us make http requests to other apis (we will use this to access other github repositories),
then install dev dependencies with 'npm i -D <dependency>':
'nodemon' will constantly watch our server so that every time we refresh it we don't have to make a change,
'concurrently' will allow us to run our backend express server and our frontend react-dev server at the same time with one single command
*/

/*
RUN:
we can run this with 'node server' or 'node server.js' but we made some npm scripts so we can run it with 'npm run server'
in package.json under <scripts> we added "start: node server" which is the script Heroku will run when we deploy ('npm run start')
and we added "server: nodemon server" which is the script we use for development ('npm run server')
we will make all of our requests in Postman and enter http://localhost:5000
its console should print 'API Running' to let us know our express server is up and running because that is the message we gave the app.get()'s callback
*/

/*
GIT COMMIT:
for git committing do this:
git add .
git commit -m 'Comment'
git push
*/

/*
CONFIG:
we made a folder called 'config', inside which we made a file called 'default.json'
the dependency we installed called 'config' allows us to create global values which we can use throughout our application
the 'default.json' file will hold all those values
we made one for our MongoDB string, or what's called our mongoURI
and we set it to the string we got from going to our mongo cluster, clicking connect, connect your application, and copying the connection string
where it says '<user>:<password>' (in this case 'matt123:<password>'), replace <password> with our password that we created for our user (in this case 'matt123')
we also made a file inside our 'config' folder called 'db.js' which is where we did our mongoDB connection
*/

/*
ROUTES:
we made a folder called 'routes' to store all of our files where we will create all of our routes, which will be broken up by resource (users, auth, profile, and posts)
since all of our routes return json for our api, we made a folder inside our 'routes' folder called 'api'
because there is no server-rendered templates, it will all happen on the front end of our react application
'users.js' will handle registering users, adding users
'auth.js' will handle getting a json webtoken for authentication
'profile.js' will have routes that have anything to do with profiles (fetching them, adding them, updating them, etc.)
'posts.js' because we will have a little forum area (where we can like, comment, etc.)
*/

/*
MODELS:
in order to interact with our database, we have to create a model for each of our resources
so we made a folder called 'models'
inside the 'models' folder we made a file called 'User.js'
models typically always start with a capital letter
to create a model, you must create a schema, which just holds all the fields we want the particular resource to have
*/

/*
POSTMAN:
we are using Postman to GET and POST
to GET data, we put the url we want to get data from into a GET request
to POST data, or send data, we put the url we want to send data to into a POST request

we want to separate our resources for our endpoints into collections in Postman
collections are folders that can hold different requests
we created 3 collections in our Postman: "Posts", "Profiles", and "Users & Auth"

we saved a POST request to our "Users & Auth" collection called "Register User"
this way, whenever we want to make a request with the specific information that we saved, we can easily register a user with that information
we also saved a GET request to our "Users & Auth" collection called "Get auth user" so we can get an authenticated users info at any time by using their token
*/

/*
JSON:
json looks like this:
{
    "name": "Matthew Yarmolinsky"
}
*/

/*
EXPRESS-VALIDATOR:
we want to make sure the user sends the correct and required info 
for example, as a post request to api/users would require a name, an email, and a password (as can be seen in the User model inside the 'models' folder)
with express-validator, we can make sure the user is sending us the correct information in the correct form
*/

/*
MIDDLEWARE:
we created our own custom middleware inside a folder called 'middleware' in order to be able to send a token back in order to authenticate and access protected routes
inside our 'middleware' folder, we made a file called 'auth.js'
*/

const express = require("express"); //bring in express
const connectDB = require("./config/db"); //bring in db.js from folder 'config'

const app = express(); //initialize our app with express()

connectDB(); // Connect Database

// Init Middleware
app.use(express.json({ extended: false }));

app.get("/", (req, res) => res.send("API Running"));
//endpoint just to test out. sends a get request to '/' and create a callback with request, response (req, res) and just do a res.send()
//res.send() sends data to a browser.  This one just says "API Running"

// Define Routes
app.use("/api/users", require("./routes/api/users")); //this makes '/api/users' pertain to the '/' in the router.get() call in 'users.js' in 'routers/api/'
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/posts", require("./routes/api/posts"));

const PORT = process.env.PORT || 5000;
//process.env.PORT will look for an environment variable called PORT to use (this is where we will get the port number when we deploy to Heroku)
//locally, however, we want it to run on port 5000 (if there is no environment variable set it will default to 5000)

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
//listen on a port and create a callback (do something when it connects, in this case console.log that the server started and which port it started on)
