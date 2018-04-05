import React from 'react';
import {connect} from 'react-redux';
import Config from "../../../config/main";
import PropTypes from 'prop-types';

const MoneyAmount = React.createClass({
    propTypes: {
        amount: PropTypes.number,
        currency: PropTypes.string,
        onClick: PropTypes.func
    },
    render () {
        if (this.props.amount === undefined) {
            return null;
        }
        //eslint-disable-next-line react/prop-types
        var currency = this.props.currency || (this.props.user && this.props.user.profile && this.props.user.profile.currency_id);
        //eslint-disable-next-line react/prop-types
        var selectedCurrencyConfig = (currency && this.props.currencyConfig[currency]) || {rounding: Config.main.defaultCurrencyRounding};
        return <i onClick={this.props.onClick}>{parseFloat(this.props.amount).toFixed(Math.abs(selectedCurrencyConfig.rounding))} {currency}</i>;
    }
});

function mapStateToProps (state) {
    return {
        currencyConfig: state.swarmConfigData.currency,
        user: state.user
    };
}

export default connect(mapStateToProps)(MoneyAmount);