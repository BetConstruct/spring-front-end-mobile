/**
 * This is a mock for Zergling
 * commandResponses contains handlers (key is command name) which receive request and type of result they
 * should return (true for success, false for failure)
 */

const commandResponses = {
    forgot_password (request, success) {
        return success
            ? {result: 0}
            : {result: -1};
    },
    update_user_password (request, success) {
        return success
            ? {result: 0}
            : {result: -1};
    }
};

const Zergling = {
    responseWillBeSucccessFull: true,
    lastRequest: null,
    /**
     * Defines what kind of response next request will get (success or failure)
     * @param success
     */
    setNextResponseType (success) {
        this.responseWillBeSucccessFull = success;
    },
    /**
     * Returns last request that zergling has received by calling get, login, subscribe, unsubscribe, etc.
     * Needed for testing if async action creators are issuing correct commands
     * @returns {*}
     */
    getLastRequest () {
        return this.lastRequest;
    },
    /**
     * Mock for Zergling's get method
     */
    get (request, command) {
        // console.log("Zergling.get", request, command, this.responseWillBeSucccessFull);
        this.lastRequest = {command, params: request};
        var handler = commandResponses[command] || (() => { throw new Error(`No handler for ${command} command`); });
        return this.responseWillBeSucccessFull
            ? Promise.resolve(handler(request, true))
            : Promise.reject(handler(request, false));
    }
};

export default Zergling;