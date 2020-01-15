import { combineReducers } from "redux";
import alert from "./alert"; //bring in our alert reducer
import auth from "./auth";
import profile from "./profile";

export default combineReducers({ alert, auth, profile }); //'combineReducers()' takes in a object which will have any reducers we create
