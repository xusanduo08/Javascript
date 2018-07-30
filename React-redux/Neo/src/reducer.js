import {combineReducers} from "redux";

function input(state, action){
    return action.input.toUpperCase
}

export default combineReducers(input);