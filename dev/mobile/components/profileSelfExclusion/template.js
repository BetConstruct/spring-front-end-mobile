import React from 'react';
import {Field} from 'redux-form';
import Loader from "../../components/loader/";
import {t} from "../../../helpers/translator";
import formsNames from '../../../constants/formsNames';
import {getErrorMessageByCode} from '../../../constants/errorCodes';
import Config from '../../../config/main';
import Helpers from "../../../helpers/helperFunctions";

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

                    {
                        t("self-exclusion-text") !== "self-exclusion-text"
                            ? <div dangerouslySetInnerHTML={{__html: t("self-exclusion-text")}} />
                            : (
                                <div>
                                    <p>{t("We will close your account, preventing access to your online account for the time period specified (between 6 months and 5 years).")}</p>
                                    <p>{t("Your account will only be re-opened if you contact us to request it after the Self-Exclusion period has expired.")}</p>
                                    <p>{t("Please note that you will be able to decrease your self-exclusion period or revoke it completely, only after seven days from your 1st request.")}</p>
                                    <p>{t("For further details please contact our support and refer to the Terms and Conditions and Responsible Gambling pages.")}</p>
                                </div>
                        )
                    }

                    <div className="self-exclusion-form-item-m">
                        <div className="radio-form-item">
                            {Helpers.CheckIfPathExists(Config, "main.userSelfExclusion.options") && Config.main.userSelfExclusion.options.map((option) => {
                                return <label><Field component="input" type="radio" name="period" value={option.limit.value}/><span>{t(option.name)}</span></label>;
                            })
                            }
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
