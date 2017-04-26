import Config from "../config/main";
import Helpers from "./helperFunctions";

var WS = (function (SwarmConfig) {
    var statistics = {}, statisticsSubIdMap = {},
        socket = {}, WS = {}, callbacks = {}, callbackIdCounter = 0, retryCount = 0,
        connected = false,
        connection, result, selectedSwarmInstance,
        onConnectCallbacks = [], subscriptionListeners = [],
        onClose = null, onNotAvailableCallback = null,

    // indicates that client was able to make websocket connection (will try to
        wasAbleToConnect = false;  // use websockets(reconnect) instead of switching to LP when disconnected)

    WS.isAvailable = (typeof WebSocket === 'function' || typeof WebSocket === 'object');

    /**
     * @name error
     * @description  reset connection state in case of error
     */
    function error () {
        connected = false;
        socket.close();
        console.error('error');
    }

    /**
     * @name open
     * @description  change connection state to open and call all onConnectCallbacks functions.
     */
    function open () {
        connected = true;
        connection.resolve(true);
        selectedSwarmInstance.instanceRetryCount = 0;
        // network configuration isn't preventing client from using this instance, will try to reconnect if disconnected
        selectedSwarmInstance.wasAbleToConnectPreviously = true;

        wasAbleToConnect = true;
        retryCount = 0;
        console.log("Socket has been opened");

        onConnectCallbacks.forEach(function (callback) {
            callback();
        });
    }

    /**
     * @name receiveParseJSON
     * @description  Try to parse websocket response.
     * @param {Object} message
     * @returns {Object|null}
     */
    function receiveParseJSON (message) {
        // cannot by optimized by JIT, keep in separate function
        try {
            //console.log('receive data', message.data.length);
            return JSON.parse(message.data);
        } catch (e) {
            console.warn('cannot parse websocket response:', message.data, e);
            return null;
        }
    }
    /**
     * @name sendToCallbacks
     * @description  Send data to callback
     * @param {*} data
     * @param {Function} callback
     * @returns {*}
     */
    function sendToCallbacks (data, callback) {
        callback(data);
        return data;
    }

    /**
     * @name receive
     * @description  Process received data.
     * @param {Object} message
     */
    function receive (message) {
        var data = receiveParseJSON(message);
        if (data === null) {
            return;
        }

        if (data.rid && callbacks.hasOwnProperty(data.rid)) { //message response
            if (SwarmConfig.debugging) {
                if (data && data.data && data.data.subid) {
                    statistics[data.rid].receiveTs = new Date().getTime();
                    statistics[data.rid].receive = message.data.length;
                    statisticsSubIdMap[data.data.subid] = data.rid;
                }
            }

            callbacks[data.rid].cb.resolve({data: data}); // extra 'data' is used to make structure same as returned by $http.post
//            console.log('response time:', (new Date() - callbacks[data.rid].time) / 1000, 'sec');
            delete callbacks[data.rid];
        } else if (data.data && parseInt(data.rid, 10) === 0) { //subscription update
            if (SwarmConfig.debugging) {
                Object.keys(data.data).forEach(function (subId) {
                    var updateTextLength = JSON.stringify(data.data[subId]).length;
                    var rid = statisticsSubIdMap[subId];
                    statistics[rid].updates += updateTextLength;
                });
            }
            subscriptionListeners.reduce(sendToCallbacks, {data: data});
        } else if (data.rid) {
            console.warn('Got second response for request or invalid rid:', message.data);
        } else {
            console.warn('Got response without rid:', message.data);
        }
    }
    /**
     * @name getConnection
     * @description  Try to open new socket or reconnect if socket connection will lost.
     * @returns {promise} promise
     */
    function getConnection () {

        if (!connection) {

            connected = false;
            connection = {};
            connection.promise = new Promise((resolve, reject) => {
                connection.resolve = resolve;
                connection.reject = reject;
            });
            result = connection.promise;

            var giveUp = function () {
                console.log("Giving up. Websockets are not available.");
                connection.reject('websocket error');
                WS.isAvailable = false;
                if (onNotAvailableCallback) {
                    console.log('WS calling onNotAvailableCallback callback');
                    onNotAvailableCallback();
                }
            };

            try {
                selectedSwarmInstance = Helpers.getWeightedRandom(SwarmConfig.websocket);
                console.log('websocketUrl selected:', selectedSwarmInstance);
                socket = new WebSocket(selectedSwarmInstance.url);

                setTimeout(function () {
                    if (!connected) {
                        socket.close();
                    }  //close 'pending' connection after timeout
                }, SwarmConfig.webSocketTimeout);

                console.log('Socket created:', socket);
            } catch (e) {
                console.log('Error creating socket', e, selectedSwarmInstance);
                if (!selectedSwarmInstance) {
                    giveUp();
                }
            }

            socket.onclose = function (event) {

                connected = false;
                console.log('socket closed', event, callbacks, retryCount);

                //fix for FF bug #765738
                if (event.code === 1001) { //1001 means "The endpoint is going away, either because of a server failure or because the browser is navigating away from the page that opened the connection."
                    console.log("tab closed or refreshed, won't call onClose handlers", event);
                    socket.close();
                    return;
                }

                if (onClose) {
                    console.log('WS calling onClose callback');
                    onClose();
                }
                if (retryCount < SwarmConfig.maxWebsocketRetries || wasAbleToConnect) {
                    WS.isAvailable = true;
                    connection = null;
                    retryCount++;
                    selectedSwarmInstance.instanceRetryCount = selectedSwarmInstance.instanceRetryCount || 0;
                    if (selectedSwarmInstance.instanceRetryCount++ > 0 && !selectedSwarmInstance.wasAbleToConnectPreviously) {
                        selectedSwarmInstance.ignore = true; // will not select this swarm instance again
                    }
                    console.log('retry count', retryCount, 'retrying in ', SwarmConfig.webSocketRetryInterval * retryCount, 'msec', selectedSwarmInstance);
                    return setTimeout(getConnection, SwarmConfig.webSocketRetryInterval * retryCount);

                } else {
                    giveUp();
                }
            };

            socket.onerror = error;

            socket.onmessage = receive;
            socket.onopen = open;
        } else {
            result = connection.promise;
        }
        return result;
    }

    /**
     * @name getCallbackId
     * @description  generate callback Ids.
     * @returns {String} callbackId
     */
    function getCallbackId () {
        callbackIdCounter += 1;
        if (callbackIdCounter > 100000) {
            callbackIdCounter = 0;
        }
        return new Date().getTime() + callbackIdCounter.toString();
    }

    /**
     * @name dumpWSStatistics
     * @description Collect Websocket statistics
     */
    window.dumpWSStatistics = function () {
        var nowTs = parseInt(new Date().getTime() / 1000, 10);
        for (var key in statistics) {
            if (statistics.hasOwnProperty(key)) {
                var obj = statistics[key];
                obj.requestRTT = parseInt(obj.receiveTs - obj.sentTs, 10);
                obj.updateTime = nowTs - parseInt(obj.receiveTs / 1000, 10);
                console.log('req %s sent %s received %s (rtt %s ms) updates %s (in %s sec, avg %d b/sec) %s', key, obj.sent, obj.receive, obj.requestRTT, obj.updates, obj.updateTime, obj.updates / obj.updateTime, obj.unsubscribed ? "ENDED" : "");
            }
        }
        console.log(statistics);
    };

    /**
     * @description Sends request to websocket
     * @param {Object} request request object
     * @returns {promise|*|Function} promise
     */
    WS.sendRequest = function sendRequest (request) {
//        console.log('WS.sendRequest', request);
        return getConnection()
            .then(
                function () {
                    var defer = {};
                    defer.promise = new Promise((resolve, reject) => {
                        defer.resolve = resolve;
                        defer.reject = reject;
                    });
                    var callbackId = getCallbackId();
                    callbacks[callbackId] = {
                        time: new Date(),
                        cb: defer
                    };
                    request.rid = callbackId;
                    //                console.log('Sending to socket:', request, connected);
                    var sendingDataText = JSON.stringify(request);
                    if (SwarmConfig.debugging) {
                        if (request.command === 'unsubscribe') {
                            var rid = statisticsSubIdMap[request.params.subid];
                            statistics[rid].unsubscribed = true;
                            statistics[rid].sent += sendingDataText.length;
                        } else {
                            statistics[callbackId] = {
                                request: sendingDataText,
                                sent: sendingDataText.length,
                                receive: 0,
                                subId: null,
                                updates: 0,
                                sentTs: new Date().getTime(),
                                unsubscribed: false
                            };
                        }
                    }
                    socket.send(sendingDataText);
                    return defer.promise;
                },
                function () {
                    return Promise.reject('websocket connection not available');
                }
            ).catch(function (reason) {
                console.warn(reason);
                return Promise.reject(reason);
            });

    };

    /**
     * @description Adds a func to be called when getting subscribed data
     * @param {function} callback function that will be called on getting subscription data
     */
    WS.addSubscriptionListener = function addSubscriptionListener (callback) {
        subscriptionListeners.push(callback);
    };

    /**
     * @description Adds a function to be called on (re)connection (after connection is established)
     *
     * @param {function} callback func. to be called
     */
    WS.onConnect = function onConnect (callback) {
        if (onConnectCallbacks.indexOf(callback) == -1) {
            onConnectCallbacks.push(callback);
        }
    };

    /**
     * @description returns connection promise
     * @returns {promise} promise
     */
    WS.connect = function connect () {
        return getConnection();
    };

    /**
     * @description sets callback function which will be called when websocket connection is closed (unexpectedly)
     */
    WS.setOnCloseCallback = function setOnCloseCallback (callback) {
        onClose = callback;
    };

    WS.onNotAvailable = function onNotAvailable (callback) {
        onNotAvailableCallback = callback;
    };
    return WS;
})(Config.swarm);

export default WS;