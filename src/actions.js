import {FIRST_LOAD_START, 
    FIRST_LOAD_COMPLETE, 
    FIRST_LOAD_ERROR, 
    USER_STARS_LOAD_START,
    USER_STARS_LOAD_COMPLETE,
    USER_STARS_LOAD_ERROR} from "./actionTypes.js";

export const firstLoadStart = () => {return {type: FIRST_LOAD_START}};
export const firstLoadComplete = (data) => {return {type: FIRST_LOAD_COMPLETE, data: data}};
export const firstLoadError = (error) => {return {type: FIRST_LOAD_ERROR, error: error}};
export const userStarsLoadStart = (user) => {return {type: USER_STARS_LOAD_START, user: user}};
export const userStarsLoadComplete = (user, count) => {return {type: USER_STARS_LOAD_COMPLETE, user: user, count: count}};
export const userStarsLoadError = (user, error) => {return {type:USER_STARS_LOAD_ERROR, user: user, error: error}};