import React from 'react';
import Config from "../../../config/main";
import Helpers from "../../../helpers/helperFunctions";
import PropTypes from 'prop-types';

export default function SuitableApp ({ title }) {

    /**
     * @name clickHandler
     * @description click handler for android application link
     * @returns {undefined}
     * */
    function clickHandler () {
        let winAppStoreLink;
        switch (true) {
            case !!(Helpers.isAndroid() && Helpers.CheckIfPathExists(Config, "main.androidAppSettings.downloadLink")):
                window.location.href = Config.main.androidAppSettings.downloadLink;
                break;
            case !!(Helpers.isIos() && Helpers.CheckIfPathExists(Config, "main.iosAppSettings.appStoreLink")):
                winAppStoreLink = window.open(Config.main.iosAppSettings.appStoreLink, "_blank");
                winAppStoreLink.focus();
                break;
            default:
                return;
        }
    }

    return ((Helpers.isAndroid() && Helpers.CheckIfPathExists(Config, "main.androidAppSettings.downloadLink")) ||
    (Helpers.isIos() && Helpers.CheckIfPathExists(Config, "main.iosAppSettings.appStoreLink")))
        ? <a href="javascript:;" onClick={clickHandler}>{ title }</a>
        : null;
}

SuitableApp.propTypes = {
    title: PropTypes.string.isRequired
};