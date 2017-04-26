import React, {PropTypes} from 'react';
import {t} from '../../../helpers/translator';
import PaymentsNavigationMenu from '../paymentsNavigationMenu/';
import {Field} from 'redux-form';
import {types} from '../../../constants/productTypes';
import Config from '../../../config/main';

const RenderSelectField = ({input, className, options, selected, handler}) => {
    return (
        <div className={className} key={name}>
            <div className="select-contain-m">
                <select {...input} selected={selected} onChange={(evt) => {
                    let value = options[1 - options.indexOf(evt.target.value)],
                        field = input.name === "from" ? "to" : "from";
                    handler(value, field);
                    input.onChange(evt.target.value);
                }}>
                    {
                        options.map((option, index) => (
                            <option key={index}
                                    value={option}>{t(option)}</option>
                        ))
                    }
                </select>
            </div>
        </div>
    );
};

const RenderInputField = ({ input, placeholder = '', disabled = '', className, type, meta: { touched, error } }) => {
    return (
        <div className={className} key={input.name}>
            <input
                {...input}
                placeholder={placeholder}
                type={type}
                disabled={disabled}
                onChange={ (evt) => {
                    input.onChange(parseInt(Number(evt.target.value), 10));
                } } />
            {touched && error && <p className="error-message">{error}</p>}
        </div>
    );
};

const renderSelectBoxesPart = (profile, handler) => {
    if (!profile) {
        return (null);
    }
    return (
        <div className="filter-view-b transfer-view-m">

            <div className="column-view-form-m">
                <ul>
                    <li>
                        <div className="details-form-item-m">
                            <label>{t("From")}</label>
                                <Field component={RenderSelectField}
                                       handler={handler}
                                       name={"from"}
                                       className={"form-p-i-m"}
                                       options={types}/>

                        </div>
                    </li>
                    <li>
                        <div className="details-form-item-m">
                            <label>{t("To")}</label>
                                <Field component={RenderSelectField}
                                       handler={handler}
                                       name={"to"}
                                       className={"form-p-i-m"}
                                       options={types}/>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    );
};

const renderBalancesPart = (profile) => {
    if (!profile) {
        return (null);
    }
    return (
        <div className="balances-wrapper">
            {
                profile.hasOwnProperty("balance")
                    ? renderAmountBox(profile.balance, "Main")
                    : (null)
            }
            {
                profile.hasOwnProperty("casino_balance")
                    ? renderAmountBox(profile.casino_balance, "Casino/Poker")
                    : (null)
            }
        </div>
    );
};

const renderAmountBox = (balance, label) => {
    return (
        <div className="amount-container">
            <h4 className="balance-view-t">
                <span>{t(label)}</span>
                <i>{ balance }</i>
            </h4>
        </div>
    );
};

const renderAmountInput = (options) => {
    return (
        <div className="details-form-item-m">
            <label>{t("Transfer amount")}</label>
            <Field
                component={RenderInputField}
                name="amount"
                type="number"
                className="single-form-item"
                placeholder={t("Transfer amount")}
                {...options}
            />
        </div>
    );
};

module.exports = function timeFilterTemplate () {
    let max = this.props.user && this.props.user.profile
            ? this.props.from_account === types[0] ? this.props.user.profile.balance : this.props.user.profile.casino_balance
            : Infinity,
        min = 1 / Math.pow(10, Config.main.balanceFractionSize || 0);

    return (
        <div className="deposit-view-wrapper">
            <div className="title-separator-contain-b">
                <h1>{t("payments")}</h1>
            </div>
            <PaymentsNavigationMenu />
            <div className="payments-form-wrapper">
                <form className="deposit-form-container">
                    { renderBalancesPart(this.props.user.profile) }

                    { renderSelectBoxesPart(this.props.user.profile, this.selectChangeHandler) }

                    { renderAmountInput({disabled: min > max ? 'disabled' : ''}) }

                    <div className="separator-box-buttons-m">
                        <button onClick={this.props.handleSubmit(this.submitHandler)}
                                disabled={this.props.submitting || this.props.invalid}
                                className="button-view-normal-m">{t("Submit")}</button>
                    </div>
                </form>

                { this.props.error
                    ? <div className="login-error"><span>{this.props.error}</span></div>
                    : null
                }
            </div>

        </div>
    );
};

RenderSelectField.propTypes = {
    input: PropTypes.object,
    meta: PropTypes.object,
    selected: PropTypes.string,
    className: PropTypes.string,
    handler: PropTypes.func.isRequired,
    options: PropTypes.array
};

RenderInputField.propTypes = {
    input: PropTypes.object,
    meta: PropTypes.object,
    className: PropTypes.string,
    placeholder: PropTypes.string,
    type: PropTypes.string,
    disabled: PropTypes.string.isRequired
};