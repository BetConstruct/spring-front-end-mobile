import React from 'react';
import Loader from "../../components/loader/";
import {t} from "../../../helpers/translator";
import Helpers from "../../../helpers/helperFunctions";

module.exports = function registrationFormTemplate () {
    let errors = this.props.getValidationErrors.call(this),
        fieldsArray = this.props.fieldsArray.call(this),
        getSingleComponent = this.props.getSingleComponent.call(this);

    fieldsArray = fieldsArray().sort(Helpers.byOrderSortingFunc);
    return (!this.props.user.loginInProgress
            ? <div className="popup-contain-table-m login-form-m registration-form-b">
                <div className="center-view-contain-form">
                    <div className="form-contain-box">
                        <form>
                            {
                                fieldsArray.map((field, index) => (
                                    getSingleComponent(field, index, errors, this.props.cmsData)
                                ))
                            }
                            <div className="separator-box-buttons-m">
                                <button className="button-view-normal-m"
                                        type="button"
                                        onClick={this.props.handleSubmit(this.props.submit.bind(this))}>{t("Register")}
                                </button>
                            </div>
                        </form>
                        { this.props.error
                            ? <div className="login-error"><span>{this.props.error}</span></div>
                            : null
                        }
                    </div>
                </div>
            </div>

            : <Loader/>
    );
};
