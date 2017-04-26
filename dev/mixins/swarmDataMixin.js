import React from 'react';
import Zergling from '../helpers/zergling';
import {digest} from 'json-hash';
import {SwarmLoadingStart, SwarmLoadingDone, SwarmReceiveData, ReceiveUpdate, SwarmClearData} from '../actions/swarm';

/**
 * SwarmDataMixin is a HOC(Higher Order Component) which adds possibility to
 * load/unload data from swarm on component mount/unmount
 * To enable the functionality component should be "wrapped" by SwarmDataMixin, i.e. you should use
 * SwarmDataMixin({Component: YourComponent}) instead of just YourComponent.
 *
 * Depending on properties that composed component has corresponding data request/subscription to swarm will be made.
 *
 * Option 1 - one-time data request:
 * for just getting some initial data, component should have the following properties:
 *      swarmInitialDataRequest - the request object to query swarm for data.
 *      swarmInitialDataRequestCommand - initial data request command (default is "get")
 *      swarmDataKey - [optional] the key to keep the received data under in store. If not provided a hash of request/command will be used as key
 *
 * Option 2 - subscription:
 * in this case a subscription will be made, so when data changes, it will be updated in store.
 * On component unmount an unsubscribe request will be sent to swarm to stop getting updates.
 * for subscribing component should have the following properties:
 *      swarmSubscriptionRequest - the request object to query swarm for data.
 *      swarmDataKey - [optional] the key to keep the received data under in store. If not provided a hash of request will be used as key
 *      keepDataAfterUnsubscribe - [optional]. If true, data will be kept in store after unsubscribing
 *
 * the loaded data can be used in wrapped component by getting it from store.swarmData.data[this.props.swarmDataKey]
 *
 * additionally, composed component will get a "resubscribe" method which can be called to unsubscribe(if subscribed)
 * and make the initial request again. It has an optional boolean argument "keepDataInStore". If set to true, component
 * subscription data in store won't be cleared before making the new request.
 *
 * @param {Object} ComposedComponent  The composed component object can have the following fields:
 *                  "Component" field - required. value is the component to be wrapped.
 *                  "ComponentWillMount" field - optional. composed component's "ComponentWillMount" method.
 *                  "ComponentWillReceiveProps" field - optional. composed component's "ComponentWillReceiveProps" method.
 * @constructor
 */
export var SwarmDataMixin = ComposedComponent => class extends React.Component {
    constructor (props) {
        super(props);
        this.state = ComposedComponent.InitialState || {};

        if (ComposedComponent.ComponentWillMount) {
            this.componentWillMount = ComposedComponent.ComponentWillMount;
        }

        if (ComposedComponent.ComponentWillReceiveProps) {
            this.componentWillReceiveProps = ComposedComponent.ComponentWillReceiveProps;
        }
        this.subscriptionPromise = Promise.resolve();
    }

    _subscribe () {
        this.subscriptions = [];
        if (this.swarmSubscriptionRequest) {
            this.swarmDataKey = this.swarmDataKey || `${getSwarmDataKeyForRequest(this.swarmSubscriptionRequest)}${this.uidPostFix ? this.uidPostFix : ''}`;
            this.subscriptionPromise = new Promise((resolve, reject) => {
                // eslint-disable-next-line react/prop-types
                this.props.dispatch(SwarmLoadingStart(this.swarmDataKey));
                Zergling.subscribe(
                    this.swarmSubscriptionRequest,
                    function (response) {
                        // console.debug("swarm update:", response);
                        this.props.dispatch(ReceiveUpdate(response, this.swarmDataKey)); //eslint-disable-line react/prop-types
                    }.bind(this)
                ).then(
                    function (response) {
                        console.debug("swarm response:", response);
                        resolve();
                        // eslint-disable-next-line react/prop-types
                        this.props.dispatch(SwarmLoadingDone(this.swarmDataKey));
                        if (typeof this.initialLoadCallback === "function") {
                            this.initialLoadCallback(response.data);
                        }
                        // eslint-disable-next-line react/prop-types
                        this.props.dispatch(SwarmReceiveData(response.data, this.swarmDataKey));
                        this.subscriptions.push(response.subid);
                    }.bind(this)
                ).catch(
                    function (ex) {
                        console.debug("swarm exception:", ex);
                        reject();
                        this.props.dispatch(SwarmLoadingDone(this.swarmDataKey)); //eslint-disable-line react/prop-types
                    }.bind(this)
                );
            });
        } else if (this.swarmInitialDataRequest) {  // just load some initial data
            let command = this.swarmInitialDataRequestCommand || "get";
            this.swarmDataKey = this.swarmDataKey || (command + digest(this.swarmInitialDataRequest));
            // eslint-disable-next-line react/prop-types
            this.props.dispatch(SwarmLoadingStart(this.swarmDataKey));
            Zergling.get(this.swarmInitialDataRequest, command).then(
                function (response) {
                    console.debug("swarm response:", response);
                    this.props.dispatch(SwarmLoadingDone(this.swarmDataKey)); // eslint-disable-line react/prop-types
                    this.props.dispatch(SwarmReceiveData(response.data, this.swarmDataKey)); // eslint-disable-line react/prop-types
                }.bind(this)
            ).catch(
                function (ex) {
                    console.debug("swarm exception:", ex);
                    this.props.dispatch(SwarmLoadingDone(this.swarmDataKey)); //eslint-disable-line react/prop-types
                }.bind(this)
            );
        }
    }

    _unsubscribe (keepDataInStore = false) {
        this.unsubscribing = true;
        return this.subscriptionPromise.then().catch().then(() => {
            console.debug("unsubscribing", this.subscriptions);
            if (this.subscriptions.length < 1) {
                console.debug("no subscriptions to unsubscribe");
                this.unsubscribing = false;
                return Promise.resolve();
            }
            return Zergling
                .unsubscribe(this.subscriptions)
                .catch((ex) => console.error("cannot unsubscribe:", ex))
                .then(() => {
                    console.debug("_unsubscribed");
                    keepDataInStore || this.props.dispatch(SwarmClearData(this.swarmDataKey)); //eslint-disable-line react/prop-types
                    this.subscriptions = [];
                    this.unsubscribing = false;
                });
        });
    }

    componentDidMount () {
        this._subscribe();
    }

    componentWillUnmount () {
        this._unsubscribe(this.keepDataAfterUnsubscribe);
    }

    resubscribe (keepDataInStore = false) {
        console.debug("resubscribing", this.subscriptions);
        this._unsubscribe(keepDataInStore).then(this._subscribe.bind(this));
    }

    render () {
        return <ComposedComponent.Component {...this.props} {...this.state} swarmDataKey={this.swarmDataKey}/>;
    }
};

/**
 * Calculate unique hash for giver request object
 * @param {Object} request
 * @returns {String}
 */
export function getSwarmDataKeyForRequest (request) {
    return digest(request);
}