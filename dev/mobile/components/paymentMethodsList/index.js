import React from 'react';
import {connect} from 'react-redux';
import {PaymentsMixin} from "../../../mixins/paymentsMixin";
import {checkIfUserIsLoggedIn} from "../../../mixins/checkAuthentication";
import {UIOpen, OpenPopup, ConfirmationDialogReset} from "../../../actions/ui";
import {isMissingAnyRequiredField} from "../../../helpers/profile/isMissingAnyRequiredField";
import {t} from '../../../helpers/translator';
import {GetPaymentsData} from "../../../helpers/selectors";

const MethodsList = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    propTypes: {
        user: React.PropTypes.object.isRequired,
        dispatch: React.PropTypes.func.isRequired
    },

    componentWillMount () {
        if (!this.props.user.loginInProgress && !this.props.user.loggedIn) {
            this.props.dispatch(UIOpen("rightMenu"));
            this.props.dispatch(OpenPopup("LoginForm"));
            this.context.router.push("/");
        }
    },

    /**
     * @name selectMethod
     * @description help function which is redirecting to selected deposit method
     * @param {object} method
     * @returns {undefined}
     */
    selectMethod (method) {
        let self = this;
        if (this.props.user.loggedIn && this.props.user.profile && isMissingAnyRequiredField(this.props.user.profile)) {
            let detailsPageName = t("Personal details");
            return self.props.dispatch(OpenPopup("confirm", {
                id: "fillPersonalInfo",
                title: t("Please fill all required fields first."),
                type: "info",
                body: t("It is very important to keep your personal information up to date. Hence our request to you is to submit your personal information in <b>{1}</b> as soon as possible.", detailsPageName),
                answers: [
                    {title: t("Fill now"), value: true}
                ]
            }));
        } else {
            this.context.router.push('/balance/' + this.props.route.forAction + '/' + method.name); //eslint-disable-line react/prop-types
        }
    },
    componentWillReceiveProps (nextProps) {
        if (nextProps.ui.confirmation.fillPersonalInfo) {
            if (nextProps.ui.confirmation.fillPersonalInfo.answer === true) {
                this.context.router.push("/profile/details");
            }
            this.props.dispatch(ConfirmationDialogReset("fillPersonalInfo"));
        }
    },
    render () {
        return checkIfUserIsLoggedIn(this.props.user, this.props.dispatch) || Template.apply(this);
    }
});

function mapStateToProps (state) {
    return {
        payments: GetPaymentsData(state),
        user: state.user,
        ui: state.uiState
    };
}

export default connect(mapStateToProps)(PaymentsMixin({
    Component: MethodsList
}));