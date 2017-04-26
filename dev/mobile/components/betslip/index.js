import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {SwarmDataMixin} from '../../../mixins/swarmDataMixin';
import {UIMixin} from '../../../mixins/uiMixin';
import {UIOpen, UIClose} from "../../../actions/ui";
import Helpers from "../../../helpers/helperFunctions";
import {GetBetslipData} from "../../../helpers/selectors";

import {BetslipClear, BetslipRemove, BetslipSetType, BetslipToggleQuickBet, BetslipAcceptChanges,
    BetslipSetStake, BetslipSetUnitStake, BetslipPlaceBet, BetslipGetEventMaxBet, BetslipSetEachWayMode,
    BetslipSetSystemOpt, BetslipSetAcceptOpt, BetslipSetInclInSysCalc, BetslipResetStatus, BetslipToggleSuperBet,
    BetslipToggleFreeBet, BetslipLoadFreeBets, BetslipSelectFreeBet
} from "../../../actions/betslip";

import {TOGGLE_VIRTUAL_KEYBOARD} from "../../../actions/actionTypes";

import {BETSLIP_TYPE_SINGLE, BETSLIP_TYPE_EXPRESS, BETSLIP_TYPE_SYSTEM, getDivisionCoefficient, superBetWatcher} from "../../../helpers/sport/betslip";

var rounding;

/**
 * @name roundStake
 * @description function rounding stake
 * @param {number} stake
 * @returns {number}
 * */
let roundStake = stake => {
    let factor = Math.pow(10, rounding);
    return Math.round((parseFloat(stake) || 0) * factor) / factor;
};

const Betslip = React.createClass({
    propTypes: {
        user: PropTypes.object,
        betslip: PropTypes.object,
        ui: PropTypes.object
    },

    /**
     * @name scrollBetSlipToElement
     * @description virtual keyboard scroll betslip to element
     * @param {Object} e
     * @returns {undefined}
     * */
    scrollBetSlipToElement (e) {
        let pos = e.clientY,
            offsetHeight = this.refs["betslip-container"].offsetHeight;

        offsetHeight - pos < 85 &&
        setTimeout(() => {
            this.refs["betslip-container"].scrollTop = this.refs["betslip-container"].scrollTop + (85 - (offsetHeight - pos));
        }, 100); // use timeout to scroll after the keyboard is opened
    },

    /**
     * @name placeBet
     * @description place bet function
     * @returns {undefined}
     * */
    placeBet () {
        let freeBet = this.props.user.profile && this.props.user.profile.has_free_bets && this.props.betslip.freeBet; //eslint-disable-line react/prop-types
        this.props.dispatch(BetslipPlaceBet(this.props.betslip, this.props.currency, freeBet));            //eslint-disable-line react/prop-types
    },

    /**
     * @name selectFreeBet
     * @description select free bets in betslip
     * @param id (free bet id)
     * @param amount (free bet amount)
     * @returns {Function} action dipatcher (dispatch bet id and amount)
     * */
    selectFreeBet (id, amount) {
        return () => {
            this.props.dispatch(BetslipSelectFreeBet(id, amount));
        };
    },

    /**
     * @name resetBetslipStatus
     * @description clear betslip notifications
     * @returns {Function} ()
     * */
    resetBetslipStatus () { //clears all notifications
        this.props.dispatch(BetslipResetStatus());
    },

    /**
     * @name acceptChanges
     * @description accept bet changes
     * @returns {undefined}
     * */
    acceptChanges () {
        this.props.dispatch(BetslipAcceptChanges());
    },

    /**
     * @name setAcceptOptions
     * @description event accept option
     * @param {object} event
     * @returns {undefined}
     * */
    setAcceptOptions (event) {
        this.props.dispatch(BetslipSetAcceptOpt(parseInt(event.target.value, 10)));
        this.props.dispatch(UIClose("betslipSettings"));
    },

    /**
     * @name setBetslipType
     * @description function set betslip type
     * @param {object} event
     * @returns {undefined}
     * */
    setBetslipType (event) {
        if (this.props.betslip.acceptPriceChanges === -1 && this.props.betslip.type > BETSLIP_TYPE_EXPRESS) { //eslint-disable-line react/prop-types
            this.props.dispatch(BetslipSetAcceptOpt(0));
        }
        this.props.dispatch(BetslipSetType(parseInt(event.target.value, 10)));
    },

    /**
     * @name toggleEachWayMode
     * @description function toggle each way stake mode
     * @returns {undefined}
     * */
    toggleEachWayMode () {
        this.props.dispatch(BetslipSetEachWayMode(!this.props.betslip.eachWayMode));    //eslint-disable-line react/prop-types
    },

    /**
     * @name includeInSystemCalc
     * @description function which is calculating system bet
     * @param {object} event
     * @returns {Function}
     * */
    includeInSystemCalc (event) {
        return (e) => this.props.dispatch(BetslipSetInclInSysCalc(!event.incInSysCalc, event.eventId));
    },

    /**
     * @name saveQuickBetStake
     * @description save quick bet stake amount
     * @returns {undefined}
     * */
    saveQuickBetStake () {
        let stake = roundStake(this.props.betslip.stake);
        if (stake) {
            this.props.dispatch(BetslipSetStake(stake));
            this.props.dispatch(UIClose("quickBetStake"));
        }
    },

    /**
     * @name openKeyBoard
     * @description open virtual keyboard
     * @param {string} currentValue
     * @param {function} changeHandler
     * @param onOpenCallback
     * @param {object} bet
     * @params e
     * @params onCloseCallback
     * @returns {undefined}
     * */
    openKeyBoard (currentValue, changeHandler, onOpenCallback, bet, e, onCloseCallback) {
        this.setUpKeyboard(currentValue, changeHandler, onOpenCallback, bet, e, onCloseCallback);
    },

    /**
     * @name setUpKeyboard
     * @description function set up virtual keyboard
     * @param {string} currentValue
     * @param {function} changeHandler
     * @param onOpenCallback
     * @param {object} bet
     * @params e
     * @params onCloseCallback
     * @returns {undefined}
     * */
    setUpKeyboard (currentValue, changeHandler, onOpenCallback, bet, e, onCloseCallback) {
        this.keyboardSettings = {
            currentValue,
            changeHandler,
            onOpenCallback,
            onCloseCallback,
            bet,
            e,
            processHandler: (stake) => parseFloat(stake).toString() === stake ? roundStake(stake) : stake,
            offset: e.target.offsetTop
        };
        setTimeout(() => {
            this.props.dispatch({type: TOGGLE_VIRTUAL_KEYBOARD, payload: true});
        });
    },

    /**
     * @name hideKeyboard
     * @description hide virutal keyboard
     * @returns action dispatcher
     * */
    hideKeyboard () {
        delete this.keyboardSettings;
        return this.props.dispatch({type: TOGGLE_VIRTUAL_KEYBOARD, payload: false });
    },

    /**
     * @name setStake
     * @description function set stake
     * @param event (default value null)
     * @returns {Function} action dispatcher
     * */
    setStake (event = null) {
        return (stake) => {
            stake = parseFloat(stake).toString() === stake ? roundStake(stake) : stake;
            if (event && this.props.betslip.type === BETSLIP_TYPE_SINGLE && this.props.betslip.eachWayMode) { //eslint-disable-line react/prop-types
                this.props.dispatch(BetslipSetUnitStake((stake / 2), event.eventId));
            }
            this.props.dispatch(BetslipSetStake(stake, event ? event.eventId : null));
            //eslint-disable-next-line react/prop-types
            this.props.dispatch(BetslipSetUnitStake(roundStake((parseFloat(stake) || 0) / getDivisionCoefficient(this.props.betslip))));
        };
    },

    /**
     * @name setQuickBetStake
     * @description set quick bet
     * @param stake
     * @returns {undefined}
     * */
    setQuickBetStake (stake) {
        this.props.dispatch(BetslipSetStake(stake));
    },

    /**
     * @name setUnitStake
     * @description function set unit stake
     * @param event (default value null)
     * @returns {Function}
     * */
    setUnitStake (event = null) {
        return (stake) => {
            var unitStake = parseFloat(stake).toString() === stake ? roundStake(stake) : stake;
            if (event && this.props.betslip.type === BETSLIP_TYPE_SINGLE && this.props.betslip.eachWayMode) { //eslint-disable-line react/prop-types
                this.props.dispatch(BetslipSetStake(roundStake(unitStake * 2), event.eventId));
            }
            this.props.dispatch(BetslipSetUnitStake(unitStake, event ? event.eventId : null));
            //eslint-disable-next-line react/prop-types
            this.props.dispatch(BetslipSetStake(roundStake(getDivisionCoefficient(this.props.betslip) * (parseFloat(unitStake) || 0))));
        };
    },

    /**
     * @name setSameStakeOnOtherEvents
     * @description helper function for passing stake amount to other events
     * @param {object} bet event
     * @returns {Function}
     * */
    setSameStakeOnOtherEvents (bet) {
        return () => {
            Object.keys(this.props.betslip.events).map(id => { //eslint-disable-line react/prop-types
                this.props.dispatch(BetslipSetStake(roundStake(bet.singleStake), id));
                this.props.dispatch(BetslipSetUnitStake(roundStake(bet.singleStake / 2), id));
            });
        };
    },

    /**
     * @anme getMaxStake
     * @description helper function to get event max bet amount
     * @param {object} event
     * @returns {Function}
     * */
    getMaxStake (events) {
        return () => this.props.dispatch(BetslipGetEventMaxBet(events));
    },

    /**
     * @name toggleBetslipSettings
     * @description betslip setting toggle function
     * @returns {undefined}
     * */
    toggleBetslipSettings () {
        if (this.props.ui.opened.betslipSettings) {                         //eslint-disable-line react/prop-types
            this.props.dispatch(UIClose("betslipSettings"));
        } else {
            this.props.dispatch(UIOpen("betslipSettings"));
        }
    },

    /**
     * @name toggleQuickBet
     * @description betslip toggle quick bet function which is opening quick bet stake
     * @returns {undefined}
     * */
    toggleQuickBet () {
        // $scope.acceptPriceChanges = '0';
        if (this.props.betslip.quickBet) {                              //eslint-disable-line react/prop-types
            this.openQuickBetStake();
        }
        this.props.dispatch(BetslipToggleQuickBet(!this.props.betslip.quickBet));            //eslint-disable-line react/prop-types
    },

    /**
     * @name toggleSuperBet
     * @description toggle function for super bet option in betSlip
     * @returns {undefined}
     * */
    toggleSuperBet () {
        this.props.dispatch(BetslipToggleSuperBet(!this.props.betslip.superBet));            //eslint-disable-line react/prop-types
    },

    /**
     * @name toggleFreeBet
     * @description toggle function for free bet option in betSlip
     * @returns {undefined}
     * */
    toggleFreeBet () {
        this.props.dispatch(BetslipToggleFreeBet(!this.props.betslip.freeBet));            //eslint-disable-line react/prop-types
    },

    /**
     * @name toggleFreeBet
     * @description toggle function for opening quick bet
     * @returns {undefined}
     * */
    openQuickBetStake () {
        this.props.dispatch(UIOpen("quickBetStake"));
    },

    /**
     * @name removeFromBetslip
     * @description helper function for removing betSlip current event
     * @param eventId
     * @returns {Function}
     * */
    removeFromBetslip (eventId) {
        return () => {
            this.props.betslip.events && Object.keys(this.props.betslip.events).length === 1 && this.props.dispatch(UIClose("betslip"));                                          //eslint-disable-line react/prop-types
            this.props.dispatch(BetslipRemove(eventId));
        };
    },

    /**
     * @name clearBetslip
     * @description remove all events from betSlip
     * @returns {undefined}
     * */
    clearBetslip () {
        this.props.dispatch(BetslipClear());
        this.props.dispatch(UIClose("betslip"));
    },
    render () {
        return Template.apply(this); //eslint-disable-line no-undef
    },
    componentDidMount () {
        //do a reset
        this.resetBetslipStatus();
        this.props.dispatch(BetslipToggleQuickBet(false));
        if (window.screen.width > 980) {
            this.props.dispatch(UIOpen("betslip"));
        }
    },
    shouldComponentUpdate (nextProps) {
        let currentProps = this.props;

        return nextProps.user !== currentProps.user ||
            nextProps.data !== currentProps.data ||
            nextProps.betslip !== currentProps.betslip ||
            nextProps.ui !== currentProps.ui ||
            nextProps.persistentUI !== currentProps.persistentUI ||
            nextProps.currency !== currentProps.currency &&
            (
                nextProps.currency &&
                currentProps.currency &&
                (
                    nextProps.currency.rate !== currentProps.currency.rate ||
                    nextProps.currency.rounding !== currentProps.currency.rounding
                )
            );
    }
});

function mapStateToProps (state) {
    return GetBetslipData(state);
}

export default connect(mapStateToProps)(SwarmDataMixin(
    {
        Component: UIMixin({Component: Betslip}),
        ComponentWillReceiveProps: function (nextProps) {
            // if (JSON.stringify(Object.keys(nextProps.betslip.events).sort()) !== JSON.stringify(Object.keys(this.props.betslip.events).sort())) {                   //eslint-disable-line react/prop-types
            rounding = nextProps.currency.rounding;
            console.info("rounding = nextProps.currency.rounding;");
            // ------------------      handle adding/deleting event from betslip ---------------------------------------
            let nextCount = Object.keys(nextProps.betslip.events).length;
            let prevCount = Object.keys(this.props.betslip.events).length;
            if (nextCount !== prevCount || (!this.inited && nextCount && nextCount > 0)) {
                console.debug("betslip ids changed!", nextProps.betslip);
                this.swarmSubscriptionRequest.where.event.id["@in"] = Object.keys(nextProps.betslip.events).map(id => parseInt(id, 10));
                this.resubscribe(true);
                this.props.dispatch(BetslipSetSystemOpt(2));
                if (prevCount === 1 && nextCount > 1 && nextProps.betslip.type !== BETSLIP_TYPE_EXPRESS) {
                    this.props.dispatch(BetslipSetType(BETSLIP_TYPE_EXPRESS));
                } else if (prevCount > 1 && nextCount <= 1) {
                    this.props.dispatch(BetslipSetType(BETSLIP_TYPE_SINGLE));
                }
                // this.props.dispatch(BetslipResetStatus());
                this.inited = true;
            }

            if (!this.props.user.profile && nextProps.user.profile && nextProps.user.profile.has_free_bets ||
                (!this.betslipLoadFreeBets && this.props.user.profile) ||
                nextCount !== prevCount
            ) {
                if (this.timerId) {
                    clearTimeout(this.timerId);
                }
                this.timerId = setTimeout(() => {
                    this.props.dispatch(BetslipLoadFreeBets());
                }, 100);
                this.betslipLoadFreeBets = true;
            }

            // --------- switch off quickbet when closing betslip
            if (this.props.betslip.quickBet && !nextProps.ui.opened.betslip) {
                this.props.dispatch(BetslipToggleQuickBet(false));
            }

            // --------- recalculate stake for system type
            if (nextProps.betslip.type === BETSLIP_TYPE_SYSTEM && (this.props.betslip.type !== nextProps.betslip.type || nextProps.betslip.sysOptionValue !== this.props.betslip.sysOptionValue || nextCount !== prevCount)) {
                this.props.dispatch(BetslipSetUnitStake(roundStake((parseFloat(nextProps.betslip.stake) || 0) / getDivisionCoefficient(nextProps.betslip))));
            }
            // --------------------- SUPER BET -------------------------------------------------------------------------
            if (nextProps.user.profile && nextProps.user.profile.super_bet !== undefined && nextProps.user.profile.super_bet !== -1) {
                let superBets = Helpers.objectToArray(nextProps.user.profile.super_bet);
                superBetWatcher(superBets, this.processedSuperBetIds, this.props.dispatch);
            }

            //TODO: check if event having base was deleted and try to replace it with event from same market having same type and nearest base
        },
        ComponentWillMount: function () {
            this.processedSuperBetIds = {};
            this.swarmSubscriptionRequest = {
                "source": "betting",
                "what": {"event": ["price", "base", "type"]},
                "where": {
                    "event": {"id": {"@in": Object.keys(this.props.betslip.events).map(id => parseInt(id, 10))}}
                }
            };
            this.swarmDataKey = "betslip";
        }
    }
));