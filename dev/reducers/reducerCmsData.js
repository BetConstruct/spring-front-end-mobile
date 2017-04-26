import _ from "lodash";
import {CMS_LOAD_START, CMS_LOAD_DONE, CMS_DATA_RECEIVED} from "../actions/actionTypes/";

const CmsDataReducer = (state = {data: {}, loaded: {}}, action = {}) => {
    var ret = _.cloneDeep(state);
    switch (action.type) {
        case CMS_LOAD_START:
            ret.loaded[action.key] = false;
            return ret;
        case CMS_LOAD_DONE:
            ret.loaded[action.key] = true;
            return ret;
        case CMS_DATA_RECEIVED:
            ret.data[action.key] = action.payload;
            return ret;
        default :
            return state;
    }
};

export default CmsDataReducer;