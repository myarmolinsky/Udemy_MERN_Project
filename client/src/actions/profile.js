import axios from "axios";
import { setAlert } from "./alert";
import { GET_PROFILE, PROFILE_ERROR } from "./types";

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
