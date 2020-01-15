import { GET_PROFILE, PROFILE_ERROR } from "../actions/types";

//we will have actions to get the profile, create it, update it, clear it from the state, etc.

const initialState = {
  profile: null, //all of our profile fata gets put in here upon logging in, as well as any profile we visit
  profiles: [], //this is for the profile listing page where we list developpers
  repos: [], //repos go here
  loading: true,
  error: {} //for any errors in the request
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_PROFILE:
      return {
        ...state,
        profile: payload,
        loading: false
      };
    case PROFILE_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    default:
      return state;
  }
}
