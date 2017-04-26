import 'whatwg-fetch';
import {CMS_LOAD_START, CMS_LOAD_DONE, CMS_DATA_RECEIVED} from './actionTypes/';
import Config from "../config/main";

/**
 * @description Load pages from cms by slag
 * @param {String} slug
 * @param {String} lang
 * @param {String} type
 * @returns {Function} async action dispatcher
 */
export const CmsLoadPage = (slug, lang, type = "pages") => {

    var url = Config.cms && Config.cms.url + "json?base_host=" + Config.cms.baseHost + "&ssl=1&" +
              "lang=" + lang +
            (type === "pages" ? "&json=get_page&slug=" : "&json=get_category_posts&count=999&category_slug=") +
             slug +
              "&children=1&exclude=author,excerpt,comments,comment_status,comment_count,tags,attachments";

    function checkStatus (response) {
        if (response.status >= 200 && response.status < 300) {
            return response;
        } else {
            var error = new Error(response.statusText);
            error.response = response;
            throw error;
        }
    }

    return function (dispatch) {
        console.debug("cms action loading", url);
        dispatch(CmsLoadingStart(slug));
        fetch(url)
            .then(checkStatus).then(response => response.json())
            .then((json) => dispatch(CmsDataReceived(json, slug)))
            .catch()
            .then(() => dispatch(CmsLoadingDone(slug)));
    };
};

/**
 * @description Start page loading
 * @param {String} key
 * @returns {Object} New state
 */
export const CmsLoadingStart = (key) => {
    return {
        type: CMS_LOAD_START,
        key
    };
};

/**
 * @description Done loading page from CMS
 * @param {String} key
 * @returns {Object} New state
 */
export const CmsLoadingDone = (key) => {
    return {
        type: CMS_LOAD_DONE,
        key
    };
};

/**
 * @description CMS page data recived
 * @param {Object} message
 * @param {String} key
 * @returns {Object} New state
 */
export const CmsDataReceived = (message, key) => {
    return {
        type: CMS_DATA_RECEIVED,
        payload: message,
        key
    };
};