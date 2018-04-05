import {t} from "../helpers/translator";

var Helpers = (function () {

    return {
        /**
         * @name getWeightedRandom
         * @description returns "weighted" random element of array
         * @param {Array} array the array
         * @param {String} weightFieldName array's objects' field name that contains it's weight
         *
         * @return {Object} random weighted array item
         */
        getWeightedRandom: function getWeightedRandom (array, weightFieldName = 'weight') {
            var variants = [], i;
            array.forEach(function (item) {
                if (item.ignore) {
                    return;
                }
                for (i = 0; i < (item[weightFieldName] || 1); i++) {
                    variants.push(item);
                }
            });

            var index = Math.floor(Math.random() * variants.length);

            return variants[index];
        },

        cloneDeep: function (data) {
            return JSON.parse(JSON.stringify(data));
        },
        /**
         * @name byOrderSortingFunc
         * @description Function to be used by sort(), to sort by object's "order" property
         * @param a {Object}
         * @param b {Object}
         * @returns {number}
         */
        byOrderSortingFunc: function byOrderSortingFunc (a, b) {
            return a.order - b.order;
        },
        /**
         * @name orderByPrice
         * @description Function to be used by sort(), to sort by object's "price" property
         * @param a {Object}
         * @param b {Object}
         * @returns {number}
         */
        orderByPrice: function orderByPrice (a, b) {
            return a.price - b.price;
        },
        /**
         * @name orderByName
         * @description Function to be used by sort(), to sort by object's "name" property
         * @param a {Object}
         * @param b {Object}
         * @returns {number}
         */
        orderByName: function orderByName (a, b) {
            let nameA = t(a.name),
                nameB = t(b.name);
            if (nameA > nameB) {
                return 1;
            } else if (nameA < nameB){
                return -1
            }
            return 0
        },
        /**
         * @name byStartTsSortingFunc
         * @description Function to be used by sort(), to sort by object's "start_ts" property
         * @param a {Object}
         * @param b {Object}
         * @returns {number}
         */
        byStartTsSortingFunc: function byStartTsSortingFunc (a, b) {
            return a.start_ts - b.start_ts;
        },
        /**
         * @name createSortingFn
         * @description Creates sorting fynction to sort by provided field name
         * @param {String} field field name
         * @param {Boolean} ascending true to sort ascending, false for descending
         * @returns {function(): number}
         */
        createSortingFn: function (field, ascending = true) {
            return (a, b) => ((a[field] - b[field]) * (ascending ? 1 : -1));
        },
        /**
         * @name objectToArray
         * @description Converts object to array
         * @param {Object} obj
         * @param {String} addKeyNameAsProperty if defined, object key names will be added to array elements with property of this name
         * @param {function} calculator if defined, callback will called for each item and will passed whole object for calculating purpose
         * @returns {Array}
         */
        objectToArray: function objectToArray (obj, addKeyNameAsProperty = null, calculator = null) {
            var arr = [];
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    if (addKeyNameAsProperty) {
                        obj[key][addKeyNameAsProperty] = key;
                    }
                    calculator && calculator(obj[key]);
                    arr.push(obj[key]);
                }
            }
            return arr;
        },
        /**
         * @name firstElement
         * @description Returns first element of an object
         * @param {Object} obj
         * @param {boolean|function} sortFunc function to sort object keys (false for no sorting). if not provided, will be sorted by
         * @returns {*}
         */
        firstElement: function firstElement (obj, sortFunc = null, key = null) {
            if (typeof obj !== "object") {
                return null;
            }
            var keys = Object.keys(obj);
            if (!keys.length) {
                return null;
            }
            if (sortFunc === false) {
                return obj[keys[0]];
            }
            sortFunc = sortFunc || this.byOrderSortingFunc;
            return this.objectToArray(obj, key).sort(sortFunc)[0];
        },
        /**
         * @ngdoc method
         * @name MergeRecursive
         * @methodOf vbet5.service:Utils
         * @description merges 2 objects recursively
         * @param {Object} to destination object
         * @param {Object} from source object
         * @return {Object} returns changed destination object
         */
        mergeRecursive: function mergeRecursive (to, from) {
            var p;
            for (p in from) {
                if (from.hasOwnProperty(p)) {
                    try {
                        if (from[p].constructor === Object) {
                            if (from[p]['@replace'] === true) {  //replace field instead of merging if specified
                                to[p] = from[p];
                                delete to[p]['@replace'];
                            } else {
                                to[p] = mergeRecursive(to[p], from[p]);
                            }
                        } else {
                            to[p] = from[p];
                        }
                    } catch (e) {
                        to[p] = from[p];
                    }
                }
            }
            return to;
        },

        /**
         * @name getArrayObjectElementHavingFieldValue
         * @description  returns array element object having field with specified value
         * @param {Array} array array of objects
         * @param {String} field the field name
         * @param {Object|String|Number} value field value
         * @return {Object|null}  object or null if not found
         */
        getArrayObjectElementHavingFieldValue: function getArrayObjectElementHavingFieldValue (array, field, value) {
            var i;
            for (i = 0; i < array.length; i++) {
                if (array[i][field] === value) {
                    return array[i];
                }
            }
            return null;
        },
        /**
         * @name nl2br
         * @description converts newlines to <br> in given string
         * @param {String} str string to convert
         *
         * @return {String} string with <br>s instead of new lines
         */
        nl2br: function nl2br (str) {
            return str.replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + '<br>' + '$2');
        },

        /**
         * @name isNumeric
         * @description Checks if argument is numeric
         * @param {*} n
         * @returns {boolean}
         */
        isNumeric: function isNumeric (n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        },
        /**
         * @name isAndroid
         * @description Checks if operating system of device is android
         * @returns {boolean}
         */
        isAndroid: function () {
            return Helpers.getMobileOperatingSystem() === 'android';
        },
        /**
         * @name isIos
         * @description Checks if operating system of device is ios
         * @returns {boolean}
         */
        isIos: function () {
            return Helpers.getMobileOperatingSystem() === 'iphone';
        },
        /**
         * @name windows phone
         * @description Checks if operating system of device is windows phone
         * @returns {boolean}
         */
        isWindowsPhone: function () {
            return Helpers.getMobileOperatingSystem() === 'windows';
        },
        /**
         * @name isPC
         * @description Checks if operating system of device is PC
         * @returns {boolean}
         */
        isPC: function () {
            return !Helpers.isIos() && !Helpers.isAndroid() && !Helpers.isWindowsPhone() && window.innerWidth > 980;
        },
        /**
         * @name getMobileOperatingSystem
         * @description Returns device operation system name or unknown
         * @returns {string}
         */
        getMobileOperatingSystem: function getMobileOperatingSystem () {
            var userAgent = navigator.userAgent || navigator.vendor || window.opera;

            // Windows Phone must come first because its UA also contains "Android"
            if (/windows phone/i.test(userAgent)) {
                return "windows";
            }

            if (/android/i.test(userAgent)) {
                return "android";
            }

            // iOS detection from: http://stackoverflow.com/a/9039885/177710
            if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
                return "iphone";
            }
            // if (/android/i.test(userAgent)) {
            //     return "android";
            // }
            return "unknown";
        },
        /**
         * @name getHashParams
         * @description Returns location hash params
         * @returns {{}}
         */
        getHashParams: function getHashParams () {
            var hashParams = {};
            var e,
                a = /\+/g,  // Regex for replacing addition symbol with a space
                r = /([^?/&;=]+)=?([^&;]*)/g,
                d = function (s) {
                    return decodeURIComponent(s.replace(a, " "));
                },
                q = window.location.hash.substring(1);
            while (e = r.exec(q)) {
                hashParams[d(e[1])] = d(e[2]);
            }
            return hashParams;
        },
        /**
         * @name getQueryStringValue
         * @description Returns location query param
         * @param {String} name of the param
         * @param {String} url to get the param form given string default is current location
         * @returns {String}
         */
        getQueryStringValue: function (name, url) {
            if (!url) {
                url = window.location.href;
            }
            name = name.replace(/[\[\]]/g, "\\$&");
            let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
                results = regex.exec(url);
            if (!results) return null;
            if (!results[2]) return '';
            return decodeURIComponent(results[2].replace(/\+/g, " "));
        },
        /**
         * @name getUriParam
         * @description Returns hash or query param from location
         * @param {string} key
         * @returns {*}
         */
        getUriParam: function (key) {
            return Helpers.getQueryStringValue(key, null) || (Helpers.getHashParams() || {})[key];
        },
        /**
         * @name GetObjectByStringPath
         * @description Returns part of the object o identified by path s
         * @param {Object} o source object
         * @param {String} s path (e.g. "data.messages")
         * @returns {*}
         */
        GetObjectByStringPath: function GetObjectByStringPath (o, s) {
            s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
            s = s.replace(/^\./, '');           // strip a leading dot
            var a = s.split('.');
            for (var i = 0, n = a.length; i < n; ++i) {
                var k = a[i];
                if (k in o) {
                    o = o[k];
                } else {
                    return;
                }
            }
            return o;
        },
        /**
         * @name CheckIfPathExists
         * @description Returns part of the object o identified by path s
         * @param {Object} o source object
         * @param {String} path (e.g. "data.messages")
         * @returns {boolean}
         */
        CheckIfPathExists (o, path) {
            try {
                return Boolean(Helpers.GetObjectByStringPath(o, path));
            } catch (e) {
                return false;
            }
        },
        /**
         * @name AssignValueToPropName
         * @description recursive assigning values to object from string path
         * @param {object} obj
         * @param {*} prop
         * @param {*} value
         */
        AssignValueToPropName: function (obj, prop, value) {
            if (typeof prop === "string") {
                prop = prop.split(".");
            }
            if (prop.length > 1) {
                let e = prop.shift();
                this.AssignValueToPropName(obj[e] =
                        Object.prototype.toString.call(obj[e]) === "[object Object]"
                            ? obj[e]
                            : {},
                    prop,
                    value);
            } else {
                obj[prop[0]] = value;
            }
        },
        /**
         * @name generateQueryParamsFromObject
         * @description Returns uri encoded url
         * @param {object} obj
         * @param {string} url
         * @param {string} separator
         * @param {string} switchQueryToHash
         * @returns {string}
         */
        generateQueryParamsFromObject (obj, url = "", separator, switchQueryToHash) {
            return Object.keys(obj).reduce((str, key) => {
                if (str !== "") {
                    str += str.indexOf(switchQueryToHash || "?") === -1 ? switchQueryToHash || '?' : separator || "&";
                }
                str += key + "=" + encodeURIComponent(obj[key]);
                return str;
            }, url);
        },
        /**
         * @name removeMatchingPartFromObject
         * @description Removes object defined by path, field name and value from the object
         * @param {Object} obj the source object
         * @param {String} path string path to iterable object inside obj (e.g. "data.messages.messages")
         * @param {String} field field name
         * @param {*} value field value to match
         */
        removeMatchingPartFromObject: function removeMatchingPartFromObject (obj, path, field, value) {
            let container = this.GetObjectByStringPath(obj, path);
            if (Array.isArray(container)) {
                let index = container.reduce((acc, curr, ind) => (curr[field] === value ? ind : acc), null);
                (index !== null) && container.splice(index, 1);
            } else if (typeof container === "object") {
                let key = Object.keys(container).reduce((acc, curr) => (container[curr][field] === value ? curr : acc ), null);
                (key !== null) && delete container[key];
            }
        },

        /**
         * @name checkStatus
         * @description helper function to check request status and throw exception when something is wrong
         * @param {Object} response
         * @returns {Object | Undefined}
         */
        checkStatus: function (response) {
            if (response.status >= 200 && response.status < 300) {
                return response;
            } else {
                let error = new Error(response.statusText);
                error.response = response;
                throw error;
            }
        },

        /**
         * @name convertBalance
         * @description helper function remove numbers ,if after dot numbers lenght > 2
         * @param {number} value
         * @returns {number}
         */
        convertBalance: function (value) {
            value = Math.floor(value * 100) / 100;
            return value;
        }

    };

})();

export default Helpers;