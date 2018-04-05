import React from 'react';
import {connect} from 'react-redux';
import Config from '../../../config/main';
import PropTypes from 'prop-types';
import {generateMessagesForEuroPayments} from "../../../actions/payments";

class PaymentMethodsItem extends React.Component {
    componentDidMount () {
        let props = this.props;
        if (props.isEuroPayment && !props.methodState.loaded[props.paymentID] && !props.methodState.loading[props.paymentID]) {
            //props.dispatch(generateMessagesForEuroPayments(props.paymentID, this.getMessage()));
        }
    }
    getMessage () {
        return {
            "amount": 100,
            "service": "europayment",
            "payer": {
                "command": "GetActivePaymentMessage",
                "type": this.props.requestType,
                "eamount": null
            }
        };
    }
    render () {
        return Template.apply(this); //eslint-disable-line no-undef
    }
}

PaymentMethodsItem.propTypes = {
    method: PropTypes.object.isRequired,
    forAction: PropTypes.string
};

function mapStateToProps (state, ownParams) {
    return {
        requestType: ownParams.forAction === 'deposit' ? "0" : "1",
        methodState: state.paymentItemsState,
        isEuroPayment: Config.main.euroPaymentIdes && Config.main.euroPaymentIdes.includes(ownParams.method.paymentID),
        paymentID: ownParams.method.paymentID
    };
}

export default connect(mapStateToProps)(PaymentMethodsItem);