import React from 'react';
import {connect} from 'react-redux';
import cookie from 'react-cookie';
import Config from "../config/main";
import {RestoreLogin} from "../actions/login";
import {LoadPartnerConfig, LoadCurrencyConfig} from "../actions/initialData";
import {UISetLastRouteType, UISetCurrentRouteType, UISetPreviousPath, ClosePopup, OpenPopup, UIOpen} from "../actions/ui";
import Helpers from "../helpers/helperFunctions";
import moment from "moment";
import {langMapping} from "../constants/momentLocale";
import {t} from "../helpers/translator";
import {StoreHashParams} from "../actions/hashParams";
import PropTypes from 'prop-types';
import {VerifyUserByEmail} from "../actions/user";
import {init as ECInit, log as ECLog} from "../helpers/evercookie";

function mapStateToProps (state) {
    return {
        routeType: state.uiState.lastRouteType,
        appReady: state.appReady,
        lastRouteType: state.uiState.lastRouteType,
        currentRouteType: state.uiState.currentRouteType,
        persistentUIState: state.persistentUIState,
        profile: state.user.profile,
        preferences: state.preferences,
        user: state.user
    };
}

function getRouteType (loc) {
    return {
        "casino": "casino",
        "live-casino": "casino",
        "games": "casino",
        "free-quiz": "casino",
        "game": "sport",
        "": "sport",
        "live": "sport",
        "prematch": "sport",
        "history": "sport"
    }[loc.pathname.split("/")[1]];
}

function setLastRouteType (loc) {
    let type = getRouteType(loc);
    if (type !== undefined) {
        this.props.dispatch(UISetLastRouteType(type));
    }
    this.props.dispatch(UISetCurrentRouteType(type || ""));
}

function getAuthDataForPartnerIntegration (hashParams) {
    return {
        auth_token: Helpers.getUriParam("AuthToken") || hashParams.AuthToken,
        user_id: Helpers.getUriParam("UserId") || hashParams.UserId
    };
}

/**
 * InitMixin is a HOC(Higher Order Component) which adds init stuff to wrapped component
 *
 * component will wait for appReady to be set in store and then do the initialization,
 * which includes:
 *  - loading partner config from swarm
 *  - loading currency config from swarm
 *  - check if there's saved auth  token and try to log user in if it exists
 *  - set a timer to continuously prolong auth cookie lifetime while browser window is open
 *  - listen to route changes and close popup(if open) when route changes
 *
 * @param {Object} ComposedComponent
 * @constructor
 */
const InitMixin = ComposedComponent => {
    class InitMixin extends React.Component {
        initialize () {

            let key = Config.main.uiOpenKey;
            Config.main.title && (document.title = t(Config.main.title));
            key && this.props.dispatch(UIOpen(key));
            document.firstElementChild.setAttribute("dir", Config.main.availableLanguages[Config.env.lang] && Config.main.availableLanguages[Config.env.lang].rtl ? "rtl" : "ltr");
            moment.locale(langMapping[Config.env.lang] || Config.env.lang);

            // Load partner config from swarm
            this.props.dispatch(LoadPartnerConfig()); //eslint-disable-line react/prop-types

            // Load currencies config from swarm
            this.props.dispatch(LoadCurrencyConfig()); //eslint-disable-line react/prop-types

            // Login user if there's a saved auth token in cookies
            let storedAuthData = cookie.load("authData"),
                partnerIntegration = Config.isPartnerIntegration,
                hashParams = this.props.persistentUIState.hashParams || {};

            (!storedAuthData || getAuthDataForPartnerIntegration(hashParams).auth_token) && partnerIntegration && partnerIntegration.mode && (partnerIntegration.mode.iframe || partnerIntegration.needToLoginFromUrl) &&
            (storedAuthData = getAuthDataForPartnerIntegration(hashParams)) && storedAuthData.auth_token && prolongAuthCookieLifetime(storedAuthData, 60 * 60 * 1000);

            if (storedAuthData && storedAuthData.auth_token && storedAuthData.user_id) {
                this.props.dispatch(RestoreLogin(storedAuthData)); //eslint-disable-line react/prop-types
            }
            if (Helpers.CheckIfPathExists(this.props, "preferences.geoData.countryCode") && Helpers.CheckIfPathExists(Config, "main.regConfig.settings.WarningMessageForRestrictedIPPopup") && Config.main.regConfig.settings.WarningMessageForRestrictedIPPopup.indexOf(this.props.preferences.geoData.countryCode) !== -1) {
                this.props.dispatch(OpenPopup("message", {title: t("Warning"), type: "warning", body: t("You cannot Sign Up from Greece")}));
            }
            function prolongAuthCookieLifetime (auth, liveTime) {
                let authData = auth || cookie.load("authData");
                if (authData) {
                    cookie.save('authData', authData, {
                        path: '/',
                        expires: new Date(Date.now() + (liveTime || Config.main.authSessionLifeTime) * 1000)
                    });
                }
            }
            setInterval(prolongAuthCookieLifetime, (Config.main.authSessionLifeTime - 5) * 1000);
            ECInit(this.props); // EverCookie

            this.context.router.listen((loc) => {
                this.props.dispatch(ClosePopup(true));  //close popup when route changes(e.g. when clicking "back")
                setLastRouteType.call(this, loc);
            });

            // legacy actions support

            switch (hashParams.action) {
                case "register":
                    !this.props.user.reallyLoggedIn && setTimeout(() => {
                        this.props.dispatch(OpenPopup("RegistrationForm", hashParams));
                    });
                    break;
                case "login":
                    !this.props.user.reallyLoggedIn && setTimeout(() => {
                        this.props.dispatch(OpenPopup("LoginForm", hashParams));
                    });
                    break;
                case "reset_password":
                    setTimeout(() => {
                        this.props.dispatch(OpenPopup("ResetPasswordForm", hashParams));
                    });
                    break;
                case "verify":
                    setTimeout(() => {
                        this.props.dispatch(VerifyUserByEmail({
                            successCallback: () => this.props.dispatch(OpenPopup("message", {
                                title: t("E-Mail Confirmation"),
                                type: "accept",
                                body: t("Your E-mail Has been confirmed")
                            })),
                            errorCallback: () => this.props.dispatch(OpenPopup("message", {
                                title: t("E-Mail Confirmation"),
                                type: "error",
                                body: t("Error")
                            })),
                            params: hashParams
                        }));
                    });
                    break;

                default: break;
            }

            switch (true) {
                case hashParams.hasOwnProperty("casino"):
                    this.context.router.push("/casino");
                    break;
                case hashParams.hasOwnProperty("livedealer"):
                    this.context.router.push("/live-casino");
                    break;
                case hashParams.hasOwnProperty("sport") && (window.location.hash || "").indexOf("type=1") !== -1:
                    hashParams.hasOwnProperty("game") ? this.context.router.push("/live/game/" + hashParams.game) : this.context.router.push("/live");
                    break;
                case hashParams.hasOwnProperty("promos"):
                    Config.main.enablePromotionsMappingWithWeb && Helpers.getUriParam("news") ? this.context.router.push("/promo/" + Helpers.getUriParam("news")) : '';
                    break;
                case hashParams.hasOwnProperty("sport") && (window.location.hash || "").indexOf("type=0") !== -1:
                    hashParams.hasOwnProperty("game") ? this.context.router.push("/prematch/game/" + hashParams.game) : this.context.router.push("/prematch");
            }

            if (Object.keys(hashParams).length) {
                this.props.dispatch(StoreHashParams(hashParams));
            }

            /*if (hashParams.oddsType) {
                this.props.dispatch(PreferencesSet("oddsFormat", hashParams.oddsType))
            }*/
        }

        componentDidMount () {
            setLastRouteType.call(this, this.props.router.location);
        }

        componentWillReceiveProps (nextProps) {
            //eslint-disable-next-line react/prop-types
            if (this.props.location && this.props.location.pathname && nextProps.location && nextProps.location.pathname !== this.props.location.pathname) {
                // EverCookie logging on path change
                ECLog(this.props, this.props.location); //eslint-disable-line react/prop-types
                this.props.dispatch(UISetPreviousPath(this.props.location.pathname)); //eslint-disable-line react/prop-types
            }

            if (!this.props.appReady && nextProps.appReady) { //eslint-disable-line react/prop-types
                this.initialize();
            }
            // if (nextProps.profile && !this.haveProfile) {
            //     this.haveProfile = true;
            //
            // } else {
            //     this.haveProfile = false;
            // }
        }

        render () {
            // return connect(mapStateToProps)(<ComposedComponent.Component {...this.props} {...this.state} />);
            return <ComposedComponent.Component {...this.props} {...this.state} />;
        }
    }
    InitMixin.contextTypes = {
        router: PropTypes.object.isRequired
    };
    InitMixin.propTypes = {
        user: PropTypes.object,
        router: PropTypes.object,
        preferences: PropTypes.object
    };
    return connect(mapStateToProps)(InitMixin);
};

export default InitMixin;