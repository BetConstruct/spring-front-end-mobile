import React from 'react';
import {connect} from 'react-redux';
import {UnsetMethodExternalFormData, UnsetMethodConfirmAction} from "../../../actions/payments.js";
import {ClosePopup} from "../../../actions/ui";

var Template = Template || {};

const ConfirmDepositOrWithdraw = React.createClass({
    propTypes: {
        payments: React.PropTypes.object
    },

    /**
     * @name submit
     * @description helper function for deposit submit
     * @returns {undefined}
     * */
    submit () {
        document.getElementById(this.props.payments.hiddenForm.formId || 'hiddenFormId').submit();
        this.props.dispatch(ClosePopup("ConfirmDeposit"));
    },

    /**
     * @name closeDialog
     * @description function get action type for dispatching corresponding case
     * @param {string} action
     * @returns {undefined}
     * */
    closeDialog (action) {
        switch (action) {
            case "confirm":
                this.props.payments.confirmAction.confirmedCallback && this.props.payments.confirmAction.confirmedCallback();
                return this.props.dispatch(ClosePopup("ConfirmDeposit"));
            case "reject":
                return this.props.dispatch(ClosePopup("ConfirmDeposit"));
        }
    },
    componentWillUnmount () {
        !!this.props.payments.hiddenForm && this.props.dispatch(UnsetMethodExternalFormData());
        !!this.props.payments.confirmAction && this.props.dispatch(UnsetMethodConfirmAction());
    },
    render () {
        return Template.apply(this);
    }
});

function mapStateToProps (state, ownParams) {
    return {
        payments: state.payments,
        user: state.user,
        ownParams
    };
}

export default connect(mapStateToProps)(ConfirmDepositOrWithdraw);