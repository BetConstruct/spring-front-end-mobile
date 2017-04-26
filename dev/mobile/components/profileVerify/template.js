import React from 'react';
import Loader from "../../components/loader/";
// import Config from "../../../config/main";
import {t} from "../../../helpers/translator";
import formsNames from "../../../constants/formsNames";

module.exports = function profileVerifyTemplate () {
    console.log("profile verify props", this.props);
    let isUploadSupported = window.File && window.FileReader && window.FileList;

    function displayFailReason (response) {
        let reason;
        switch (response.code) {
            default: reason = response.msg;
        }
        return <div>
            <p>{t("There was an error during file upload, please try again.")}</p>
            <p>{reason}</p>
        </div>;
    }

    return <div className="profile-info-contain-m">
        <div className="top-profile-info">
            <p>{t("In order to verify your account, you should upload the document that proves your personal info.")}</p>
        </div>
        {isUploadSupported ? <div className="upload-file-info">
            <p>{t("Uploading a file be sure that your file type is JPG, PNG, GIF or PDF, where a file doesn't exceed 3Mb")}</p>
        </div> : null}

        {isUploadSupported
            ? <div className="profile-text-container-separator">
            <h3>{t("Proof of ID")}</h3>
            <p>{t("To verify your identity please upload a copy of your identification document.")}</p>
            <div className="profile-form-contain-m">
                {/* <h4>{t("Document type")}</h4> */}

                { (() => {
                    if (this.props.ui.loading[formsNames.uploadDocumentForm] === undefined || this.props.ui.failReason[formsNames.uploadDocumentForm]) {
                        return <div className="form-p-i-m">
                            {/* <div className="select-contain-m"><select><option>Passport</option></select></div> */}

                            <div className="imp-file-box">
                                <input type="file" name="file" id="file2" className="inputfile" ref="file" onChange={this.upload}/>
                                <label htmlFor="file2">
                                    <span>{t("Choose a file")}</span>
                                    <i>{t("Upload")}</i>
                                </label>
                            </div>
                            { this.props.ui.failReason[formsNames.uploadDocumentForm] ? displayFailReason(this.props.ui.failReason[formsNames.uploadDocumentForm]) : null}
                        </div>;
                    } else if (this.props.ui.loading[formsNames.uploadDocumentForm] === true) {
                        return <Loader/>;
                    } else {
                        return <div><p>{t("Your file successfully uploaded.")}</p></div>;
                    }
                })()}

            </div>
        </div>
            : <div className="upload-file-info">
            <p>{t("Your browser doesn't support file uploading, Please update or use Google Chrome.")}</p>
        </div>
        }

    </div>;
};
