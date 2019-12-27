import React, { Fragment } from "react"; //bring in react and Fragment
import "./App.css";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";

const App = () => (
  //changed this from 'function App() {}' to an arrow function: 'const App = () => {}'
  <Fragment>
    <Navbar />
    <Landing />
  </Fragment>
);

export default App;
