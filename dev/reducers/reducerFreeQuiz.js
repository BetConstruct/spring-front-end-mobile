import {
    FREE_QUIZ_LOADING_START,
    FREE_QUIZ_LOADING_DONE,
    FREE_QUIZ_LOADING_FAILED,
    FREE_QUIZ_SET_DATE_FILTER,
    FREE_QUIZ_SET_SELECTED_EVENTS,
    FREE_QUIZ_TOGGLE_SELECTED_EVENT
} from "../actions/actionTypes/";

const getCurrentState = (state, key, loading, loaded, failed, data) => ({
    ...state,
    loadedState: {
        ...state.loadedState,
        [key]: {
            ...state.loadedState[key],
            loading,
            loaded,
            failed
        }
    },
    data: {
        ...state.data,
        [key]: data
    }
});

const FreeQuizReducer = (state = {data: {}, loadedState: {}, day: 0, selected: {}}, action = {}) => {

    switch (action.type) {
        case FREE_QUIZ_LOADING_START:
            return getCurrentState(state, action.key, true, false, false);
        case FREE_QUIZ_LOADING_DONE:
            return getCurrentState(state, action.key, false, true, false, action.payload);
        case FREE_QUIZ_LOADING_FAILED:
            return getCurrentState(state, action.key, false, false, true, action.payload);
        case FREE_QUIZ_TOGGLE_SELECTED_EVENT:
            return {
                ...state,
                selected: {
                    ...state.selected,
                    [`${action.key}`]: {
                        ...state.selected[action.key],
                        ...action.payload
                    }
                }
            };
        case FREE_QUIZ_SET_SELECTED_EVENTS:
            return {
                ...state,
                selected: {
                    ...state.selected,
                    ...action.payload
                }
            };
        case FREE_QUIZ_SET_DATE_FILTER:
            return {
                ...state,
                day: action.payload
            };
        default :
            return state;
    }
};

export default FreeQuizReducer;