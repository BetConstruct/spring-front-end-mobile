import {APP_READY} from "../actions/actionTypes/";

const AppReadyReducer = (state = false, action) => {
    switch (action.type) {
        case APP_READY:
            return true;
        default :
            return state;
    }
};

export default AppReadyReducer;