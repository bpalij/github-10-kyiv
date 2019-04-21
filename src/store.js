import {FIRST_LOAD_START, 
    FIRST_LOAD_COMPLETE, 
    FIRST_LOAD_ERROR, 
    USER_STARS_LOAD_START,
    USER_STARS_LOAD_COMPLETE,
    USER_STARS_LOAD_ERROR} from "./actionTypes.js";
import {createStore} from 'redux';


const initialState = {
    wait: true,
    // loading: false,
    // error: false,
    //those are not required, because in logical comparison absent fields are considered false 
    // respond:{},
    // starCount:{}
    //those are not required in the beginning
}

function changeStarCount(state, user, value){
    const newState = {...state};
    // newState.starCount[user] = value; //when mutating starcount even in copied state react did not update ui 
    const newStarCount = {...state.starCount};
    newStarCount[user] = value;
    newState.starCount = newStarCount;
    return newState;
}
// only for a reducer for not repeating the same things

function reducer(state = initialState, action){
    switch (action.type) {
        case FIRST_LOAD_START:
            return {
                // wait: false,
                loading: true,
                // error: false,
                // respond: {},
                // starCount: {}
            };
        case FIRST_LOAD_COMPLETE:
            const starCount = {};
            action.data.items.forEach((user) => {
                starCount[user.login]="Not Loading Yet...";                
            });
            return {
                // wait: false,
                // loading: false,
                // error: false,
                respond: action.data,
                starCount: starCount,
            };
        case FIRST_LOAD_ERROR:
            return {error: action.error};
        case USER_STARS_LOAD_START:
            // const newState = {...state};
            // newState.starCount[action.user] = "Loading...";
            // return newState;
            // replaced this with function
            return changeStarCount(state, action.user, "Loading...");
        case USER_STARS_LOAD_COMPLETE:
            // const newState={...state};
            // newState.starCount[action.user] = action.count;
            // return newState;
            return changeStarCount(state, action.user, action.count);
        case USER_STARS_LOAD_ERROR:
            console.error(action.error); // to console the error and not to spoil/break the UI 
            return changeStarCount(state, action.user, "Error! Try again later!");
        default: 
            return state;
    }
};

const store = createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
//to attach to debug tool
export default store;