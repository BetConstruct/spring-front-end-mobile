/**
 * Popup component.
 * Opens a popup when corresponding data exists in store.uiState.popup
 *
 * To open popup, an OpenPopup action has to be dispatched
 * OpenPopup action creator has 2 arguments:
 * key - the popup id. required. it can be one of predefined component names,
 *       like "LoginForm", "RegistrationForm", "ForgotPassword", "CashOutDialog", "CounterOfferDialog",
 *       or a generic message or confirmation dialog ("message" , "confirm", "iframe")
 * payload - additional data needed for "message", "confirm"  and "iframe" popups
 *
 * examples:
 *  - open login form popup: dispatch(OpenPopup("LoginForm"))
 *  - display a popup message:
 *      dispatch(OpenPopup("message",{title: t("Error occurred"),type: "error", body: t("There was an error, please contact support.")}));
 *      here "type" can have the following values: "error", "info", "warning" and corresponding icon will be shown
 * - display confirmation dialog:
 *     dispatch(OpenPopup("confirm", {
 *              id: "deleteMessage",
 *              type: "warning",
 *              body: t("Are you sure you want to delete this message?"),
 *              title: t("Delete message"),
 *              data: {messageId},
 *              answers: [
 *                  {title: t("Delete"), type: "warning", value: true},
 *                  {title: t("Cancel"), type: "cancel", value: false}
 *              ]
 *          }));
 * - open iframe in a popup:
 *     dispatch(OpenPopup("iframe", { titile: "google", iframeUrl: "http://www.google.com"}))
 *
 *   component that will have to receive the user's answer have to subscribe to store's ui.confirmation key
 *   when user clicks one of the buttons, the data is saved in ui.confirmation[<confirmation id>] (in this example confirmation id is "deleteMessage")
 *   the answer value is in ui.confirmation[<confirmation id>].answer
 *   IMPORTANT: after executing corresponding action, component must reset the confirmation state by calling dispatch(ConfirmationDialogReset(<confirmation id>));
 */
import {Component} from 'react';
import {connect} from 'react-redux';
import {ClosePopup, ConfirmationDialogAnswer} from "../../../actions/ui";
import {UIMixin} from '../../../mixins/uiMixin';
import {CmsLoadPage} from "../../../actions/cms";
import Config from "../../../config/main";
import {GetPopupsData} from "../../../helpers/selectors";
import cookie from 'react-cookie';
import {getPopupPayload} from "../../../helpers/cmsPopupsHelper";

class Popup extends Component {

    componentDidMount () {
        let exclude = "&exclude=author,excerpt,comments,comment_status,comment_count,tags,attachments" +
            (this.props.preferences.geoData && this.props.preferences.geoData.countryCode ? `&country=${this.props.preferences.geoData.countryCode}` : "") +
            "&is_mobile=1";
        Config.main.enableRuntimePopup &&
        this.props.dispatch(CmsLoadPage("popups", Config.env.lang, "popup", exclude));
    }

    componentWillReceiveProps (nextProps) {
        //ADDING CLASS TO BODY FOR CORRECT POPUP BEHAVIOR ON IPHONE 7
        let bodyElement = document.body;

        switch (nextProps.popup) {
            case "CounterOfferDialog":
            case "CashOutDialog":
            case "LoginForm":
            case "ConfirmDeposit":
            case "ConfirmWithdraw":
            case "GamePopup":
            case "ForgotPassword":
            case "RegistrationForm":
            case "message":
            case "iframe":
            case "confirm":
                bodyElement.className.indexOf("popup-opened-m") === -1 && (bodyElement.className += ' popup-opened-m');
                break;
            default:
                bodyElement.className = bodyElement.className.replace("popup-opened-m", "");
                break;
        }

        if (this.props.popup === "LoginForm" && nextProps.user.loggedIn) { //eslint-disable-line react/prop-types
            this.props.dispatch(ClosePopup());
        }

        if (!this.props.shouldOpen && nextProps.shouldOpen) {
            this.showRuntimePopup(nextProps.shouldOpen);
        }
    }
    showRuntimePopup (popup) {
        let loginStatus = parseInt(popup.login || 0),
            userTime = Date.now(),
            repeatType = popup.repeat_type || (popup.custom_fields && popup.custom_fields.repeat_type),
            customRepeat = popup.custom_repeat || (popup.custom_fields && popup.custom_fields.custom_repeat),
            lastShow = parseInt(((cookie.load('popup' + (popup.id || '')) || {}).showedTime), 10),
            expiryTime = 1;

        switch (repeatType) {
            case 'never':
                expiryTime = false;
                break;
            case 'once_a_day':
                expiryTime = 86400;
                break;
            case 'once_a_week':
                expiryTime = 604800;
                break;
            case 'once_a_month':
                expiryTime = 2592000;
                break;
            case 'custom':
                expiryTime = parseInt(customRepeat, 10) * 60;
                break;
        }

        if ((loginStatus === 0 && !Config.env.authorized) || (loginStatus === 1 && Config.env.authorized) || loginStatus === 2) {

            if (lastShow && expiryTime === false) {
                return;
            }

            if (!lastShow || userTime > lastShow + expiryTime || popup.slug === 'registration-popup') {
                this.props.openPopup("confirm", getPopupPayload(popup))();
                cookie.save('popup' + (popup.id || ''), {showedTime: userTime}, {path: '/', expires: new Date(userTime + Number(expiryTime))});
            }
        }

    }
    /**
     * @name answerDialog
     * @description Helper function which is preparing to answer dialog
     * @param {Number} dialogId
     * @param {*} answer
     * @param {Object} payload
     * @fire event:ConfirmationDialogAnswer
     * @fire event:ClosePopup
     */
    answerDialog (dialogId, answer, payload) {
        return () => {
            this.props.dispatch(ConfirmationDialogAnswer(dialogId, answer, payload));
            this.props.dispatch(ClosePopup());
        };
    }
    render () {
        return Template.apply(this); //eslint-disable-line no-undef
    }
}

export default connect(GetPopupsData)(UIMixin({Component: Popup}));