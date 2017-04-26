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
        limits = this.props.getLimits(paymentMethodInfoByCurrency.minDeposit, paymentMethodInfoByCurrency.maxDeposit, currencyCode);

    /**
     * @name getDefaultValues
     * @description get default values of deposit methods
     * @returns {object}
     * */
    const getDefaultValues = () => {
        let defaults = paymentMethodInfoByCurrency.default || (defaultValuesForPartner || {})[currencyCode];
        if (defaults && defaults.deposit && defaults.deposit.length) {
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
                    let depositInfoText = t(method.depositInfoTextKey) || "",
                        defaultValues = getDefaultValues();

                    depositInfoText = depositInfoText.split(" ").length > 1 ? depositInfoText : null;
                    switch (true) {
                        case !!this.props.payments.iframe:
                            return (
                                <div className="iframe-wrapper">
                                    <iframe src={this.props.payments.iframe.src} frameBorder="0"></iframe>
                                </div>
                            );
                        case !!method && !this.props.payments.nextStep && !method.hasBetShops: {
                            let fields = method.depositFormFields.map((field, index) => {
                                return (
                                    <div className="details-form-item-m" key={index}>
                                        <label>{t(field.label)}</label>
                                        {
                                            this.props.getFormItem(field, index)
                                        }
                                    </div>
                                );
                            });
                            return (
                                <div className="payments-form-wrapper animate-from-right-to-left">
                                    <div className="bread-crumbs-view-m">
                                        <Link to={`/balance/deposit`}>
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
                                                <div className="payment-text-container" dangerouslySetInnerHTML={{__html: depositInfoText}}/>
                                                <p><i>{t("Service Fee:")} {paymentMethodInfoByCurrency.depositFee && paymentMethodInfoByCurrency.hasOwnProperty("depositFee") !== 0 ? `${paymentMethodInfoByCurrency.depositFee} ${currencyCode}` : t("free")}</i></p>
                                                {
                                                    (limits ? (<p><i>{limits}</i></p>) : (null))
                                                }
                                            </li>
                                        </ul>
                                    </div>

                                    <form className="deposit-form-container">
                                        {defaultValues && !method.hideDepositButton ? (
                                            <div className="details-form-item-m amount-b">
                                                <label>{t("Choose or enter deposit amount")}</label>
                                                <div className="deposit-amount-buttons">
                                                    <ul>
                                                        {
                                                            defaultValues
                                                                .filter(value => (value <= this.props.payments.method.info[this.props.user.profile.currency_name].maxDeposit && value >= this.props.payments.method.info[this.props.user.profile.currency_name].minDeposit))
                                                                .map((value, index) =>
                                                                    <li key={index}>
                                                                        <button type="button"
                                                                                onClick={() => { this.props.handleDefaultAmountClick('' + value); }}
                                                                                className={(this.props.forms.depositForm && this.props.forms.depositForm.values && this.props.forms.depositForm.values.amount === ('' + value)) ? 'button-view-normal-m' : 'button-view-normal-m trans-m'}>
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
                                            fields
                                        }
                                        {
                                            !method.hideDepositButton && (
                                                <div className="separator-box-buttons-m">
                                                    <button onClick={this.props.handleSubmit(this.props.submitHandler)} disabled={this.props.submitting || this.props.invalid} className="button-view-normal-m">{t("deposit")}</button>
                                                </div>
                                            )
                                        }

                                    </form>

                                    { this.props.error
                                        ? <div className="login-error"><span>{this.props.error}</span></div>
                                        : null
                                    }
                                </div>
                            );
                        }

                        case !!method && !this.props.payments.nextStep && method.hasBetShops && this.props.payments.data.loaded:
                            return (
                                <div className="payments-form-wrapper animate-from-right-to-left">
                                    <div className="bread-crumbs-view-m">
                                        <Link to={`/balance/deposit`}>
                                            <span className="back-arrow-crumbs"/>
                                        </Link>
                                        <p>
                                            <span>{t(method.displayName || method.name)}</span>
                                        </p>
                                    </div>

                                    <div className="single-payment-title">
                                        <ul>
                                            <li><div className="deposit-m-icon" /></li>
                                            <li>
                                                <div dangerouslySetInnerHTML={{__html: depositInfoText}}/>
                                                <p><i>{t("Service Fee:")} {paymentMethodInfoByCurrency.depositFee === 0 && paymentMethodInfoByCurrency.hasOwnProperty("depositFee") ? t("free") : `${paymentMethodInfoByCurrency.depositFee} ${currencyCode}`}</i></p>
                                                {
                                                    (limits ? (<p><i>{limits}</i></p>) : (null))
                                                }
                                            </li>
                                        </ul>
                                    </div>

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

                                    { this.props.error
                                        ? <div className="login-error"><span>{this.props.error}</span></div>
                                        : null
                                    }
                                </div>
                            );

                    }
                })()
            }
        </div>
    );
};

