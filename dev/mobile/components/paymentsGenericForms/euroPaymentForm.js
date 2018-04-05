import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Link} from 'react-router';
import {t} from '../../../helpers/translator';
import Zergling from '../../../helpers/zergling';
import Config from '../../../config/main';
import {updateUserProfile} from "../../../actions/user";
import {ClosePopup, OpenPopup} from "../../../actions/ui";
import {generateMessagesForEuroPayments} from "../../../actions/payments";
import {defaultDataParserForEuroPayments} from "../../../helpers/euroPaymentDefaultDataParser";
import {startSubmit, stopSubmit} from 'redux-form';
import moment from "moment";
import Loader from "../../components/loader";
import formNames from "../../../constants/formsNames";
function mapStateToProps (state, ownParams) {
    return {
        methodState: state.paymentItemsState,
        requestType: ownParams.transactionType === 'deposit' ? "0" : "1",
        paymentID: ownParams.method.paymentID,
        uiState: state.uiState
    };
}

class EuroPaymentForm extends Component {
    componentDidMount () {
        let props = this.props;
        if (!(props.methodState.loaded[props.paymentID] && props.methodState.loading[props.transactionType + props.paymentID])) {
            this.getActiveMessages();
        }
    }
    getActiveMessages () {
        this.props.dispatch(
            generateMessagesForEuroPayments({
                key: this.props.transactionType + this.props.paymentID,
                command: "GetActivePaymentMessage",
                requestData: this.getMessage({command: "GetActivePaymentMessage"}),
                parseData: defaultDataParserForEuroPayments,
                successCallback: this.handleResult.bind(this)
            })
        );
    }
    getMessage ({command, forProduct = this.props.uiState.lastRouteType || 'sport', eamount, mID}) {
        return {
            "amount": 100,
            "service": "europayment",
            "payer": {
                "type": this.props.requestType,
                command,
                eamount,
                forProduct,
                mID
            }
        };
    }
    submitHandler (values) {
        let profile = this.props.user.profile,
            self = this;
        if (profile.active_step === 21 && profile.active_step_state === 5 && Config.main.checkActiveStepsForFirstDeposit) {
            const acceptCondition = () => {
                Zergling.get({}, 'accept_terms_conditions').then(function (response) {
                    if (response.result === 0) {
                        self.props.dispatch(updateUserProfile({active_step: null, active_step_state: null}));
                        self.props.dispatch(ClosePopup());
                    } else {
                        console.error('accept_terms_conditions ERROR');
                    }
                }, function () {
                    console.error('accept_terms_conditions ERROR');
                });
            };
            this.props.dispatch(OpenPopup("accept_or_cancel", {
                type: "info",
                title: t("Confirmation"),
                body: t("We hold customers funds separately from the business accounts, and arrangements have been made to ensure that assets in the customer accounts are distributed to customers in the event of insolvency. For more information, please refer to our Terms and Conditions. This meets with the UK Gambling Commission’s requirements for the segregation of customer funds at the level: medium protection. Further information can be found here."),
                accept_button: 'I agree',
                cancel_button: 'I do not agree',
                accept_button_function: acceptCondition
            }));
        } else {
            this.props.dispatch(startSubmit(this.props.transactionType === "withdraw" ? formNames.withdrawForm : formNames.depositForm));
            return this.processRequest(this.getMessage({command: "CreatePaymentMessage", eamount: values.amount}));
        }
    }
    handleResult (result, command, next) {
        this.props.dispatch(stopSubmit(this.props.transactionType === "withdraw" ? formNames.withdrawForm : formNames.depositForm));
        next();
        let message,
            type;
        if (result.status === 'error' && result.msg) {
            message = result.msg;
            type = 'error small-icon-v-m';
        } else {
            switch (command) {
                case "GetActivePaymentMessage":
                    if (result.dateUTC) {
                        result.dateLocale = moment(moment.utc(result.dateUTC).toDate()).format('YYYY/MM/DD HH:mm:ss');
                    }
                    break;
                case "ConfirmPaymentMessage":
                    if (result.status === 'success' && result.msg) {
                        message = result.msg;
                        type = "success";
                    }
                    this.getActiveMessages();
                    break;
                case "CreatePaymentMessage":
                    message = t(`Your ${this.props.transactionType} has been successfully send`);
                    type = "accept";
                    this.getActiveMessages();
                    break;
            }
        }
        if (message) {
            this.props.dispatch(OpenPopup("message", {
                type,
                body: message !== "none" ? message : t(`Your ${this.props.transactionType} has been successfully completed`)
            }));
        }

    }
    processRequest (requestData, command = "CreatePaymentMessage") {
        let props = this.props;
        props.dispatch(
            generateMessagesForEuroPayments({
                key: this.props.transactionType + props.paymentID,
                command,
                requestData,
                parseData: defaultDataParserForEuroPayments,
                type: "CREATE_MESSAGES_FOR_PAYMENT_METHOD",
                successCallback: this.handleResult.bind(this)
            })
        );
    }
    confirm () {
        let props = this.props,
            command = "ConfirmPaymentMessage",
            results = props.methodState.data[props.transactionType + props.paymentID],
            requestData = this.getMessage({
                command,
                eamount: results.eamount,
                mID: results.mID
            });
        this.processRequest(requestData, command);
    }
    capitalizeFirstLetter (string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    render () {
        let {
                formFields,
                getFormItem,
                t,
                defaultValues,
                inlineStyle,
                method,
                currencyCode,
                paymentMethodInfoByCurrency,
                limits,
                infoText,
                user,
                transactionType,
                handleDefaultAmountClick,
                paymentForm,
                error,
                invalid,
                submitting,
                handleSubmit } = this.props,
            props = this.props,
            results = props.methodState.data[props.transactionType + props.paymentID],
            loading = props.methodState.loading[props.transactionType + props.paymentID],
            hasActiveTransaction = results && results.status !== "none" && results.status !== "error",
            fields = formFields.map((field, index) => {
                return (
                    <div className="details-form-item-m" key={index}>
                        <label>{t(field.label)}</label>
                        {
                            getFormItem(field, index)
                        }
                    </div>
                );
            });

        return (
            <div className="payments-form-wrapper animate-from-right-to-left">
                <div className="bread-crumbs-view-m">
                    <Link to={`/balance/${transactionType}`}>
                        <span className="back-arrow-crumbs"/>
                    </Link>
                    <p>
                        <span>{t(method.displayName || method.name)}</span>
                    </p>
                </div>

                <div className="single-payment-title">
                    <ul>
                        <li><div className="deposit-m-icon" style={inlineStyle(method)}/></li>
                        <li>
                            <div className="payment-text-container" dangerouslySetInnerHTML={{__html: infoText}}/>
                            <p><i>{t("Service Fee:")} {paymentMethodInfoByCurrency[`${transactionType}Fee`] && paymentMethodInfoByCurrency.hasOwnProperty(`${transactionType}Fee`) !== 0 ? `${paymentMethodInfoByCurrency[[`${transactionType}Fee`]]} ${currencyCode}` : t("free")}</i></p>
                            {
                                (limits ? (<p><i>{limits}</i></p>) : (null))
                            }
                        </li>
                    </ul>
                </div>

                <form className="deposit-form-container">
                    {
                        defaultValues
                            ? (
                                <div className="details-form-item-m amount-b">
                                    <label>{t(`Choose or enter ${transactionType} amount`)}</label>
                                    <div className="deposit-amount-buttons">
                                        <ul>
                                            {
                                                defaultValues
                                                    .filter(value => (value <= method.info[user.profile.currency_name][`max${this.capitalizeFirstLetter(transactionType)}`] && value >= method.info[user.profile.currency_name][`min${this.capitalizeFirstLetter(transactionType)}`]))
                                                    .map((value, index) =>
                                                        <li key={index}>
                                                            <button type="button"
                                                                    onClick={() => {
                                                                        handleDefaultAmountClick('' + (value + (Number(paymentForm && paymentForm.values && paymentForm.values.amount || 0) || 0)));
                                                                    }}
                                                                    className={(paymentForm && paymentForm.values && paymentForm.values.amount === ('' + value)) ? 'button-view-normal-m' : 'button-view-normal-m trans-m'}>
                                                                {value} {currencyCode}
                                                            </button>
                                                        </li>
                                                    )
                                            }
                                            <li key="clear">
                                                <button type="button"
                                                        onClick={() => {
                                                            handleDefaultAmountClick('' + 0);
                                                        }}
                                                        className="button-view-normal-m trans-m">
                                                    {t("Clear")}
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            )
                            : (null)
                    }
                    {
                        fields
                    }
                    {
                        submitting
                            ? <Loader />
                            : (
                                <div className="separator-box-buttons-m">
                                    <button onClick={handleSubmit(this.submitHandler.bind(this))}
                                            disabled={invalid || hasActiveTransaction}
                                            className={`button-view-normal-m ${hasActiveTransaction ? 'disabled' : ''}`}>{t(transactionType)}</button>
                                </div>
                            )
                    }
                </form>

                {
                    transactionType === "deposit"
                        ? (hasActiveTransaction)
                            ? (
                                <div className="self-exclusion-container-m">
                                    <div className="separator-box-buttons-m">

                                        <ul className="status-update-m">
                                            <li><span className="update-button" onClick={() => this.getActiveMessages()}> {t("refresh")}</span></li>
                                            <li><p>{t("Amount")}</p></li>
                                            <li><p>{t("Status")}</p></li>
                                        </ul>
                                        <div className="separator-box-buttons-m second">
                                            <ul>
                                                <li>
                                                    {
                                                        results.msg && results.msg !== "none"
                                                            ? (
                                                                <p dangerouslySetInnerHTML={{__html: results.msg}} />
                                                            )
                                                            : <p />
                                                    }
                                                </li>
                                                <li><span>{results.eamount}</span></li>
                                                <li><span>{t(results.msgstatus)}</span></li>
                                            </ul>
                                        </div>
                                    </div>
                                    {
                                        results.dateLocale
                                            ? (
                                                <p>
                                                    <span>{results.dateLocale}</span>
                                                </p>
                                            )
                                            : (null)
                                    }

                                    {
                                        results.canReply && results.canReply === "yes"
                                            ? (
                                                <div className="separator-box-buttons-m">
                                                    <button className="button-view-normal-m" onClick={() => this.confirm(results.mID)}>{t("Confirm")}</button>
                                                </div>
                                            )
                                            : (null)
                                    }
                                </div>
                            )
                            : loading ? <Loader /> : (null)
                        : (null)
                }

                { error
                    ? <div className="login-error"><span>{error}</span></div>
                    : null
                }
            </div>
        );
    }
}

EuroPaymentForm.propTypes = {
    paymentID: PropTypes.number,
    formFields: PropTypes.array,
    defaultValues: PropTypes.array,
    getFormItem: PropTypes.func,
    inlineStyle: PropTypes.func,
    handleDefaultAmountClick: PropTypes.func,
    method: PropTypes.object,
    paymentMethodInfoByCurrency: PropTypes.object,
    paymentForm: PropTypes.object,
    uiState: PropTypes.object,
    user: PropTypes.object,
    methodState: PropTypes.object,
    currencyCode: PropTypes.string,
    requestType: PropTypes.string,
    transactionType: PropTypes.string,
    limits: PropTypes.string,
    infoText: PropTypes.string,
    t: PropTypes.func,
    handleSubmit: PropTypes.func,
    submitHandler: PropTypes.func,
    submitting: PropTypes.bool,
    invalid: PropTypes.bool,
    error: PropTypes.object
};

export default connect(mapStateToProps)(EuroPaymentForm);