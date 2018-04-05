import React from 'react';
import {t} from "../../../helpers/translator";
import Loader from "../../components/loader";
import PaymentsNavigationMenu from "../../components/paymentsNavigationMenu";
import Config from "../../../config/main";
import StandardForm from "../paymentsGenericForms/standardForm";
import ExternalForm from "../paymentsGenericForms/externalForm";
import BetShopsForm from "./pices/betshopsForm";
import EuroPaymentFrom from "../paymentsGenericForms/euroPaymentForm";

const defaultValuesForPartner = Config.main.buttonsDefaultValues;

module.exports = function depositFormTemplate () {
    let method = this.props.payments.method;

    if (!method || !this.props.user.profile) {
        return (<Loader />);
    }

    let userProfile = this.props.user.profile,
        currencyCode = (userProfile.currency_name || userProfile.currency_id || userProfile.currency_code),
        paymentMethodInfoByCurrency = method.info[currencyCode],
        limits = this.props.getLimits(paymentMethodInfoByCurrency.minDeposit, paymentMethodInfoByCurrency.maxDeposit, currencyCode);

    /**
     * @name getDefaultValues
     * @description get default values of deposit methods
     * @returns {object}
     * */
    const getDefaultValues = () => {
        let defaults = paymentMethodInfoByCurrency.default || (defaultValuesForPartner || {})[currencyCode];
        if (defaults && defaults.deposit && defaults.deposit.length && !(method.hideDepositButton || method.onlyInfoTextOnDeposit)) {
            return defaults.deposit;
        }
    };

    /**
     * @name inlineStyle
     * @description  function for styling deposit methods
     * @param {Object} method
     * @returns {object}
     * */
    let inlineStyle = (method) => {
        return Object.assign({}, {backgroundImage: 'url(' + method.image + ')'});
    };

    return (
        <div className="deposit-view-wrapper">
            <div className="title-separator-contain-b">
                <h1>{t("payments")}</h1>
            </div>

            <PaymentsNavigationMenu />

            {
                (() => {
                    let depositInfoText = (method.depositInfoText && method.depositInfoText[this.props.language]) ||
                        (method.depositInfoTextKey && t(method.depositInfoTextKey)) ||
                        (method.depositInfoText && method.depositInfoText[Config.env.lang]) ||
                        "";

                    depositInfoText = depositInfoText.split(" ").length > 1 ? depositInfoText : null;
                    switch (true) {
                        case !!this.props.payments.iframe:
                            return <ExternalForm src={this.props.payments.iframe.src} method={method} transactionType={"deposit"}/>;
                        case !!method && !this.props.payments.nextStep && !method.hasBetShops && !(Config.main.euroPaymentIdes && Config.main.euroPaymentIdes.includes(method.paymentID)):
                        case !!this.props.payments.nextStep:
                            return <StandardForm
                                defaultValues={getDefaultValues()}
                                formFields={!this.props.payments.nextStep ? method.depositFormFields || [] : this.props.payments.nextStep.fields.map((field) => {
                                    return {name: field.name, ...field.value};
                                })}
                                getFormItem={this.props.getFormItem}
                                inlineStyle={inlineStyle}
                                t={t}
                                infoText={depositInfoText}
                                currencyCode={currencyCode}
                                limits={limits}
                                method={method}
                                hideButton={method.hideDepositButton || method.onlyInfoTextOnDeposit}
                                handleDefaultAmountClick={this.props.handleDefaultAmountClick}
                                user={this.props.user}
                                paymentForm={this.props.forms.depositForm}
                                handleSubmit={this.props.handleSubmit}
                                submitHandler={this.props.submitHandler}
                                invalid={this.props.invalid}
                                submitting={this.props.submitting}
                                error={this.props.error}
                                transactionType={"deposit"}
                                paymentMethodInfoByCurrency={paymentMethodInfoByCurrency}
                            />;
                        case !!method && !this.props.payments.nextStep && !method.hasBetShops && (Config.main.euroPaymentIdes && Config.main.euroPaymentIdes.includes(method.paymentID)):
                            return <EuroPaymentFrom
                                defaultValues={getDefaultValues()}
                                formFields={method.depositFormFields}
                                getFormItem={this.props.getFormItem}
                                inlineStyle={inlineStyle}
                                transactionType={"deposit"}
                                t={t}
                                infoText={depositInfoText}
                                currencyCode={currencyCode}
                                limits={limits}
                                method={method}
                                handleDefaultAmountClick={this.props.handleDefaultAmountClick}
                                user={this.props.user}
                                paymentForm={this.props.forms.depositForm}
                                handleSubmit={this.props.handleSubmit}
                                submitHandler={this.props.submitHandler}
                                invalid={this.props.invalid}
                                submitting={this.props.submitting}
                                error={this.props.error}
                                paymentMethodInfoByCurrency={paymentMethodInfoByCurrency}
                            />;
                        case !!method && !this.props.payments.nextStep && method.hasBetShops && this.props.payments.data.loaded:
                            return <BetShopsForm
                                t={t}
                                method={method}
                                infoText={depositInfoText}
                                paymentMethodInfoByCurrency={paymentMethodInfoByCurrency}
                                limits={limits}
                                transactionType={"deposit"}
                                submitting={this.props.submitting}
                                getFormItem={this.props.getFormItem}
                                error={this.props.error}
                                cities={this.props.payments.data.cities}
                                currencyCode={currencyCode}
                            />;
                    }
                })()
            }
        </div>
    );
};