import React, { Fragment, useState } from "react"; //we bring in the 'useState' hook because we are using a functional component
import { Link } from "react-router-dom";
// import axios from "axios";

//since it's a form, we need to have some component state because each input needs to have its own state
//they also needs to have an 'onchange' handler so when we type in it, it updates the state
const Register = () => {
  const [formData, setFormData] = useState(
    //pull this from useState()
    {
      //default values go inside here
      name: "",
      email: "",
      password: "",
      password2: ""
    }
  );

  const { name, email, password, password2 } = formData; //destructure and pull those values from the state 'formData'
  //the first thing inside the [] brackets is our state, which is 'formData', so it will be an object with all the field values
  //the second thing is the function we want to use to update our state, which is 'setFormData'

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value }); //'onChange' calls 'setFormData()
  //in 'setFormData()' we want to change the state but we only want to change the 'name' field so we make a copy of 'formData' with the spread operator ('...')
  //after copying the state, we put in the field we want to change and what we want to change it to
  //we want to change the field associated with the name of the part of the form we are filling out so we use '[e.target.name]' to get the name of it
  //and we set the field to the new value in the part of the form we are changing by using 'e.target.value'

  const onSubmit = async e => {
    e.preventDefault(); //do this because this is a submit
    if (password !== password2) {
      console.log("Passwords do not match");
    } else {
      console.log("SUCCESS");
      /*
      const newUser = {
        name,
        email,
        password
      };
      try {
        const config = {
          //since we are sending data, we create a 'config' object which has a 'headers' object
          headers: {
            "Content-Type": "application/json"
          }
        };

        const body = JSON.stringify(newUser);

        const res = await axios.post("/api/users", body, config); //first parameter is the proxy we are making a post request to (which we established in our 'users.js' file)
        //second parameter is the data
        //third parameter is the config
        console.log(res.data);
      } catch (err) {
        console.error(err.response.data);
      }
      */
    }
  };

  return (
    <Fragment>
      <h1 className="large text-primary">Sign Up</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Create Your Account
      </p>
      <form className="form" onSubmit={e => onSubmit(e)}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Name"
            name="name"
            value={name} // set the 'Name' part of the form to the 'name' value we get from the state 'formData'
            onChange={e => onChange(e)} //we need an onChange handler to be able to type inside the component
            //the goal is to call 'setFormData()' and to update the 'name' field in the state
            //we could call 'setFormData()' directly but we are calling a seperate onChange function instead
            required
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={e => onChange(e)}
            required
          />
          <small className="form-text">
            This site uses Gravatar so if you want a profile image, use a
            Gravatar email
          </small>
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            minLength="6"
            value={password}
            onChange={e => onChange(e)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm Password"
            name="password2"
            minLength="6"
            value={password2}
            onChange={e => onChange(e)}
            required
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Register" />
      </form>
      <p className="my-1">
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
    </Fragment>
  );
};

export default Register;
