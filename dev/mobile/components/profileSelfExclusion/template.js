import React from 'react';
import {Field} from 'redux-form';
import Loader from "../../components/loader/";
import {t} from "../../../helpers/translator";
import formsNames from '../../../constants/formsNames';
import {getErrorMessageByCode} from '../../../constants/errorCodes';

module.exports = function profileSelfExclusionTemplate () {
    console.log("profileSelfExclusionTemplate props", this.props);

    /**
     * @name displayFailReason
     * @description self exclusion response , return message
     * @param {object} response
     * @returns {Object}
     * */
    function displayFailReason (response) {
        console.log("self exclusion failreason", response);
        let reason = t("Cannot set self-exclusion period, please try again later or contact support.") + " " + (response && getErrorMessageByCode(response));
        return <div className="error-text-contain"><p>{reason}</p></div>;
    }
    return <form onSubmit={this.props.handleSubmit(this.submit)}>
                <div className="self-exclusion-container-m">
                    <p>{t("You can exclude online for a minimum period of six months, once the six months has expired your account will be reactivated again.")}</p>
                    <p>{t("Please note that you'll be able to decrease the self-exclusion period only after seven days from your 1st request.")}</p>
                    <div className="self-exclusion-form-item-m">
                        <div className="radio-form-item">
                            <label><Field component="input" type="radio" name="period" value="6-month"/><span>{t("Self exclusion of six month period")}</span></label>
                            <label><Field component="input" type="radio" name="period" value="1-year"/><span>{t("Self exclusion of a one year period")}</span></label>
                            <label><Field component="input" type="radio" name="period" value="forever"/><span>{t("Forever")}</span></label>
                        </div>
                    </div>

                    {this.props.submitting ? <Loader/> : null}
                    <div className="separator-box-buttons-m">
                        <button className="button-view-normal-m" disabled={this.props.submitting || this.props.pristine} type="submit">{t("Save")}</button>
                        { this.props.ui.failReason[formsNames.selfExclusionForm] ? displayFailReason(this.props.ui.failReason[formsNames.selfExclusionForm]) : null}
                        {(this.props.ui.loading[formsNames.selfExclusionForm] === false && !this.props.ui.failReason[formsNames.selfExclusionForm]) ? <div className="success"><p>{t("Done!")}</p></div> : null }
                    </div>
                </div>
            </form>;
};
