import React from 'react';
import {connect} from 'react-redux';
import {reduxForm} from 'redux-form';
import Validate from "../../../helpers/validate";
import formsNames from '../../../constants/formsNames';
import {SetDepositNextStep, SetMethodExternalFormData, SetMethodIframeData, SetMethodConfirmAction, DoPaymentRequest} from '../../../actions/payments';
import {OpenPopup} from "../../../actions/ui";
import {t} from '../../../helpers/translator';
import PaymentsFormMixin from '../../../mixins/paymentsFormMixin';
import {PaymentsMixin} from '../../../mixins/paymentsMixin';
import {GetPaymentsData} from "../../../helpers/selectors";

const validate = (values, state) => {
    const errors = {},
        balance = state.user && state.user.profile && state.user.profile.balance ? (state.user.profile.balance - state.user.profile.frozen_balance || 0) : 0;

    !state.payments.method.nextStep && state.payments.method.withdrawFormFields.forEach((field) => {
        if (field.type === "number" && field.name === "amount") {
            let minWithdraw = state.payments.method.info[state.user.profile.currency_name].minWithdraw,
                maxWithdraw = state.payments.method.info[state.user.profile.currency_name].maxWithdraw;

            if (minWithdraw) {
                Validate(values.amount, "amount", ["minWithdraw", minWithdraw], errors);
            }

            if (maxWithdraw) {
                Validate(values.amount, "amount", ["maxWithdraw", maxWithdraw], errors);
            }

            Validate(values.amount, "amount", ["maxWithdraw", balance], errors, t("Insufficient balance."));

            Validate(values.amount, "amount", ["required", true], errors);
        }
        if (field.type === "email") {
            Validate(values[field.name], field.name, [field.type], errors);
        }
        if (field.type === "text" && field.required) {
            Validate(values[field.name], field.name, ["required", true], errors);
        }
    });
    return errors;
};

const WithdrawForm = React.createClass({

    propTypes: {
        payments: React.PropTypes.object,
        uiState: React.PropTypes.object,
        routeParams: React.PropTypes.object,
        checkUserAuthontication: React.PropTypes.func,
        selectMethod: React.PropTypes.func
    },

    contextTypes: {
        router: React.PropTypes.object.isRequired
    },

    componentWillMount () {
        window.scrollTo(0, 0);
    },

    componentWillReceiveProps (nextProps) {
        if (this.props.payments.method && this.props.payments.method.name !== nextProps.routeParams.method) {
            this.props.selectMethod(nextProps.routeParams.method, nextProps.payments.availableMethods, this.props.dispatch, this.context.router, this.props.payments.data);
        }
        this.props.checkUserAuthontication(this.context.router);
    },

    render () {
        return Template.apply(this); //eslint-disable-line no-undef
    }
});

const mapStateToProps = (state, ownParams) => {
    let payments = GetPaymentsData(state),
        initialValues = ((payments.method || {}).withdrawFormFields || []).reduce((collected, current) => {
            if (current.type === 'select') {
                collected[current.name] = current.options && current.options[0] ? current.options[0].value || "" : "";
            } else if (current.name !== "amount") {
                collected[current.name] = current.defaultValue || "";
            }
            return collected;
        }, {});

    initialValues.amount = 0;
    return {
        user: state.user,
        uiState: state.uiState,
        initialValues,
        forms: state.form,
        ownParams: ownParams,
        payments
    };
};

export default connect(mapStateToProps)(PaymentsMixin({
    Component: PaymentsFormMixin({
        Component: (reduxForm({
            form: formsNames.withdrawForm,
            validate
        }))(WithdrawForm),
        submit: function (values) {
            let self = this,
                request = self.toBackendObject(self.props, values),
                selectedMethod = self.props.payments.method;

            request.payee.forProduct = self.props.uiState.lastRouteType || 'sport';

            return this.processRequest(request, selectedMethod);

        },
        processRequest: function (request, selectedMethod) {
            let self = this;

            return DoPaymentRequest(request, "withdraw")(self.props.dispatch).then(
                (data) => {
                    if (data && data.result !== undefined && data.result === 0 && (!data.details || !data.details.error || data.details.error === 0)) {
                        //on success
                        let confirmData,
                            title,
                            message,
                            confirmedCallback;
                        if (data.details.method) {
                            switch (data.details.method.toLowerCase()) {
                                case 'post': //tested
                                case 'get': // tested
                                    confirmData = Object.assign({}, {
                                        formId: "confirmWithdrawForm_" + new Date().getTime()
                                    }, data.details);
                                    self.props.dispatch(SetMethodExternalFormData(confirmData));
                                    self.props.dispatch(OpenPopup("ConfirmWithdraw"));
                                    break;
                                case 'iframe': // tested
                                    self.props.dispatch(SetMethodIframeData({src: data.details.action}));
                                    break;
                                case 'confirmation': //tested on mock
                                    title = t("Info");
                                    message = t(selectedMethod.depositConfirmationText || `Tax deduction: ${self.getFieldValue(data.details.fields, 'fee') + ' ' + self.getFieldValue(data.details.fields, 'currency')} Do you want to continue?`);
                                    confirmedCallback = function () {
                                        self.processRequest(request, selectedMethod);
                                    };
                                    self.props.dispatch(SetMethodConfirmAction({
                                        title,
                                        request: request,
                                        confirmedCallback,
                                        message
                                    }));
                                    self.props.dispatch(OpenPopup("ConfirmWithdraw"));
                                    break;
                                case 'form': // partial (no any info about response)
                                    self.props.dispatch(SetDepositNextStep(data.details));
                                    break;
                                case 'formdraw': // partial (no any info about response)
                                    self.props.dispatch(SetDepositNextStep(data.details));
                                    break;
                            }
                        } else {
                            self.props.dispatch(OpenPopup("message", {
                                title: t("Success"),
                                type: "accept",
                                body: t("Your withdraw has been successfully completed")
                            }));
                        }
                    } else {
                        if ((data.result && data.details && data.details.code) || data.code) {
                            self.handleSubmissionErrors(data.details || data);
                        }
                    }
                }
            );
        },
        init: function () {
            if (this.props.routeParams.method && this.props.payments.availableMethods.length) {
                this.selectMethod(this.props.routeParams.method, this.props.payments.availableMethods, this.props.dispatch, this.context.router, this.props.payments.data);
            }
            this.checkUserAuthontication(this.context.router);
        }
    })
}));