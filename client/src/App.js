import React, { Fragment } from "react"; //bring in react and Fragment
import "./App.css";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"; //import react router

const App = () => (
  //changed this from 'function App() {}' to an arrow function: 'const App = () => {}'
  //for the router to work, we have to wrap everything inside it
  <Router>
    <Fragment>
      <Navbar />
      <Route exact path="/" component={Landing} />
      {/*instead of '<Landing />', we use this. we set 'exact path' equal to the index which is just '/' and the component we want to load is 'Landing'*/}
      <section className="container">
        {/*every page within the theme except for the landing page has a class of 'container' to push everything to the middle
        for the landing page, we want the image to go all the way over so it doesn't have the class of 'container'*/}
        <Switch>
          {/*wrap everything in a switch so we don't have issues, especially when we create our 'private route' component*/}
          <Route exact path="/register" component={Register} />
          <Route exact path="/login" component={Login} />
          {/*routes for 'register' and 'login'*/}
        </Switch>
      </section>
    </Fragment>
  </Router>
);

export default App;
