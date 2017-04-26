import React from 'react';
import InitMixin from "../../../mixins/initMixin";
import {OpenPopup, HideAndroidDownloadPopup} from "../../../actions/ui";
import {t} from "../../../helpers/translator";
import AndroidAppTemplate from "../../components/androidAppTemplate";
import Helpers from "../../../helpers/helperFunctions";
import Config from "../../../config/main";

const Layout = React.createClass({
    componentWillReceiveProps (nextProps) {
        if (!this.popupShowed) {
            let androidSettings = Config.main.androidAppSettings,
                dispatch = this.props.dispatch;
            //eslint-disable-next-line react/prop-types
            !this.props.persistentUIState.hideDownloadAppPopup &&
            //eslint-disable-next-line react/prop-types
            nextProps.appReady &&
            Helpers.isAndroid() &&
            androidSettings &&
            androidSettings.showAndroidAppDownloadPopup &&
            dispatch(
                OpenPopup("templateAsBody", {
                    title: t("App is available"),
                    type: "info",
                    body: AndroidAppTemplate(this),
                    additionalCloseCallback: () => {
                        dispatch(HideAndroidDownloadPopup());
                    }
                })) &&
            (this.popupShowed = true);
        }
    },
    render () {
        return Template.apply(this); //eslint-disable-line no-undef
    }
});

export default InitMixin({Component: Layout});