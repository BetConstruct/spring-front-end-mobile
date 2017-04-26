import 'whatwg-fetch';
import Config from "../config/main";
import WS from "./websocket";
import Helpers from "./helperFunctions";

var Zergling = (function (WS, Config) {
    'use strict';

    var Zergling = {};

    var subscriptions = {}, useWebSocket = false, sessionRequestIsInProgress = false, loginInProgress = false,
        uiLogggedIn = false, // uiLogggedIn is the login state displayed in UI (sometimes it differs from real one, see delayedLogoutIfNotRestored func)
        authData, session, connectionAvailable, isLoggedIn, longPollUrl;

    Zergling.loginStates = {
        LOGGED_OUT: 0,
        LOGGED_IN: 1,
        IN_PROGRESS: 2
    };

    Zergling.codes = { // Swarm response codes
        OK: 0,
        SESSION_LOST: 5,
        NEED_TO_LOGIN: 12
    };

    function getLanguageCode (lng) {
        if (Config.swarm.languageMap && Config.swarm.languageMap[lng]) {
            return Config.swarm.languageMap[lng];
        }
        return lng;
    }

    //helper func for fetch
    function checkStatus (response) {
        if (response.status >= 200 && response.status < 300) {
            return response;
        } else {
            var error = new Error(response.statusText);
            error.response = response;
            throw error;
        }
    }

    //helper func for fetch
    function parseJSON (response) {
        return response.json();
    }

    /**
     * @description returns randomly selected(taking weight into consideration) long poll url
     * @returns {String} long polling URL
     */
    function getLongPollUrl () {
        if (!longPollUrl) {
            longPollUrl = Helpers.getWeightedRandom(Config.swarm.url).url;
            console.debug('long Polling URL selected:', longPollUrl);
        }
        return longPollUrl;
    }

    /**
     * @description
     * Applies the diff on object
     * properties having null values in diff are removed from  object, others' values are replaced.
     *
     * Also checks the 'price' field for changes and adds new field 'price_change' as sibling
     * which indicates the change direction (1 - up, -1 down, null - unchanged)
     *
     * @param {Object} current current object
     * @param {Object} diff    received diff
     */
    function destructivelyUpdateObject (current, diff) {
        if (current === undefined || !(current instanceof Object)) {
            throw new Error('wrong call');
        }

        for (var key in diff) {
            if (!diff.hasOwnProperty(key)) continue;
            var val = diff[key];
            if (val === null) {
                delete current[key];
            } else if (typeof val !== 'object') {
                current[key] = val;
            } else { // diff[key] is Object
                if (typeof current[key] !== 'object' || current[key] === null) {
                    current[key] = val;
                } else {
                    var hasPrice = (current[key].price !== undefined);
                    var oldPrice;
                    if (hasPrice) {
                        oldPrice = current[key].price;
                    }
                    destructivelyUpdateObject(current[key], val);
                    if (hasPrice) {
                        current[key].price_change = (val.price === oldPrice) ? null : (oldPrice < val.price) * 2 - 1;
                    }
                }
            }
        }
    }

    /**
     * @description
     *  Restore subscriptions
     */
    function resubscribe () {
        // console.debug('resubscribing', useWebSocket, subscriptions);
        for (var subId in subscriptions) {
            if (!subscriptions.hasOwnProperty(subId)) continue;
            var subData = subscriptions[subId];
            // delete subscriptions[subId];   //clear previous data because we'll receive full data when resubscribing
            Zergling.subscribe(subData.request, subData.callback);
        }
    }

    /**
     * If session is lost or some sort of unexpected logout happens, we don't show it in UI immediately,
     * hoping that we'll be able to restore login in a reasonable time.
     * (here after 4 seconds login should have been restored or at least in progress)
     */
    var waitForLogin;
    function delayedLogoutIfNotRestored () {
        // console.debug('zergling delayedLogoutIfNotRestored', Config.env.authorized);
        Zergling.externalCallback({reallyLoggedIn: Zergling.loginStates.LOGGED_OUT});
        if (uiLogggedIn) {
            var logoutIfNeeded = function () {
                if (loginInProgress) {
                    setTimeout(logoutIfNeeded, 1000);
                } else if (!isLoggedIn) {
                    uiLogggedIn = false;
                    Zergling.externalCallback({loggedIn: Zergling.loginStates.LOGGED_OUT});
                    waitForLogin = null;
                }
            };
            if (!waitForLogin) {
                waitForLogin = setTimeout(logoutIfNeeded, 4000);
            }
        }
    }

    /**
     * @description
     * Extracts diffs from data and applies to subscribers data
     * then passes updated data to callback func, specified by subscriber
     *
     * @param {Object} data received subscription data
     */
    function updateSubscribers (data) {

        for (var subId in data.data) {
            if (!data.data.hasOwnProperty(subId)) continue;
            var subDataDiff = data.data[subId];

            var subscription = subscriptions[subId];
            if (undefined !== subscription && undefined !== subscription.callback) {
                destructivelyUpdateObject(subscription.data, {data: subDataDiff}); //
                subscription.callback(subscription.data.data);
            } else if (subscriptions[subId] === undefined) {
                console.log('got update for unknown subscription', subId, 'trying to unsubscribe');
                Zergling.unsubscribe(subId).catch((ex) => console.warn("cannot unsubscribe " + ex));
            }
        }
    }

    /**
     * @description
     * Handle subscription data
     *
     * @param {Object} response response
     */
    function handleSubscriptionResponse (response) {
        var code = response.data.code;
        code = code === undefined ? response.data.data.code : code;
        if (code === Zergling.codes.OK) {        //everything is ok
            updateSubscribers(response.data);
        } else if (code === Zergling.codes.SESSION_LOST && !sessionRequestIsInProgress) {
            Zergling.externalCallback({loggedIn: Zergling.loginStates.LOGGED_OUT});
            delayedLogoutIfNotRestored();

            session = null;
            resubscribe();
        } else {                              // unknown error
            // console.debug(response);
        }
    }

    /**
     * @description Get or create session
     * @returns {Object} session promise
     */
    function getSession () {
        var result;
        if (!session) {
            session = {};
            session.promise = new Promise((resolve, reject) => {
                session.resolve = resolve;
                session.reject = reject;
            });
            result = session.promise;

            var sessionRequestCmd = {
                'command': "request_session",
                'params': {'language': getLanguageCode(Config.env.lang), 'site_id': Config.main.site_id}
            };
            if (Config.swarm.sendSourceInRequestSession && Config.main.source !== undefined) {
                sessionRequestCmd.params.source = Config.main.source;
            }
            if (Config.swarm.sendTerminalIdlInRequestSession && Config.main.terminalId !== undefined) {
                sessionRequestCmd.params.terminal = Config.main.terminalId;
            }
            sessionRequestIsInProgress = true;

            var processSessionResponse = function (response) {
                sessionRequestIsInProgress = false;
                if (response.data.data && response.data.data.sid) {
                    session.resolve(response.data.data.sid);
//                    Storage.set('sessionid', response.data.data.sid, Config.swarm.sessionLifetime);
                    Zergling.externalCallback({hasSession: true});
                    if (isLoggedIn) {
                        isLoggedIn = false;
                        Zergling.login(null).then(resubscribe);
                    } else {
                        resubscribe();
                    }
                    result = session.promise;
                } else {
                    session = null;
                    console.warn('got invalid response to request_session , sid not present', JSON.stringify(response));
                    result = Promise.reject(response);
                }
                return result;
            };

            if (useWebSocket) {
                console.debug('requesting new session (WS)');
                result = WS.sendRequest(sessionRequestCmd).then(processSessionResponse);
            } else {
                console.debug('requesting new session (LP)');
                fetch(getLongPollUrl(), {method: 'POST', body: JSON.stringify(sessionRequestCmd)})
                    .then(checkStatus).then(parseJSON)
                    .then(function (json) {
                        result = processSessionResponse({data: json});
                    })
                    .catch(function (ex) {
                        session = null;
                        result = Promise.reject(ex);
                    });
            }
            return result;

        } else {
            result = session.promise;
        }

        return result;
    }

    /**
     * @description
     * Used only in long-polling mode to get subscription data
     */
    function whatsUp () {

        if (session) {
            getSession()
                .then(function (sessionId) {
                    var data = {'command': 'whats_up'};
                    var headers = {'swarm-session': sessionId};
                    return fetch(getLongPollUrl(), {method: "POST", body: JSON.stringify(data), headers: headers})
                        .then(checkStatus).then(parseJSON);
                })
                .then(function (response) {
                    handleSubscriptionResponse(response);
                    setTimeout(whatsUp, 500);
                })
                .catch(function (reason) {
                    console.warn(reason);
                    if (reason.status === 404) {
                        session = null;
                    }
                    setTimeout(whatsUp, 5000);
                });
        } else {
            setTimeout(whatsUp, 1000);
        }

    }

    /**
     * @description
     * Initializes connection(determines if Zergling will use Websocket or long-polling)
     */
    Zergling.init = function init (callback = function () {
    }) {
        console.log("%c     .\"\".    .\"\",\n     |  |   /  / \n     |  |  /  /  \n     |  | /  /   \n     |  |/  ;-._ \n     }  ` _/  / ;\n     |  /` ) / /\n     | /  /_/_/\\\n     |/  /      |\n     (  ' \\ '-  |\n      \\    `.  / \n       |      |  \n       |      |  \n       init", "color: red; font-weight: bold; font-family:monospace;", WS.isAvailable);
        if (!Zergling.externalCallback) {
            Zergling.externalCallback = callback;
        }
        if (Config.swarm.useWebSocket && WS.isAvailable) {
            console.debug("Config.swarm.useWebSocket", Config.swarm.useWebSocket, Config.swarm);
            WS.addSubscriptionListener(handleSubscriptionResponse);
            WS.onNotAvailable(function () { // socket has gone away and won't reconnect (WS.isAvailable is already false)
                Zergling.init();
                resubscribe();
                Zergling.externalCallback({connected: false, useWebSocket: false});
            });

            WS.setOnCloseCallback(function () {
                //connection lost, but there's still hope to reconnect
                // if (!sessionRequestIsInProgress) {
                session = null;
                // }
                WS.onConnect(getSession);
                Zergling.externalCallback({connected: false, useWebSocket: true});
                delayedLogoutIfNotRestored();
            });

            WS.onConnect(function () {
                Zergling.externalCallback({connected: true, useWebSocket: true});
            });

            useWebSocket = true;
        } else {
            useWebSocket = false;
            Zergling.externalCallback({connected: false, useWebSocket});
            whatsUp();
        }
    };

    /**
     * @description  Will check if Websocket connection is available, if not, will switch to long polling mode
     * @returns {promise|*|Function} promise
     */
    function ensureWebsocketIsAvailable () {
        connectionAvailable = {};
        connectionAvailable.promise = new Promise((resolve, reject) => {
            connectionAvailable.resolve = resolve;
            connectionAvailable.reject = reject;
        });
        var result = connectionAvailable.promise;
        if (!useWebSocket) {
            connectionAvailable.resolve(true);
        } else {
            result = WS.connect().then(
                function () {
//                    console.log('websocket available');
                    connectionAvailable.resolve(true);
                },
                function () {
                    useWebSocket = false;
                    console.log('Websocket not available', useWebSocket);
                    resubscribe();
                    connectionAvailable.reject(false);
                    return connectionAvailable.promise;
                }
            );
        }
        return result;

    }

    /**
     * @description Sends request to swarm using websocket or long-polling
     * @param {Object} data request data
     * @returns {Object} promise
     */
    function sendRequest (data) {
        if (useWebSocket && WS.isAvailable) {
            return ensureWebsocketIsAvailable().then(
                function () {
                    return getSession().then(
                        function () {
                            //console.log('sending request (WS) ', session_id, JSON.stringify(data));
                            return WS.sendRequest(data);
                        },
                        function (reason) {
                            console.error("cannot get session and don't know what to do now :(", reason);
                            return Promise.reject(reason);
                        }
                    );
                },
                function () {
                    //send request again if connection wasn't available (it'll be switched to long poll already)
                    return sendRequest(data);
                }
            );
        } else {
            console.debug('sending request (LP)');
            if (useWebSocket) {
                Zergling.init();
            }
            return getSession()
                .then(function (sessionId) {
                    var headers = {'swarm-session': sessionId};
                    return fetch(getLongPollUrl(), {method: "POST", body: JSON.stringify(data), headers: headers})
                        .then(checkStatus).then(parseJSON);
                });
        }
    }

    /**
     * @description setter for authData
     *
     * @param {Object} data auth data (object with user_id, auth_token keys)
     */
    Zergling.setAuthData = function setAuthData (data) {
        authData = data;
    };

    /**
     * @description logs in. Depending on user object's available fields the corresponding login command will be called
     *
     * @param {Object|null} user user object.
     * @param {Boolean} remember whether to remember auth data for a long time(default is off)
     * @param {Object} additionalParams additional parameters to pass to command (key-value map), e.g. {foo: "bar"}
     * @returns {promise} promise
     */
    Zergling.login = function login (user, remember = null, additionalParams = null) {
        var data;
        if (user === null && authData !== undefined) {
            data = {
                'command': 'restore_login',
                'params': {'user_id': authData.user_id, 'auth_token': authData.auth_token}
            };
        } else if (user.auth_token) {
            data = {'command': 'restore_login', 'params': {'user_id': user.user_id, 'auth_token': user.auth_token}};
        } else if (user.facebook) {
            data = {'command': 'facebook_login', 'params': {'access_token': user.access_token}};
        } else if (user.odnoklassniki) {
            data = {
                'command': 'ok_login',
                'params': {'access_token': user.accessToken, session_secret_key: user.sessionSecretKey}
            };
        } else {
            data = {'command': 'login', 'params': {'username': user.username, 'password': user.password}};
        }

        Zergling.externalCallback({loggedIn: Zergling.loginStates.IN_PROGRESS});
        loginInProgress = true;

        if (additionalParams) {

            for (var paramName in additionalParams) {
                if (!additionalParams.hasOwnProperty(paramName)) continue;
                data.params[paramName] = additionalParams[paramName];
            }
        }

        return sendRequest(data)
            .then(function (response) {
                if (response.data.code === Zergling.codes.OK) {
                    console.debug('zergling got login response', response);
                    isLoggedIn = true;

                    if (user && response.data.data.auth_token) {
                        authData = {
                            auth_token: response.data.data.auth_token,
                            user_id: response.data.data.user_id,
                            never_expires: remember || undefined
                        };
                        if (user && user.username) {
                            authData.login = user.username;
                        }
                    }
                    Zergling.externalCallback({loggedIn: Zergling.loginStates.LOGGED_IN, authData});
                    Zergling.externalCallback({reallyLoggedIn: Zergling.loginStates.LOGGED_IN});
                    uiLogggedIn = true;
                    loginInProgress = false;
                    return response.data;
                } else {

                    Zergling.externalCallback({loggedIn: Zergling.loginStates.LOGGED_OUT});
                    uiLogggedIn = false;
                    loginInProgress = false;
                    return Promise.reject(response.data);
                }
            })
            .catch(function (reason) {
                if (reason.code === Zergling.codes.SESSION_LOST) { //session lost
                    Zergling.externalCallback({hasSession: false});
                    if (!sessionRequestIsInProgress) {
                        session = null; // this will make next statement request new session
                    }
                    return Zergling.login(user);
                }

                Zergling.externalCallback({loggedIn: Zergling.loginStates.LOGGED_OUT});
                uiLogggedIn = false;
                loginInProgress = false;

                console.log('login fail, code:', reason);
                return Promise.reject(reason);
            });
    };

    /**
     * @description logs out user
     *
     * @returns {promise} promise
     */
    Zergling.logout = function logout () {
        var data = {'command': 'logout', 'params': {}};
        return sendRequest(data)
            .then(function (response) {
                authData = undefined;
                Zergling.externalCallback({loggedIn: Zergling.loginStates.LOGGED_OUT});
                uiLogggedIn = false;
                if (response.data.code === Zergling.codes.OK) {
                    isLoggedIn = false;
                    return response.data;
                } else {
                    return Promise.reject(response.data.code);
                }
            })
            .catch(function (reason) {
                if (reason === Zergling.codes.SESSION_LOST) { //session lost
                    Zergling.externalCallback({hasSession: false});
                    if (!sessionRequestIsInProgress) {
                        session = null; // this will make next statement request new session
                    }
                    return Zergling.logout();
                }
                authData = undefined; //clear anyway
                console.log('logout fail, code:', reason);
                return Promise.reject(reason);
            });

    };

    /**
     * @description Just get data without subscribing
     * @param {Object} request request object
     * @param {String} [command] optional.  default is 'get'
     * @returns {promise} promise that will be resolved with data from swarm
     */
    Zergling.get = function get (request, command = "get") {
        var data = {'command': command, 'params': request};
        return sendRequest(data)
            .then(function (response) {
                if (response.data.code === Zergling.codes.OK) {
                    return response.data.data;
                } else {
                    return Promise.reject(response.data);
                }
            })
            .catch(function (reason) {
                if (reason.code === Zergling.codes.SESSION_LOST) { //session lost
                    delayedLogoutIfNotRestored();

                    Zergling.externalCallback({hasSession: false});
                    if (!sessionRequestIsInProgress) {
                        session = null; // this will make next statement request new session
                    }
                    return Zergling.get(request, command);
                }
                if (reason === Zergling.codes.NEED_TO_LOGIN) {
                    delayedLogoutIfNotRestored();

                    return Zergling.login(null).then(function () {
                        return Zergling.get(request, command);
                    });
                }
                console.log('get fail:', reason);
                return Promise.reject(reason);
            });
    };

    /**
     * @description  Subscribes to request
     * @param {Object}   request  request to subscribe to
     * @param {function} onUpdate callback function that will receive the updates(full data, not the diff)
     * @returns {Promise} promise that will be resolved with received data (initial)
     */
    Zergling.subscribe = function subscribe (request, onUpdate) {
        request.subscribe = true;
        var data = {'command': 'get', 'params': request};
        // console.debug('subscribing', JSON.stringify(request));
        return sendRequest(data)
            .then(function (response) {
                if (response.data.code === Zergling.codes.OK && response.data.data.subid) {
                    subscriptions[response.data.data.subid] = {
                        'request': request,
                        'callback': onUpdate,
                        'data': response.data.data || {}
                    };
                } else {
                    return Promise.reject(response.data.code);
                }

                return response.data.data;
            })
            .catch(function (reason) {
                if (reason === Zergling.codes.SESSION_LOST) { //session lost
                    Zergling.externalCallback({hasSession: false});
                    if (!sessionRequestIsInProgress) {
                        session = null; // this will make next statement request new session
                    }
                    return Zergling.subscribe(request, onUpdate);
                }
                if (reason === Zergling.codes.NEED_TO_LOGIN) {
                    delayedLogoutIfNotRestored();

                    return Zergling.login(null).then(function () {
                        return Zergling.subscribe(request, onUpdate);
                    });
                }
                console.log('subscribe fail, code:', reason);
                return Promise.reject(reason);
            });
    };

    /**
     * @description Unsubscribe from subscription specified by subId
     * @param {string} subId to unsubscribe from subscription id
     * @returns {Promise} promise
     */
    Zergling.unsubscribe = function unsubscribe (subId) {
        // console.debug('unsubscribing', subId);
        if (subId === undefined) {
            console.warn("zergling unsubscribe got undefined subscription id");
            return Promise.reject();
        }
        var data,
            successFn,
            errorFn,
            responses = [];

        successFn = function (response) {
            if (response.data.code === Zergling.codes.OK) {
                //delete subscriptions[subId];
                // console.debug(subId, ' unsubscribe ok');
            } else {
                return Promise.reject(response.data.code);
            }

        };
        errorFn = function (reason) {
            if (reason === Zergling.codes.SESSION_LOST) { //session lost
                Zergling.externalCallback({hasSession: false});
                if (!sessionRequestIsInProgress) {
                    session = null; // this will make next statement request new session
                }
                return Zergling.unsubscribe(subId);
            }
            console.log('unsubscribe fail, code:', reason);
            delete subscriptions[subId]; //delete subscription array entry(incl. callback) anyway
            return Promise.reject(reason);
        };

        if (Array.isArray(subId)) {
            subId.forEach(function (id) {
                delete subscriptions[id];
                data = {'command': 'unsubscribe', 'params': {subid: id.toString()}};
                responses.push(sendRequest(data).then(successFn).catch(errorFn));
            });
        } else {
            delete subscriptions[subId];
            data = {'command': 'unsubscribe', 'params': {subid: subId.toString()}};
            responses.push(sendRequest(data).then(successFn).catch(errorFn));
        }
        return Promise.all(responses);
    };

    return Zergling;

})(WS, Config);

export default Zergling;