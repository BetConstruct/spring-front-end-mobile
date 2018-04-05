import React from 'react';
import {t} from "../../../helpers/translator";
import Loader from "../../components/loader";
import PaymentsNavigationMenu from "../../components/paymentsNavigationMenu";
import Config from "../../../config/main";
import ExternalForm from "../paymentsGenericForms/externalForm";
import StandardForm from "../paymentsGenericForms/standardForm";
import BuddyToBuddyForm from "../paymentsGenericForms/buddyToBuddyForm";
import EuroPaymentFrom from "../paymentsGenericForms/euroPaymentForm";
import BetShopsForm from "./pices/betshopsForm";

const defaultValuesForPartner = Config.main.buttonsDefaultValues;

module.exports = function depositFormTemplate () {
    let method = this.props.payments.method;

    if (!method || !this.props.user.profile) {
        return (<Loader />);
    }

    let userProfile = this.props.user.profile,
        currencyCode = (userProfile.currency_name || userProfile.currency_id || userProfile.currency_code),
        paymentMethodInfoByCurrency = method.info[currencyCode],
        limits = this.props.getLimits(paymentMethodInfoByCurrency.minWithdraw, paymentMethodInfoByCurrency.maxWithdraw, currencyCode);

    /**
     * @name getDefaultValues
     * @description get default values of withdraw methods
     * @returns {object}
     * */
    const getDefaultValues = () => {
        let defaults = paymentMethodInfoByCurrency.default || (defaultValuesForPartner || {})[currencyCode];
        if (defaults && defaults.withdraw && defaults.withdraw.length) {
            return defaults.withdraw;
        }
    };

    /**
     * @name inlineStyle
     * @description  function for styling withdraw methods
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
                    let withdrawInfoText = (method.withdrawInfoText && method.withdrawInfoText[this.props.language]) ||
                        (method.withdrawInfoTextKey && t(method.withdrawInfoTextKey)) ||
                        (method.withdrawInfoText && method.withdrawInfoText[Config.env.lang]) ||
                        "";

                    withdrawInfoText = withdrawInfoText.split(" ").length > 1 ? withdrawInfoText : null;
                    switch (true) {
                        case !!method && !this.props.payments.nextStep && !method.hasBetShops && !(Config.main.euroPaymentIdes && Config.main.euroPaymentIdes.includes(method.paymentID)) && method.name !== "buddyToBuddy":
                        case !!this.props.payments.nextStep :
                            return <StandardForm
                                defaultValues={getDefaultValues()}
                                formFields={!this.props.payments.nextStep ? method.withdrawFormFields : this.props.payments.nextStep.fields.map((field) => {
                                    return {name: field.name, ...field.value};
                                })}
                                getFormItem={this.props.getFormItem}
                                inlineStyle={inlineStyle}
                                rate={this.props.ratesCurrencies}
                                t={t}
                                infoText={withdrawInfoText}
                                currencyCode={currencyCode}
                                limits={limits}
                                method={method}
                                hideButton={false}
                                handleDefaultAmountClick={this.props.handleDefaultAmountClick}
                                user={this.props.user}
                                paymentForm={this.props.forms.withdrawForm}
                                handleSubmit={this.props.handleSubmit}
                                submitHandler={this.props.submitHandler}
                                invalid={this.props.invalid}
                                submitting={this.props.submitting}
                                error={this.props.error}
                                transactionType={"withdraw"}
                                paymentMethodInfoByCurrency={paymentMethodInfoByCurrency}
                            />;
                        case !!method && method.name === "buddyToBuddy":
                            return <BuddyToBuddyForm
                                formFields={method.withdrawFormFields}
                                getFormItem={this.props.getFormItem}
                                inlineStyle={inlineStyle}
                                rate={this.props.ratesCurrencies}
                                t={t}
                                currencyCode={currencyCode}
                                limits={limits}
                                method={method}
                                hideButton={false}
                                handleSubmit={this.props.handleSubmit}
                                invalid={this.props.invalid}
                                submitting={this.props.submitting}
                                error={this.props.error}
                                transactionType={"withdraw"}
                                paymentMethodInfoByCurrency={paymentMethodInfoByCurrency}
                            />;
                        case !!method && !this.props.payments.nextStep && !method.hasBetShops && Config.main.euroPaymentIdes && Config.main.euroPaymentIdes.includes(method.paymentID):
                            return <EuroPaymentFrom
                                defaultValues={getDefaultValues()}
                                formFields={method.withdrawFormFields}
                                getFormItem={this.props.getFormItem}
                                inlineStyle={inlineStyle}
                                transactionType={"withdraw"}
                                t={t}
                                infoText={withdrawInfoText}
                                currencyCode={currencyCode}
                                limits={limits}
                                method={method}
                                handleDefaultAmountClick={this.props.handleDefaultAmountClick}
                                user={this.props.user}
                                paymentForm={this.props.forms.withdrawForm}
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
                                infoText={withdrawInfoText}
                                paymentMethodInfoByCurrency={paymentMethodInfoByCurrency}
                                limits={limits}
                                transactionType={"withdraw"}
                                getFormItem={this.props.getFormItem}
                                error={this.props.error}
                                invalid={this.props.invalid}
                                submitting={this.props.submitting}
                                handleSubmit={this.props.handleSubmit}
                                submitHandler={this.props.submitHandler}
                                cities={this.props.payments.data.cities}
                                currencyCode={currencyCode}
                            />;
                        case !!this.props.payments.iframe:
                            return <ExternalForm src={this.props.payments.iframe.src} method={method} transactionType={"deposit"}/>;
                    }
                })()
            }
        </div>
    );
};