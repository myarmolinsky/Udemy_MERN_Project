import { combineReducers } from "redux";
import alert from "./alert"; //bring in our alert reducer

export default combineReducers({ alert }); //'combineReducers()' takes in a object which will have any reducers we create
