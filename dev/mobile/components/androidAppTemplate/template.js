import React from "react";
import {t} from "../../../helpers/translator";
import {ClosePopup} from "../../../actions/ui";
import Config from "../../../config/main";
import Helpers from "../../../helpers/helperFunctions";

module.exports = function AndroidAppTemplate () {

    /**
     * @name clickHandler
     * @description click handler for closing popup
     * @returns {undefined}
     * */
    const clickHandler = () => {
        this.props.dispatch(ClosePopup());
    };

    /**
     * @name downloadApp
     * @description redirecting to android application download links from config
     * @returns {undefined}
     * */
    const downloadApp = () => {
        window.location.href = (this.props.routeType === "casino" && Helpers.CheckIfPathExists(Config, "main.androidAppSettings.downloadLinkCasino"))
            ? Config.main.androidAppSettings.downloadLinkCasino
            : Config.main.androidAppSettings && Config.main.androidAppSettings.downloadLink;
    };
    return (
        this.props.routeType === "casino" && Helpers.CheckIfPathExists(Config, "main.androidAppSettings.downloadLinkCasino")
        ? <div className="get-app-for casino">
            <div className="phone-i-view" />
            <div className="info-new-version-b">
                <span>{t("We have developed Casino for Android to bring you even better betting experience")}</span>
            </div>
            <div className="download-links">
                <button onClick={downloadApp} className="button-view-normal-m">{t("Get the app")}</button>
                <button onClick={clickHandler} className="button-view-normal-m trans-m">{t("Skip")}</button>
            </div>
        </div>
        : <div className="get-app-for">
            <div className="phone-i-view " />
            <div className="info-new-version-b">
                <span>{t("We have developed Sportsbook for Android to bring you even better betting experience")}</span>
            </div>
            <div className="download-links">
                <button onClick={downloadApp} className="button-view-normal-m">{t("Get the app")}</button>
                <button onClick={clickHandler} className="button-view-normal-m trans-m">{t("Skip")}</button>
            </div>
        </div>
    );
};