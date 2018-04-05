import React from 'react';
import {Field} from 'redux-form';
import Loader from "../../components/loader/";
import {t} from "../../../helpers/translator";
import formsNames from '../../../constants/formsNames';
import {getErrorMessageByCode} from '../../../constants/errorCodes';
import Config from '../../../config/main';
import Helpers from "../../../helpers/helperFunctions";

module.exports = function profileTimeoutLimitationTemplate () {

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

    return <form onSubmit={this.props.handleSubmit(this.submit)}>
        <div className="self-exclusion-container-m">
            {
                t("time-out-text") !== "time-out-text"
                    ? (
                    <div dangerouslySetInnerHTML={{__html: t("time-out-text")}} />
                )
                    : (
                    <div>
                        <p>{t("If you want to take a short break from playing with us, you may do so by taking a Time-Out.")}</p>
                        <p>{t("Once you begin your Time-Out, you will no longer be able to deposit funds or play in any of our products.")}</p>
                        <p>{t("However, you will be able to withdraw any balance you may have.")}</p>
                    </div>
                )
            }
            <div className="self-exclusion-form-item-m">
                <div className="radio-form-item">
                    {
                        Helpers.CheckIfPathExists(Config, "main.userTimeOut.options") && Config.main.userTimeOut.options.map((option) => {
                            return <label><Field component="input" type="radio" name="period" value={option.limit.value}/><span>{t(option.name)}</span></label>;
                        })
                    }
                </div>
            </div>

            {this.props.submitting ? <Loader/> : null}
            <div className="separator-box-buttons-m">
                <button className="button-view-normal-m" disabled={this.props.submitting || this.props.pristine} type="submit">{t("Save")}</button>
                { this.props.ui.failReason[formsNames.timeOutLimitationForm] ? displayFailReason(this.props.ui.failReason[formsNames.timeOutLimitationForm]) : null}
                {(this.props.ui.loading[formsNames.timeOutLimitationForm] === false && !this.props.ui.failReason[formsNames.timeOutLimitationForm]) ? <div className="success"><p>{t("Done!")}</p></div> : null }
            </div>
        </div>
    </form>;
};
