import {
    FREE_QUIZ_LOADING_START, FREE_QUIZ_LOADING_DONE, FREE_QUIZ_LOADING_FAILED,
    FREE_QUIZ_TOGGLE_SELECTED_EVENT, FREE_QUIZ_SET_SELECTED_EVENTS, FREE_QUIZ_SET_DATE_FILTER
} from "./actionTypes/index";
import Zergling from "../helpers/zergling";
import {OpenPopup} from "./ui";
import {t} from "../helpers/translator";

const freeQuizLoadingStart = (key) => ({
    type: FREE_QUIZ_LOADING_START,
    key
});

const freeQuizLoadingDone = (payload, key) => ({
    type: FREE_QUIZ_LOADING_DONE,
    payload,
    key
});

const freeQuizLoadingFail = (payload, key) => ({
    type: FREE_QUIZ_LOADING_FAILED,
    payload,
    key
});

export const GetFreeQuizData = (options) => (dispatch) => {
    dispatch(freeQuizLoadingStart(options.day));
    Zergling.get(options, "get_victorina_info")
        .then((response) => {
            if (response.victorinas) {
                return dispatch(freeQuizLoadingDone(response, options.day));
            }
            dispatch(freeQuizLoadingFail(response, options.day));
        })
        .catch((response) => dispatch(freeQuizLoadingFail(response, options.day)));
};

export const ToggleSelectedEvents = (payload, key) => {
    return {
        type: FREE_QUIZ_TOGGLE_SELECTED_EVENT,
        payload,
        key
    };
};

export const SetSelectedEvents = (payload) => {
    return {
        type: FREE_QUIZ_SET_SELECTED_EVENTS,
        payload
    };
};

export const SetQuizDateFilter = (payload) => {
    return {
        type: FREE_QUIZ_SET_DATE_FILTER,
        payload
    };
};

export const DoFreeQuizBet = (request, handler) => (dispatch) => {
    Zergling.get(request, 'do_bet_victorina').then(
        function (result) {
            handler(result);
        }
    ).catch(
        function (reason) {
            dispatch(OpenPopup("message", {
                title: t("Quiz Bet"),
                type: 'warning',
                body: t("Sorry we can't accept your bets now, please try later") + (reason.code ? ' (' + reason.code + ')' : '')
            }));
        }
    );
};