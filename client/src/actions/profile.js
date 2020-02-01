import axios from "axios";
import { setAlert } from "./alert";
import { GET_PROFILE, PROFILE_ERROR, UPDATE_PROFILE } from "./types";

// Get curren user's profile
export const getCurrentProfile = () => async dispatch => {
  try {
    const res = await axios.get("api/profile/me"); //this route returns all the profile data

    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status } //send the error message and status if there is an error with our request
    });
  }
};

// Create or update profile
export const createProfile = (
  formData,
  history,
  edit = false
) => async dispatch => {
  //we pass in the history object because it has a method called 'push()' that will redirect us to a clienside route
  //the third parameter 'edit' is false by default. this way we know if we are creating a profile or updating it
  try {
    const config = {
      //since we're sending data, we need to create a config object
      headers: {
        "Content-Type": "application/json"
      }
    };

    const res = await axios.post("/api/profile", formData, config);
    //we are making a post request to '/api/profile' with the information in our formData object and with our config

    dispatch({
      //dispatch is what we dispatch to our reducer
      type: GET_PROFILE,
      payload: res.data
    });

    dispatch(setAlert(edit ? "Profile Updated" : "Profile Created", "success")); //we want to display an alert saying whether a profile was created or updated so we check if edit it T/F

    if (!edit) {
      //if a profile was created, we want to redirect the user to the dashboard afterward
      history.push("/dashboard"); //redirecting in an action is different from redirecting in components. we can't use '<Redirect></Redirect>'
      //instead we have to pass in the 'history' object which has the 'push()' method, into which we pass where we want to redirect to
    }
  } catch (err) {
    const errors = err.response.data.errors; //get any errors we had with our response

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, "danger"))); //display an alert for any error we may have
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status } //send the error message and status if there is an error with our request
    });
  }
};

// Add Experience
export const addExperience = (formData, history) => async dispatch => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };

    const res = await axios.put("/api/profile/experience", formData, config);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    });

    dispatch(setAlert("Experience Added", "success"));

    history.push("/dashboard");
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Add Education
export const addEducation = (formData, history) => async dispatch => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };

    const res = await axios.put("/api/profile/education", formData, config);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    });

    dispatch(setAlert("Education Added", "success"));

    history.push("/dashboard");
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};
