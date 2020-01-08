import React, { Fragment } from "react"; //bring in react and Fragment
import "./App.css";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Alert from "./components/layout/Alert";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"; //import react router
// Redux
import { Provider } from "react-redux"; //the Provider connects Redux and React
import store from "./store"; //bring in the store

const App = () => (
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
            {/*routes for 'register' and 'login'*/}
          </Switch>
        </section>
      </Fragment>
    </Router>
  </Provider>
);

export default App;
