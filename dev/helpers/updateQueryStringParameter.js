/**
 * @name updateQueryStringParameter
 * @description  returns valid query uri.
 * @param {String} uri
 * @param {String} key
 * @param {String|Number} value
 * @return {String} full uri
 */
export const updateQueryStringParameter = (uri, key, value) => {
    var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
    var separator = uri.indexOf('?') !== -1 ? "&" : "?";
    if (uri.match(re)) {
        return uri.replace(re, '$1' + key + "=" + value + '$2');
    } else {
        return uri + separator + key + "=" + value;
    }
};