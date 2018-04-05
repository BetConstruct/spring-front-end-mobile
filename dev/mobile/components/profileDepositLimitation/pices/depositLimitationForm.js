import React, {Component} from "react";
import Validate from "../../../../helpers/validate";
import {t} from "../../../../helpers/translator";
import {SetUserLimits} from "../../../../actions/user";
import {connect} from "react-redux";
import {reduxForm, Field} from 'redux-form';
import formsNames from '../../../../constants/formsNames';
import {getErrorMessageByCode} from '../../../../constants/errorCodes';
import PropTypes from "prop-types";
import Loader from "../../../components/loader/";

/**
 * @name validate
 * @description check depositLimitation fields
 * @param {Object} values
 * @returns {Object}
 */
const validate = values => {
    const errors = {};

    Validate(values.daily, "daily", ["required", true], errors, t("This field is required"));
    Validate(values.weekly, "weekly", ["required", true], errors, t("This field is required"));
    Validate(values.monthly, "monthly", ["required", true], errors, t("This field is required"));

    return errors;
};

/**
 * @name displayFailReason
 * @description timeout limitation response , return message
 * @param {object} response
 * @returns {Object}
 * */
function displayFailReason (response) {
    let reason = t("Cannot set self-exclusion period, please try again later or contact support.") + " " + (response && getErrorMessageByCode(response));
    return <div className="error-text-contain"><p>{reason}</p></div>;
}

/**
 * @name amountNormalizer
 * @description Helper function for validation
 * @param {number|string} value
 * @returns {number|string}
 */
const amountNormalizer = (value, oldValue) => {
    if (value && ("" + value).length > 1 && ("" + value).match(/^0/) && ("" + value).indexOf(".") !== 1) {
        value = value.split("");
        value = value[1];
    }
    return isNaN(value) ? oldValue : value || "";
};

const RenderInputField = ({ input, placeholder = '', disabled = '', className, type, meta: { touched, error } }) => {
    return (
        <div className={className} key={input.name}>
            <input
                {...input}
                placeholder={placeholder}
                type={type}
                disabled={disabled}/>
            {touched && error && <p className="error-message">{error}</p>}
        </div>
    );
};

RenderInputField.propTypes = {
    input: PropTypes.object,
    meta: PropTypes.object,
    className: PropTypes.string,
    placeholder: PropTypes.string,
    type: PropTypes.string,
    disabled: PropTypes.string.isRequired
};

class DepositLimitationsForm extends Component {
    constructor () {
        super();
        this.submit = this.submit.bind(this);
    }
    /**
     * @name submit
     * @description submit user's self exlusion period
     * @param values
     * @returns {undefined}
     */
    submit (values) {
        let depositLimitsRequest = [
            {"deposit_limit": parseFloat(values.daily), "period_type": 2, "period": 1},
            {"deposit_limit": parseFloat(values.weekly), "period_type": 3, "period": 1},
            {"deposit_limit": parseFloat(values.monthly), "period_type": 4, "period": 1}
        ];
        this.props.dispatch(SetUserLimits("deposit-limits", {values: depositLimitsRequest}, formsNames.depositLimitationsForm)); //eslint-disable-line react/prop-types
    }
    render () {
        return (
            <form onSubmit={this.props.handleSubmit(this.submit)}>
                <div className="self-exclusion-container-m">
                    {
                        t("deposit-limitation-text") !== "deposit-limitation-text"
                            ? (
                            <div dangerouslySetInnerHTML={{__html: t("deposit-limitation-text")}} />
                        )
                            : (
                            <p>{t("Deposit limits allow you to limit the amount of funds you can deposit into the account. The amount can be chosen over a daily, weekly or monthly period. The deposit limit will allow you to restrict the amount of money entering your account, before betting takes place.")}</p>
                        )
                    }

                    <div className={"change-password-form-item-m"}>
                        <label>{t("Day")}</label>
                        <Field
                            name="daily"
                            component={RenderInputField}
                            type="text"
                            className="single-form-item"
                            normalize={amountNormalizer}
                        />
                    </div>
                    <div className={"change-password-form-item-m"}>
                        <label>{t("Week")}</label>
                        <Field
                            name="weekly"
                            component={RenderInputField}
                            type="text"
                            className="single-form-item"
                            normalize={amountNormalizer}
                        />
                    </div>
                    <div className={"change-password-form-item-m"}>
                        <label>{t("Month")}</label>
                        <Field
                            name="monthly"
                            component={RenderInputField}
                            type="text"
                            className="single-form-item"
                            normalize={amountNormalizer}
                        />
                    </div>

                    {this.props.submitting ? <Loader/> : null}
                    <div className="separator-box-buttons-m">
                        <button className="button-view-normal-m" disabled={this.props.submitting || this.props.pristine} type="submit">{t("Save")}</button>
                        { this.props.ui.failReason[formsNames.depositLimitationsForm] ? displayFailReason(this.props.ui.failReason[formsNames.depositLimitationsForm]) : null}
                        {(this.props.ui.loading[formsNames.depositLimitationsForm] === false && !this.props.ui.failReason[formsNames.depositLimitationsForm]) ? <div className="success"><p>{t("Done!")}</p></div> : null }
                        <div className="error-text-contain"><p>{t("Please note that you'll be able to increase your limits only after seven days from your 1st request.")}</p></div>
                    </div>
                </div>
            </form>
        );
    }
}

function mapStateToProps (state, ownParams) {
    return {
        swarmData: state.swarmData,
        user: state.user,
        ui: state.uiState,
        forms: state.form,
        initialValues: ownParams.initialValues
    };
}

export default connect(mapStateToProps)(reduxForm({form: formsNames.depositLimitationsForm, validate: validate})(DepositLimitationsForm));