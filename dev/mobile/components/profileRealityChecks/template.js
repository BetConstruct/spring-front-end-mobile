import React from 'react';
import {Field} from 'redux-form';
import Loader from "../../components/loader/";
import {t} from "../../../helpers/translator";
import formsNames from '../../../constants/formsNames';
import {getErrorMessageByCode} from '../../../constants/errorCodes';
import Config from '../../../config/main';

module.exports = function profileRealityChecksTemplate () {

    /**
     * @name displayFailReason
     * @description timeout limitation response , return message
     * @param {object} response
     * @returns {Object}
     * */
    function displayFailReason (response) {
        let reason = t("Error.") + " " + (response && getErrorMessageByCode(response));
        return <div className="error-text-contain"><p>{reason}</p></div>;
    }

    return <form onSubmit={this.props.handleSubmit(this.submit.bind(this))}>
        <div className="self-exclusion-container-m">
            {
                t("reality-checks-text") !== "reality-checks-text"
                    ? (
                        <div dangerouslySetInnerHTML={{__html: t("reality-checks-text")}} />
                    )
                    : (
                        <div>
                            <p>{t("We offer you an opportunity to manage the amount of time spent playing, by setting up a Reality Check on your account.")}</p>
                            <p>{t("Once you have saved your reality check time, you get a pop-up once this period has come up on the start of a casino session - placing a real money wager.")}</p>
                        </div>
                    )
            }
            <div className="self-exclusion-form-item-m">
                <div className="radio-form-item">
                    {
                        Config.main.realityChecks && Config.main.realityChecks.options.map((option) => {
                            return <label><Field component="input" type="radio" name="limit" value={option.value}/><span>{t(option.name)}</span></label>;
                        })
                    }
                </div>
            </div>

            {this.props.submitting ? <Loader/> : null}
            <div className="separator-box-buttons-m">
                <button className="button-view-normal-m" disabled={this.props.submitting || this.props.pristine} type="submit">{t("Save")}</button>
                { this.props.ui.failReason[formsNames.realityChecksForm] ? displayFailReason(this.props.ui.failReason[formsNames.realityChecksForm]) : null}
                {(this.props.ui.loading[formsNames.realityChecksForm] === false && !this.props.ui.failReason[formsNames.realityChecksForm]) ? <div className="success"><p>{t("Your Reality Check settings have been updated.!")}</p></div> : null }
            </div>
        </div>
    </form>;
};
