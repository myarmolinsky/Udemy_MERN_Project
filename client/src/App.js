import React, { Fragment, useEffect } from "react"; //bring in react and Fragment
import "./App.css";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Alert from "./components/layout/Alert";
import Dashboard from "./components/dashboard/Dashboard";
import CreateProfile from "./components/profile-forms/CreateProfile";
import EditProfile from "./components/profile-forms/EditProfile";
import AddExperience from "./components/profile-forms/AddExperience";
import AddEducation from "./components/profile-forms/AddEducation";
import PrivateRoute from "./components/routing/PrivateRoute";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"; //import react router
// Redux
import { Provider } from "react-redux"; //the Provider connects Redux and React
import store from "./store"; //bring in the store
import { loadUser } from "./actions/auth";
import setAuthToken from "./utils/setAuthToken";
import Profiles from "./components/profiles/Profiles";
import Profile from "./components/profile/Profile";
import Posts from "./components/posts/Posts";
import Post from "./components/post/Post";

if (localStorage.token) {
  //we need to call this here too (not just in our auth action) because otherwise it only gets called once but we need to check it often
  setAuthToken(localStorage.token);
}

const App = () => {
  useEffect(() => {
    //useEffect takes in a function
    store.dispatch(loadUser()); //dispatch 'loadUser()' directly on the store
  }, []); //we only want this to run once, but useEffect runs as an infinite loop unless we add a second parameter to it. the second parameter is just empty [] brackets

  return (
    //changed this from 'function App() {}' to an arrow function: 'const App =() => {}'
    <Provider store={store}>
      {/*we pass our store into the Provider*/}
      {/*for the Provider to work, we have to wrap everything inside it*/}
      <Router>
        {/*for the router to work, we have to wrap everything inside it*/}
        <Fragment>
          <Navbar />
          <Route exact path="/" component={Landing} />
          {/*instead of '<Landing />', we use this. we set 'exact path' equal to the index which is just '/' and the component we want to load is 'Landing'*/}
          <section className="container">
            {/*every page within the theme except for the landing page has a class of 'container' to push everything to the middle
        for the landing page, we want the image to go all the way over so it doesn't have the class of 'container'*/}
            <Alert />
            <Switch>
              {/*wrap everything in a switch so we don't have issues, especially when we create our 'private route' component*/}
              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/profiles" component={Profiles} />
              <Route exact path="/profile/:id" component={Profile} />
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
              {/*routes for 'register' and 'login'*/}
              {/*we want the dashboard route to be private because only logged in users should be able to access it so we made our own PrivateRoute component*/}
              <PrivateRoute
                exact
                path="/create-profile"
                component={CreateProfile}
              />
              <PrivateRoute
                exact
                path="/edit-profile"
                component={EditProfile}
              />
              <PrivateRoute
                exact
                path="/add-experience"
                component={AddExperience}
              />
              <PrivateRoute
                exact
                path="/add-education"
                component={AddEducation}
              />
              <PrivateRoute exact path="/posts" component={Posts} />
              <PrivateRoute exact path="/posts/:id" component={Post} />
            </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
