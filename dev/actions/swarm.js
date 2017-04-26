import {
    SWARM_LOADING_START, SWARM_LOADING_DONE, SWARM_DATA_RECEIVED, SWARM_UPDATE_RECEIVED, SWARM_CLEAR_DATA,
    CONNECTED, DISCONNECTED, SESSION_LOST, SESSION_ACTIVE} from './actionTypes/';

/**
 * @name SwarmLoadingStart
 * @description sync action creator function to store loading state.
 * @param {String} key specified key to access the data
 * @returns {Object}
 */
export const SwarmLoadingStart = (key) => {
    /**
     * @event swarmLoadingStart
     */
    return {
        type: SWARM_LOADING_START,
        key
    };
};

/**
 * @name SwarmLoadingDone
 * @description sync action creator function to store loading state.
 * @param {String} key specified key to access the data
 * @returns {Object}
 */
export const SwarmLoadingDone = (key) => {
    /**
     * @event swarmLoadingDone
     */
    return {
        type: SWARM_LOADING_DONE,
        key
    };
};

/**
 * @name SwarmReceiveData
 * @description sync action creator function to store response.
 * @param {Object} message what we receive as a response
 * @param {String} key specified key to access the data
 * @returns {Object}
 */
export const SwarmReceiveData = (message, key) => {
    /**
     * @event swarmReceiveData
     */
    return {
        type: SWARM_DATA_RECEIVED,
        payload: message,
        key
    };
};

/**
 * @name SwarmClearData
 * @description sync action creator function to clear data from redux store.
 * @param {String} key specified key to access the data
 * @returns {Object}
 */
export const SwarmClearData = (key) => {
    /**
     * @event swarmClearData
     */
    return {
        type: SWARM_CLEAR_DATA,
        key
    };
};

/**
 * @name ReceiveUpdate
 * @description sync action creator function to update the data in redux store.
 * @param {Object} message what we receive as a update
 * @param {String} key specified key to access the data
 * @returns {Object}
 */
export const ReceiveUpdate = (message, key) => {
    /**
     * @event receiveUpdate
     */
    return {
        type: SWARM_UPDATE_RECEIVED,
        payload: message,
        key
    };
};

/**
 * @name Connected
 * @description sync action creator function to store #Websockets connection state.
 * @param {Object} message redux store
 * @returns {Object}
 */
export const Connected = (message) => {
    /**
     * @event connected
     */
    return {
        type: CONNECTED,
        payload: message
    };
};

/**
 * @name Disconnected
 * @description sync action creator function to store #Websockets connection state.
 * @param {Object} message redux store
 * @returns {Object}
 */
export const Disconnected = (message) => {
    /**
     * @event disconnected
     */
    return {
        type: DISCONNECTED,
        payload: message
    };
};

/**
 * @name SessionLost
 * @description sync action creator function to store client session status
 * @param {Object} message redux store
 * @returns {Object}
 */
export const SessionLost = (message) => {
    /**
     * @event sessionLost
     */
    return {
        type: SESSION_LOST,
        payload: message
    };
};

/**
 * @name SessionActive
 * @description sync action creator function to store client session status
 * @param {Object} message redux store
 * @returns {Object}
 */
export const SessionActive = (message) => {
    /**
     * @event sessionActive
     */
    return {
        type: SESSION_ACTIVE,
        payload: message
    };
};
