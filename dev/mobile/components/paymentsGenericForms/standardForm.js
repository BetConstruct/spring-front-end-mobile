import React from 'react';
import PropTypes from 'prop-types';
import {Link} from "react-router";
import Loader from "../loader/index";

export default function StandardForm ({formFields, getFormItem, t, transactionType, defaultValues, inlineStyle, method, currencyCode, hideButton, paymentMethodInfoByCurrency, limits, infoText, user, handleDefaultAmountClick, paymentForm, error, invalid, submitting, submitHandler, handleSubmit, rate}) {
    let paymentCurrencyCode = method.customCurrency && method.customCurrency.trim() ? method.customCurrency.trim() : currencyCode,
        customCurrencyFromRate = method.customCurrency && rate && rate[method.customCurrency],
        realAmount = paymentForm && paymentForm.values && paymentForm.values.amount,
        exchangedAmount = customCurrencyFromRate && (realAmount * customCurrencyFromRate.rate).toFixed(customCurrencyFromRate.rounding || 2),
        profileBalance = user.profile.balance,
        uniqueCustomCurrency = paymentCurrencyCode && paymentCurrencyCode !== user.profile.currency_name;
    let fields = formFields.map((field, index) => {
        return (
            <div className="details-form-item-m" key={index}>
                <label>{t(field.label)}</label>
                {
                    getFormItem(field, index, null, method.customCurrency && method.customCurrency.trim())
                }
            </div>
        );
    });
    function capitalizeFirstLetter (string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
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
                        <p><i>{t("Service Fee:")} {paymentMethodInfoByCurrency[`${transactionType}Fee`] && paymentMethodInfoByCurrency.hasOwnProperty(`${transactionType}Fee`) !== 0 ? `${paymentMethodInfoByCurrency[[`${transactionType}Fee`]]} ${paymentCurrencyCode}` : t("free")}</i></p>
                        {
                            (limits ? (<p><i>{limits}</i></p>) : (null))
                        }
                    </li>
                </ul>
            </div>

            <form className="deposit-form-container">
                {defaultValues && !hideButton ? (
                    <div className="details-form-item-m amount-b">
                        <label>{t(`Choose or enter ${transactionType} amount`)}</label>
                        <div className="deposit-amount-buttons">
                            <ul>
                                {
                                    defaultValues
                                        .filter(value => (value <= method.info[paymentCurrencyCode][`max${capitalizeFirstLetter(transactionType)}`] && value >= method.info[paymentCurrencyCode][`min${capitalizeFirstLetter(transactionType)}`]))
                                        .map((value, index) =>
                                            <li key={index}>
                                                <button type="button"
                                                        onClick={() => { handleDefaultAmountClick('' + value); }}
                                                        className={(paymentForm && paymentForm.values && paymentForm.values.amount === ('' + value)) ? 'button-view-normal-m' : 'button-view-normal-m trans-m'}>
                                                    {value} {paymentCurrencyCode}
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
                {transactionType === "withdraw" && (uniqueCustomCurrency && realAmount && customCurrencyFromRate && ((exchangedAmount <= profileBalance) && (realAmount >= method.info[paymentCurrencyCode][`min${capitalizeFirstLetter(transactionType)}`])))
                    ? (
                        <div className="details-form-item-m">
                            <span className="rate-section">{`${realAmount} ${customCurrencyFromRate.name} ≈ ${exchangedAmount} ${user.profile.currency_name}`}</span>
                        </div>
                    )
                    : (null)
                }
                {
                    submitting
                        ? <Loader />
                        : !hideButton
                            ? (
                                <div className="separator-box-buttons-m">
                                    <button onClick={handleSubmit(submitHandler)} disabled={invalid} className="button-view-normal-m">{t(transactionType)}</button>
                                </div>
                            )
                            : (null)
                }

            </form>

            { error
                ? <div className="login-error"><span>{error}</span></div>
                : null
            }
        </div>
    );
}

StandardForm.propTypes = {
    formFields: PropTypes.array,
    defaultValues: PropTypes.array,
    getFormItem: PropTypes.func,
    inlineStyle: PropTypes.func,
    handleDefaultAmountClick: PropTypes.func,
    method: PropTypes.object,
    paymentMethodInfoByCurrency: PropTypes.object,
    paymentForm: PropTypes.object,
    rate: PropTypes.object,
    user: PropTypes.object,
    currencyCode: PropTypes.string,
    limits: PropTypes.string,
    transactionType: PropTypes.string,
    infoText: PropTypes.string,
    t: PropTypes.func,
    handleSubmit: PropTypes.func,
    submitHandler: PropTypes.func,
    submitting: PropTypes.bool,
    invalid: PropTypes.bool,
    hideButton: PropTypes.bool,
    error: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool
    ])
};