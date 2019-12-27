import React from "react";
import { Link } from "react-router-dom"; //we want to use 'Link' instead of 'a href'

const Navbar = () => {
  //this nav tag came from the 'index.html' provided by the course
  return (
    //changed instances of 'class' to 'className'
    <nav className="navbar bg-dark">
      <h1>
        <Link to="/">
          <i className="fas fa-code"></i> DevConnector
        </Link>
      </h1>
      <ul>
        <li>
          <Link to="!#">Developers</Link>
        </li>
        <li>
          <Link to="/register">Register</Link>
        </li>
        <li>
          <Link to="/login">Login</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
