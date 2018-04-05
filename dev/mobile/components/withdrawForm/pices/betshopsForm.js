import React from 'react';
import PropTypes from 'prop-types';
import {Link} from "react-router";
import Loader from "../../loader/index";

export default function BetShopsForm ({t, method, infoText, transactionType, paymentMethodInfoByCurrency, limits, getFormItem, error, cities, currencyCode, handleSubmit, submitting, invalid, submitHandler}) {
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
                    <li><div className="deposit-m-icon" /></li>
                    <li>
                        <div dangerouslySetInnerHTML={{__html: infoText}}/>
                        <p><i>{t("Service Fee:")} {paymentMethodInfoByCurrency[`${transactionType}Fee`] === 0 && paymentMethodInfoByCurrency.hasOwnProperty(`${transactionType}Fee`) ? t("free") : `${paymentMethodInfoByCurrency[`${transactionType}Fee`]} ${currencyCode}`}</i></p>
                        {(limits ? (<p><i>{limits}</i></p>) : (null))}
                    </li>
                </ul>
            </div>

            <form className="deposit-form-container">
                {
                    cities.map((region, index) => {
                        let offices = region.betshops.map((office, officeIndex) => {
                            return getFormItem(office, officeIndex, true);
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
                                    getFormItem(field, index)
                                }
                            </div>
                        );
                    })
                }

                {
                    submitting
                        ? <Loader />
                        : (
                            <div className="separator-box-buttons-m">
                                <button onClick={handleSubmit(submitHandler)} disabled={submitting || invalid} className="button-view-normal-m">{t(transactionType)}</button>
                            </div>
                        )
                }

            </form>

            { error
                ? <div className="login-error"><span>{error}</span></div>
                : null
            }
        </div>
    );
}
BetShopsForm.propTypes = {
    cities: PropTypes.array,
    getFormItem: PropTypes.func,
    method: PropTypes.object,
    paymentMethodInfoByCurrency: PropTypes.object,
    currencyCode: PropTypes.string,
    transactionType: PropTypes.string,
    limits: PropTypes.string,
    infoText: PropTypes.string,
    t: PropTypes.func,
    error: PropTypes.object,
    handleSubmit: PropTypes.func,
    submitting: PropTypes.bool,
    invalid: PropTypes.bool,
    submitHandler: PropTypes.func
};