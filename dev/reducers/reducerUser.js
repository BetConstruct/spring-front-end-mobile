import {REALLY_LOGGED_IN,
    LOGGED_IN,
    LOGGED_OUT,
    LOGIN_START,
    LOGIN_FAILED,
    USER_PROFILE_UPDATE_RECEIVED,
    CAPTCH_LOAD_SUCCESS,
    CAPTCH_LOAD_FAILURE,
    UPDATE_HASH_PARAMS,
    RESET_HASH_PARAMS,
    STORE_HASH_PARAMS
} from "../actions/actionTypes/";

const UserReducer = (state = {captcha: {data: {}}, hashParams: {}}, action = {}) => {

    switch (action.type) {
        case REALLY_LOGGED_IN:
            return Object.assign({}, state, {
                reallyLoggedIn: action.payload
            });
        case LOGGED_IN:
            return Object.assign({}, state, {
                authData: action.payload.authData, // authData holds user Id and token which are needed  for logging in later without entering password.
                loginInProgress: false,
                loginFailReason: undefined,
                loggedIn: true
            });
        case LOGIN_FAILED:
            return Object.assign({}, state, {loginFailReason: action.payload, loginInProgress: false, loggedIn: false, reallyLoggedIn: false});
        case LOGGED_OUT:
            return Object.assign({}, state, {authData: undefined, profile: undefined, loginInProgress: undefined, loggedIn: false, reallyLoggedIn: false});
        case LOGIN_START:
            return Object.assign({}, state, {loginInProgress: true}); // we need this intermediate state for some commands to wait
        case USER_PROFILE_UPDATE_RECEIVED:
            return Object.assign({}, state, {profile: action.payload});
        case CAPTCH_LOAD_SUCCESS:
            return Object.assign({}, state, {captcha: {loaded: true, data: action.payload}});
        case CAPTCH_LOAD_FAILURE:
            return Object.assign({}, state, {captcha: {loaded: false, data: action.payload}});
        case STORE_HASH_PARAMS:
            return Object.assign({}, state, {hashParams: action.payload});
        case RESET_HASH_PARAMS:
            return Object.assign({}, state, {hashParams: {}});
        case UPDATE_HASH_PARAMS:
            return Object.assign({}, state, {hashParams: {
                ...state.hashParams,
                ...action.payload
            }});
        default :
            return state;
    }
};

export default UserReducer;