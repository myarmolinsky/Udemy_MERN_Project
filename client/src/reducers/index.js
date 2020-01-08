import { combineReducers } from "redux";
import alert from "./alert"; //bring in our alert reducer
import auth from "./auth";

export default combineReducers({ alert, auth }); //'combineReducers()' takes in a object which will have any reducers we create
