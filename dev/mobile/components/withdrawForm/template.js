import React from 'react';
import {t} from "../../../helpers/translator";
import Loader from "../../components/loader";
import {Link} from "react-router";
import PaymentsNavigationMenu from "../../components/paymentsNavigationMenu";
import Config from "../../../config/main";

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
                    let withdrawInfoText = t(method.withdrawInfoTextKey) || "",
                        defaultValues = getDefaultValues();

                    withdrawInfoText = withdrawInfoText.split(" ").length > 1 ? withdrawInfoText : null;
                    switch (true) {
                        case !!method && !this.props.payments.nextStep && !method.hasBetShops:
                            return (
                                <div className="payments-form-wrapper animate-from-right-to-left">
                                    <div className="bread-crumbs-view-m">
                                        <Link to={`/balance/withdraw`}>
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
                                                <div className="payment-text-container" dangerouslySetInnerHTML={{__html: withdrawInfoText}}/>
                                                <p><i>{t("Service Fee:")} {paymentMethodInfoByCurrency.withdrawFee === 0 ? t("free") : `${paymentMethodInfoByCurrency.withdrawFee} ${currencyCode}`}</i></p>
                                                {limits ? (<p><i>{limits}</i></p>) : (null)}
                                            </li>
                                        </ul>
                                    </div>

                                    <form className="deposit-form-container">
                                        {defaultValues ? (
                                            <div className="details-form-item-m amount-b">
                                                <label>{t("Choose or enter withdraw amount")}</label>
                                                <div className="deposit-amount-buttons">
                                                    <ul>
                                                        {
                                                            defaultValues
                                                                .filter(value => (value <= this.props.payments.method.info[this.props.user.profile.currency_name].maxWithdraw && value >= this.props.payments.method.info[this.props.user.profile.currency_name].minWithdraw))
                                                                .map((value, index) => <li key={index}>
                                                                        <button type="button"
                                                                                onClick={ () => { this.props.handleDefaultAmountClick('' + value); } }
                                                                                className={(this.props.forms.withdrawForm && this.props.forms.withdrawForm.values && this.props.forms.withdrawForm.values.amount === ('' + value)) ? 'button-view-normal-m' : 'button-view-normal-m trans-m'}>
                                                                            {value} {currencyCode}
                                                                        </button>
                                                                    </li>
                                                                )
                                                        }
                                                    </ul>
                                                </div>
                                            </div>
                                        ) : (null)}
                                        {
                                            method.withdrawFormFields.map((field, index) => {
                                                return (
                                                    <div className="details-form-item-m" key={index}>
                                                        <label>{t(field.label)}</label>
                                                        {
                                                            this.props.getFormItem(field, index)
                                                        }
                                                    </div>
                                                );
                                            })
                                        }

                                        <div className="separator-box-buttons-m">
                                            <button onClick={this.props.handleSubmit(this.props.submitHandler)} disabled={this.props.submitting || this.props.invalid} className="button-view-normal-m">{t("withdraw")}</button>
                                        </div>

                                    </form>

                                    { this.props.error
                                        ? <div className="login-error"><span>{this.props.error}</span></div>
                                        : null
                                    }
                                </div>
                            );

                        case !!method && !this.props.payments.nextStep && method.hasBetShops && this.props.payments.data.loaded:
                            return (
                                <div className="payments-form-wrapper animate-from-right-to-left">
                                    <div className="bread-crumbs-view-m">
                                        <Link to={`/balance/withdraw`}>
                                            <span className="back-arrow-crumbs"/>
                                        </Link>
                                        <p>
                                            <span>{t(method.displayName || method.name)}</span>
                                        </p>
                                    </div>

                                    <div className="single-payment-title">
                                        <ul>
                                            <li><div className="deposit-m-icon"/></li>
                                            <li>
                                                <div dangerouslySetInnerHTML={{__html: withdrawInfoText}}/>
                                                <p><i>{t("Service Fee:")} {paymentMethodInfoByCurrency.withdrawFee === 0 ? t("free") : `${paymentMethodInfoByCurrency.withdrawFee} ${currencyCode}`}</i></p>
                                                {limits ? (<p><i>{limits}</i></p>) : (null)}
                                            </li>
                                        </ul>
                                    </div>

                                    <form className="deposit-form-container">
                                        {
                                            this.props.payments.data.cities.map((region, index) => {
                                                let offices = region.betshops.map((office, officeIndex) => {
                                                    return this.props.getFormItem(office, officeIndex, true);
                                                });
                                                return (
                                                    <div className="details-form-item-m" key={index}>
                                                        <div className="betshop-list-v-m">
                                                        <label>{t(region.name)}</label>
                                                        {offices}
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        }

                                        {
                                            method.withdrawFormFields.map((field, index) => {
                                                return (
                                                    <div className="details-form-item-m" key={index}>
                                                        <label>{t(field.label)}</label>
                                                        {
                                                            this.props.getFormItem(field, index)
                                                        }
                                                    </div>
                                                );
                                            })
                                        }

                                        <div className="separator-box-buttons-m">
                                            <button onClick={this.props.handleSubmit(this.props.submitHandler)} disabled={this.props.submitting || this.props.invalid} className="button-view-normal-m">{t("withdraw")}</button>
                                        </div>

                                    </form>

                                    { this.props.error
                                        ? <div className="login-error"><span>{this.props.error}</span></div>
                                        : null
                                    }
                                </div>
                            );

                        case !!this.props.payments.nextStep:
                            return (
                                <div className="iframe-wrapper">
                                    <iframe src={this.props.payments.iframe.src} frameBorder="0"></iframe>
                                </div>
                            );
                    }
                })()
            }
        </div>
    );
};

