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
import React from 'react';
import {connect} from 'react-redux';
import cookie from 'react-cookie';
import Config from "../config/main";
import {RestoreLogin} from "../actions/login";
import {LoadPartnerConfig, LoadCurrencyConfig} from "../actions/initialData";
import {UISetLastRouteType, UISetCurrentRouteType, UISetPreviousPath, ClosePopup, OpenPopup} from "../actions/ui";
import Helpers from "../helpers/helperFunctions";
import moment from "moment";
import {langMapping} from "../constants/momentLocale";
import {t} from "../helpers/translator";
import {StoreHashParams} from "../actions/hashParams";
function mapStateToProps (state) {
    return {
        routeType: state.uiState.lastRouteType,
        appReady: state.appReady,
        lastRouteType: state.uiState.lastRouteType,
        currentRouteType: state.uiState.currentRouteType,
        persistentUIState: state.persistentUIState,
        profile: state.user.profile
    };
}

function getRouteType (loc) {
    return {
        "casino": "casino",
        "live-casino": "casino",
        "games": "casino",
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

const InitMixin = ComposedComponent => {
    class InitMixin extends React.Component {
        initialize () {
            Config.main.title && (document.title = t(Config.main.title));
            document.firstElementChild.setAttribute("dir", Config.main.availableLanguages[Config.env.lang].rtl ? "rtl" : "ltr");
            console.log("--- init ---", this.context);
            moment.locale(langMapping[Config.env.lang] || Config.env.lang);

            // Load partner config from swarm
            this.props.dispatch(LoadPartnerConfig()); //eslint-disable-line react/prop-types

            // Load currencies config from swarm
            this.props.dispatch(LoadCurrencyConfig()); //eslint-disable-line react/prop-types

            // Login user if there's a saved auth token in cookies
            let storedAuthData = cookie.load("authData");
            if (storedAuthData && storedAuthData.auth_token && storedAuthData.user_id) {
                this.props.dispatch(RestoreLogin(storedAuthData)); //eslint-disable-line react/prop-types
            }

            const prolongAuthCookieLifetime = () => {
                let authData = cookie.load("authData");
                if (authData) {
                    cookie.save('authData', authData, {
                        path: '/',
                        expires: new Date(Date.now() + Config.main.authSessionLifeTime * 1000)
                    });
                }
            };
            setInterval(prolongAuthCookieLifetime, (Config.main.authSessionLifeTime - 5) * 1000);

            this.context.router.listen((loc) => {
                this.props.dispatch(ClosePopup());  //close popup when route changes(e.g. when clicking "back")
                setLastRouteType.call(this, loc);
            });

            // legacy actions support
            let hashParams = Helpers.getHashParams();
            switch (hashParams.action) {
                case "reset_password":
                    this.props.dispatch(OpenPopup("ResetPasswordForm", hashParams));
                    break;
                default: break;
            }

            if (Object.keys(hashParams).length) {
                this.props.dispatch(StoreHashParams(hashParams));
            }
        }

        componentDidMount () {
            setLastRouteType.call(this, this.props.router.location);
        }

        componentWillReceiveProps (nextProps) {
            //eslint-disable-next-line react/prop-types
            if (this.props.location && this.props.location.pathname && nextProps.location && nextProps.location.pathname !== this.props.location.pathname) {
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
        router: React.PropTypes.object.isRequired
    };
    return connect(mapStateToProps)(InitMixin);
};

export default InitMixin;