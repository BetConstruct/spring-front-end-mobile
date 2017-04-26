/**
 * @name loggedIn
 * @description check user authorization
 * @param {Object} state current state of store
 * @returns {boolean} user authorization state
 * */
const loggedIn = (state) => {
    return !!state.user.reallyLoggedIn;
};

/**
 * @name requireAuth
 * @description helper function to add listener on route
 * @param {Object} store
 * @returns {function} the handler function
 * */
export const requireAuth = (store) => {
    return (nextRoute, replace) => {
        let state = store.getState();
        if (!loggedIn(state)) {
            replace({
                pathname: state.routing.locationBeforeTransitions.pathname !== nextRoute.location.pathname ? state.routing.locationBeforeTransitions.pathname : '/'
            });
        }
    };
};
