import React, {Component} from 'react';
import {connect} from 'react-redux';
import {DoCashOut, SetCashOutValue} from "../../../actions/betHistory";
import {SwarmClearData} from "../../../actions/swarm";
import {UIMixin} from '../../../mixins/uiMixin';
import PropTypes from 'prop-types';
import {TOGGLE_VIRTUAL_KEYBOARD} from "../../../actions/actionTypes";

class CashOutDialog extends Component {

    constructor (props) {
        super(props);
        this.doCashOut = this.doCashOut.bind(this);
    }
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
            e,
            onCloseCallback,
            processHandler: (amount) => amount
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
        this.props.dispatch(SetCashOutValue({amount: this.props.price}));
        this.props.dispatch(SwarmClearData("cashOut"));
    }
    componentWillUnmount () {
        this.hideKeyboard();
    }
    /**
     * @description function which is preparing to do cash out
     * @returns {undefined}
     * */
    doCashOut () {
        let data = this.props.swarmData.data.cashOut,
            price = (data && data.details && data.details.new_price) || this.props.price,
            partialPrice = this.props.betHistory.cashout && this.props.betHistory.cashout.amount;
        if (parseInt(partialPrice) === parseInt(price)) {
            partialPrice = null;
        }
        this.props.dispatch(DoCashOut(this.props.betId, price, partialPrice));
    }
    render () {
        return Template.apply(this); //eslint-disable-line no-undef
    }
}

CashOutDialog.propTypes = {
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
        betHistory: state.betHistory
    };
}

export default connect(mapStateToProps)(UIMixin({Component: CashOutDialog}));