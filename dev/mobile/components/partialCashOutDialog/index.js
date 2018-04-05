import React, {Component} from 'react';
import {connect} from 'react-redux';
import {DoPartialCashOut, SetCashOutValue} from "../../../actions/betHistory";
import {SwarmClearData} from "../../../actions/swarm";
import {UIMixin} from '../../../mixins/uiMixin';
import PropTypes from 'prop-types';
import {TOGGLE_VIRTUAL_KEYBOARD} from "../../../actions/actionTypes";
import Config from "../../../config/main";

let rounding;

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

class PartialCashOutDialog extends Component {

    /**
     * @name openKeyBoard
     * @description open virtual keyboard
     * @param {string} currentValue
     * @param {function} changeHandler
     * @param onOpenCallback
     * @param e
     * @param onCloseCallback
     * @returns {undefined}
     * */
    openKeyBoard (currentValue, changeHandler, onOpenCallback, e, onCloseCallback) {
        this.setUpKeyboard(currentValue, changeHandler, onOpenCallback, e, onCloseCallback);
    }

    componentWillReceiveProps (nextProps) {
        rounding = nextProps.currency.rounding;
    }

    /**
     * @name setUpKeyboard
     * @description function set up virtual keyboard
     * @param {string} currentValue
     * @param {function} changeHandler
     * @param onOpenCallback
     * @param e
     * @param onCloseCallback
     * @returns {undefined}
     * */
    setUpKeyboard (currentValue, changeHandler, onOpenCallback, e, onCloseCallback) {
        this.keyboardSettings = {
            currentValue,
            changeHandler,
            onOpenCallback,
            onCloseCallback,
            e,
            processHandler: (amount) => parseFloat(amount).toString() === amount ? roundStake(amount) : amount
        };

        setTimeout(() => {
            this.props.dispatch({type: TOGGLE_VIRTUAL_KEYBOARD, payload: true});
        });
    }

    /**
     * @name hideKeyboard
     * @description hide virutal keyboard
     * @returns action dispatcher
     * */
    hideKeyboard () {
        delete this.keyboardSettings;
        return this.props.dispatch({type: TOGGLE_VIRTUAL_KEYBOARD, payload: false });
    }

    setCashOutAmount (event = null) {
        return (amount) => {
            this.props.dispatch(SetCashOutValue({amount: amount}));
        };
    }

    componentWillMount () {
        this.props.dispatch(SwarmClearData("cashOut"));
    }

    /**
     * @description function which is preparing to do cash out
     * @returns {undefined}
     * */
    doPartialCashOut () {
        let data = this.props.swarmData.data.cashOut,
            price = (data && data.details && data.details.new_price) || this.props.price,
            partialPrice = this.props.betHistory.cashout && this.props.betHistory.cashout.amount;
        this.props.dispatch(DoPartialCashOut(this.props.betId, price, parseInt(partialPrice)));
    }
    render () {
        return Template.apply(this); //eslint-disable-line no-undef
    }
}

PartialCashOutDialog.propTypes = {
    swarmData: PropTypes.object.isRequired,
    ui: PropTypes.object.isRequired,
    betHistory: PropTypes.object.isRequired,
    currency: PropTypes.object.isRequired,
    price: PropTypes.number,
    betId: PropTypes.number
};

function mapStateToProps (state) {
    return {
        swarmData: state.swarmData,
        ui: state.uiState,
        betHistory: state.betHistory,
        currency: state.user.profile && state.swarmConfigData.currency[state.user.profile.currency_id] || {
            rate: 1,
            rounding: Config.main.defaultCurrencyRounding
        }
    };
}

export default connect(mapStateToProps)(UIMixin({Component: PartialCashOutDialog}));