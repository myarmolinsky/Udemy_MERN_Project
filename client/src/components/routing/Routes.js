import React from "react";
import { Route, Switch } from "react-router-dom";
import Register from "../auth/Register";
import Login from "../auth/Login";
import Alert from "../layout/Alert";
import Dashboard from "../dashboard/Dashboard";
import CreateProfile from "../profile-forms/CreateProfile";
import EditProfile from "../profile-forms/EditProfile";
import AddExperience from "../profile-forms/AddExperience";
import AddEducation from "../profile-forms/AddEducation";
import PrivateRoute from "../routing/PrivateRoute";
import Profiles from "../profiles/Profiles";
import Profile from "../profile/Profile";
import Posts from "../posts/Posts";
import Post from "../post/Post";
import NotFound from "../layout/NotFound";

const Routes = () => {
  return (
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
        <PrivateRoute exact path="/create-profile" component={CreateProfile} />
        <PrivateRoute exact path="/edit-profile" component={EditProfile} />
        <PrivateRoute exact path="/add-experience" component={AddExperience} />
        <PrivateRoute exact path="/add-education" component={AddEducation} />
        <PrivateRoute exact path="/posts" component={Posts} />
        <PrivateRoute exact path="/posts/:id" component={Post} />
        <Route component={NotFound} />
      </Switch>
    </section>
  );
};

export default Routes;
