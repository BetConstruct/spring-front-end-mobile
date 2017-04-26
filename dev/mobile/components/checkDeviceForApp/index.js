import React, {PropTypes} from 'react';
import Config from "../../../config/main";
import Helpers from "../../../helpers/helperFunctions";

export default function SuitableApp ({ title }) {

    /**
     * @name clickHandler
     * @description click handler for android application link
     * @returns {undefined}
     * */
    function clickHandler () {
        let winAppStoreLink;
        switch (true) {
            case !!(Helpers.isAndroid() && Config.main.androidAppSettings && Config.main.androidAppSettings.downloadLink):
                window.location.href = Config.main.androidAppSettings.downloadLink;
                break;
            case !!(Helpers.isIos() && Config.main.iosAppSettings && Config.main.iosAppSettings.appStoreLink):
                winAppStoreLink = window.open(Config.main.iosAppSettings.appStoreLink, "_blank");
                winAppStoreLink.focus();
                break;
            default:
                return;
        }
    }

    return ((Helpers.isAndroid() && Config.main.androidAppSettings && Config.main.androidAppSettings.showAndroidAppDownloadPopup) || (Helpers.isIos() && Config.main.iosAppSettings && Config.main.iosAppSettings.showIOSAppDownloadPopup)) ? <a href="javascript:;" onClick={ () => { clickHandler(); } }>{ title }</a> : null;
}



SuitableApp.propTypes = {
    title: PropTypes.string.isRequired
};