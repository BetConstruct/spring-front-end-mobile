import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {checkIfUserIsLoggedIn} from "../../../mixins/checkAuthentication";
import {LoadBetHistory, ResetLoadedBetHistory} from "../../../actions/betHistory";
import {UIMixin} from '../../../mixins/uiMixin';
import _ from "lodash";
import {GetBetHistoryDataSelector} from "../../../helpers/selectors";
import {SwarmDataMixin} from "../../../mixins/swarmDataMixin";

/**
 * @name getSwarmSubscriptionRequest
 * @description get swarm subscription request by corresponding array
 * @param {Array} arr
 * @returns {object}
 * */
function getSwarmSubscriptionRequest (arr) {
    return {
        "source": "betting",
        "what": {
            "event": ["id", "price"]
        },
        "where": {
            "event": {
                "id": {
                    "@in": arr
                }
            }
        }
    };
}

const History = React.createClass({
    propTypes: {
        filters: PropTypes.object.isRequired,
        route: PropTypes.object.isRequired,
        cashoutData: PropTypes.object.isRequired,
        pathName: PropTypes.string.isRequired,
        user: PropTypes.object.isRequired
    },
    componentWillMount () {
        if (this.props.user.loggedIn) { //eslint-disable-line react/prop-types
            this.load(this.props.route.path); //eslint-disable-line react/prop-types
        }
    },
    componentWillReceiveProps (nextProps) {
        // reload if CashOut is done
        let props = this.props;

        switch (true) {
            case nextProps.cashoutData && nextProps.cashoutData.result && nextProps.cashoutData.result === "Ok" &&
            (!props.cashoutData || props.cashoutData.result !== nextProps.cashoutData.result):
            case this.props.pathName !== nextProps.pathName:
            case props.filters !== nextProps.filters:
            case (this.props.user.loggedIn !== nextProps.user.loggedIn && nextProps.user.loggedIn):
                this.timerId && clearTimeout(this.timerId);
                this.timerId = setTimeout(() => {
                    this.load(nextProps.pathName, _.cloneDeep(nextProps.filters));
                }, 150);
                break;
        }
    },

    /**
     * @name isUnsettled
     * @description checking the status of bets
     * @returns {undefined}
     * */
    isUnsettled () {
        return this.props.route.path === 'open-bets';
    },

    /**
     * @name load
     * @description helper function to load current route options
     * @params {string} routePath
     * @params params
     * @returns {undefined}
     * */
    load (routePath, paramas) {
        let options = paramas || _.cloneDeep(this.props.filters);
        options.from_date && (options.from_date = options.from_date.set({hour: 0, minute: 0, second: 0}).unix());
        options.to_date && (options.to_date = options.to_date.set({hour: 23, minute: 59, second: 59}).unix());

        if (routePath.indexOf("open-bets") !== -1 || routePath.indexOf("bets") !== -1) {
            this.props.dispatch(LoadBetHistory(routePath.indexOf("open-bets") !== -1, options));
        } else if (routePath === "casino") {
            //load casino history
        }
    },

    /**
     * @name resetHistory
     * @description reset loaded bet history
     * @returns {undefined}
     * */
    resetHistory () {
        this.props.dispatch(ResetLoadedBetHistory());
    },
    render () {
        //eslint-disable-next-line react/prop-types
        return checkIfUserIsLoggedIn(this.props.user, this.props.dispatch) || Template.apply(this); //eslint-disable-line no-undef
    }
});

function mapStateToProps (state) {
    return GetBetHistoryDataSelector(state);
}

export default connect(mapStateToProps)(
    SwarmDataMixin({
        Component: UIMixin({Component: History}),
        ComponentWillReceiveProps: function (nextProps) {

            /**
             * @name subscribe
             * @description subscribing to loaded bets
             * @returns {undefined}
             * */
            let subscribe = () => {
                this.uidPostFix = "_CASHOUT_UPDATE_REACIVE";
                if (nextProps.cashOutAbleBetIds.length && nextProps.swarmData.loaded &&
                    (nextProps.pathName.indexOf("open-bets") !== -1 || nextProps.pathName.indexOf("bets") !== -1)) {
                    this.swarmSubscriptionRequest = getSwarmSubscriptionRequest(nextProps.cashOutAbleBetIds);
                    this._subscribe.apply(this);
                }
            };

            if (nextProps.swarmData.bets.length !== this.props.swarmData.bets.length ||
                (nextProps.swarmData.bets.length === this.props.swarmData.bets.length &&
                (nextProps.pathName !== this.props.pathName || nextProps.swarmData.loaded !== this.props.swarmData.loaded))
            ) {
                if (this.subscriptions && this.subscriptions.length && !this.unsubscribing) {
                    this._unsubscribe().then(() => {
                        subscribe();
                    });
                } else if ((!this.subscriptions || this.subscriptions && !this.subscriptions.length) && !this.unsubscribing) {
                    subscribe();
                }
            }
        }
    })
);