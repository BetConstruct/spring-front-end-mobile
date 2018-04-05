import 'whatwg-fetch';
import {CMS_LOAD_START, CMS_LOAD_DONE, CMS_DATA_RECEIVED} from './actionTypes/';
import Config from "../config/main";

/**
 * @name addHttpsFlag
 * @description returns ssl=1& string if URL is https, empty string otherwise
 * @param {string} url
 * @returns {string}
 */
function addHttpsFlag (url = "") {
    return url.split(":/")[0].toLowerCase() === 'https' ? "&ssl=1&" : "&";
}

/**
 * @name generateRequestType
 * @description returns part of query
 * @param {string} type
 * @param {string} slug
 * @returns {string}
 */
function generateRequestType (type, slug) {
    switch (type) {
        case "pages":
            return `&json=get_page&slug=${slug}`;
        case "popup":
            return `&json=get_popup`;
        default:
            return slug.indexOf("promotions") !== -1 ? `&json=get_category_posts&count=999&category_slug=all` : `&json=get_category_posts&count=999&category_slug=${slug}`;
    }
}

/**
 * @description Load pages from cms by slag
 * @param {string} slug
 * @param {string} lang
 * @param {string} type
 * @param {string} exclude
 * @returns {Function} async action dispatcher
 */
export const CmsLoadPage = (slug, lang, type = "pages", exclude = "&children=1&exclude=author,excerpt,comments,comment_status,comment_count,tags,attachments") => {

    let cmsConfig = Config.cms,
        url = cmsConfig ? `${cmsConfig.url}json?base_host=${cmsConfig.baseHost}${addHttpsFlag(cmsConfig.url)}lang=${lang}${generateRequestType(type, slug)}${exclude}` : "";

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
        dispatch(CmsLoadingStart(slug));
        return fetch(url)
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