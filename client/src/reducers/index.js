import { combineReducers } from "redux";
import alert from "./alert"; //bring in our alert reducer
import auth from "./auth";
import profile from "./profile";
import post from "./post";

export default combineReducers({ alert, auth, profile, post }); //'combineReducers()' takes in a object which will have any and all reducers we create
