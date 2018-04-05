import {
    SET_REGISTRATION_ACTIVE_STEP
} from "../actions/actionTypes/index";

const RegistrationReducer = (state = {data: {}, registrationState: 0}, action) => {
    switch (action.type) {
        case SET_REGISTRATION_ACTIVE_STEP:
            return {
                ...state,
                data: {
                    ...state.data,
                    ...action.meta
                },
                registrationState: action.payload
            };
        default :
            return state;
    }
};

export default RegistrationReducer;