import _ from "lodash";
import Config from "../config/main";
import {PREFERENCES_SET, PREFERENCES_RESET} from "../actions/actionTypes/";

const PreferencesReducer = (state = {oddsFormat: Config.env.oddFormat, lang: Config.env.lang}, action) => {
    var ret = _.cloneDeep(state);
    switch (action.type) {
        case PREFERENCES_SET:
            ret[action.key] = action.value;
            return ret;
        case PREFERENCES_RESET:
            return {oddsFormat: Config.env.oddFormat, lang: Config.env.lang};
        default :
            return state;
    }
};

export default PreferencesReducer;