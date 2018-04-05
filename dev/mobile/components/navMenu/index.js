/**
 * @name getMenuItem
 * @description A helper function to render navigation menu links.
 * @param {String} name of each navigation link
 * @returns {Object} React Element
 */
import React from 'react';
import {Link} from 'react-router';
import Config from "../../../config/main";
import gamesUrlFromHelpers from "../../../helpers/creationGamesUrl";
import {t} from "../../../helpers/translator";
import {connect} from "react-redux";
import Helpers from "../../../helpers/helperFunctions";
import {getAuthTokenForGame} from "../../../actions/getAuthTokenForGame";
import PropTypes from 'prop-types';
import SuitableApp from "../checkDeviceForApp/";
import {loadingFailed} from "../../../actions/loadingStateForCasinoGames";
import {OpenPopup} from "../../../actions/ui";

let gameslinkObj = gamesUrlFromHelpers.processingGamesUrl();

function getMenuItem (name) {
    let item;
    switch (name) {
        case "live":
            item = <Link to="/live" activeClassName="active">{t("Live-In-Play")}</Link>;
            break;
        case "prematch":
            item = <Link to="/prematch" activeClassName="active">{t("Pre-Match")}</Link>;
            break;
        case "casino":
            item = <Link to="/casino" activeClassName="active">
                {t("Casino")}
                {Config.main.mainMenuItems && Config.main.mainMenuItems[name] && Config.main.mainMenuItems[name].hasOwnProperty("withSticker") && (<i className="new-sticker-view">{t(Config.main.mainMenuItems[name].withSticker)}</i>)}
                </Link>;
            break;
        case "live-casino":
            item = <Link to="/live-casino" activeClassName="active">{t("Live Casino")}</Link>;
            break;
        case "free-quiz":
            item = <Link to="/free-quiz" activeClassName="active">{t("Free Quiz")}</Link>;
            break;
        case "games":
            item = <Link to="/games" activeClassName="active">{t("Games")}</Link>;
            break;
        case "belote(fromUrl)":
            item = !this.props.reallyLoggedIn ? <a onClick={this.needToLogin}>{t("Belote")}</a> : <a href={gameslinkObj.beloteUrl}>{t("Belote")}</a>;
            break;
        case "backgammon(fromUrl)":
            item = <a href={gameslinkObj.backgammonUrl}>{t("Backgammon")}</a>;
            break;
        case "downloadApp":
            item = <SuitableApp key="checkDevice" title={t(Config.main.mainMenuItems[name].title)} />;
            break;
        case "matchCenter(fromUrl)":
            item = <a href={gameslinkObj.matchCenterUrl}>{t("Match Center")}</a>;
            break;
        default:
            item = Config.main.mainMenuItems[name]
                ? renderLink.call(this, name)
                : null;
    }
    if (Config.main.mainMenuItems && Config.main.mainMenuItems[name] && Config.main.mainMenuItems[name].hideBeforeLogin && !this.props.reallyLoggedIn) {
        return (null);
    }
    return <li key={name}>{item}</li>;
}
function loginerForGames (name, additional = [], menuItem) {
    let matched = false,
        readyChingaChoongUrl;
    switch (name) {
        case "poker":
            matched = true;
            additional.unshift(null, null, {token: "hash"});
            break;
        case "backgammon":
            matched = true;
            additional.unshift(";", "#", {token: "hash"});
            break;
        case "chingaChoong":
            matched = true;
            readyChingaChoongUrl = menuItem.link ? menuItem.link : gameslinkObj.chingaChoongUrl;
            additional.unshift(null, null, null, readyChingaChoongUrl);
            break;
    }
    !matched && additional.unshift(null, null, null);
    return [
        name,
        Config.main.mainMenuItems[name].params,
        ...additional
    ];
}

/**
 * @name renderLink
 * @description A helper function to render navigation menu links witch can have additional listeners such onClick ....
 * @param {String} name of each navigation link
 * @returns {Object} React Element
 */
function renderLink (name) {
    switch (name) {
        case "home":
            return (
                <a href={Helpers.getUriParam("back") || Config.main.mainMenuItems[name].link}
                   target={Helpers.getUriParam("back_target") || Config.main.mainMenuItems[name].target}>
                    {t(Config.main.mainMenuItems[name].title)}
                </a>
            );
        case "colossusBets":
        case "backgammon":
        case "belote":
        case "poker":
        case "betGame":
        case "chingaChoong":
            return (
                <a
                    onClick={
                        () => {
                            this.handleCasinoGameClick(...loginerForGames(name, [], Config.main.mainMenuItems[name]));
                        }
                    }
                    href="javascript:;">
                    {t(Config.main.mainMenuItems[name].title)}
                    {Config.main.mainMenuItems[name].hasOwnProperty("withSticker") ? (<i className="new-sticker-view">{t(Config.main.mainMenuItems[name].withSticker)}</i>) : (null)}
                </a>
            );
    }
    return (
        <a href={Config.main.mainMenuItems[name].link}
           target={Config.main.mainMenuItems[name].target}>
            {t(Config.main.mainMenuItems[name].title)}
            {Config.main.mainMenuItems[name].hasOwnProperty("withSticker") && (<i className="new-sticker-view">{t(Config.main.mainMenuItems[name].withSticker)}</i>)}
        </a>
    );
}

const NavMenu = React.createClass({
    propTypes: {
        reallyLoggedIn: PropTypes.bool,
        user: PropTypes.object.isRequired,
        navigationMenu: PropTypes.object.isRequired
    },
    needToLogin () {
        this.props.dispatch(OpenPopup("LoginForm"));
    },
    /**
     * @name handleCasinoGameClick
     * @description Casino game click handler function redirecting to pool betting url which have 2 types fun and real mode
     * @param {string} key
     * @param {object} params
     * @param {string} querySeparator
     * @param {string} switchQueryToHash
     * @param {object} descriptor
     * @returns {undefined}
     */
    handleCasinoGameClick (key, params, querySeparator, switchQueryToHash, descriptor, extraUrl) {
        let menuItem = Config.main.mainMenuItems[key];
        let generateQueryParamsFromObject = Helpers.generateQueryParamsFromObject,
            options = {};
        /*if (this.externalWindow && !this.externalWindow.closed) {
         return this.externalWindow.focus();
         } else {
         this.externalWindow && delete this.externalWindow;
         }*/
        if (this.props.reallyLoggedIn) {
            if (!this.props.navigationMenu.data[key] || !this.props.user.hasOwnProperty("profile")) {
                this.bufferedCallback = props => {
                    this.externalWindow &&
                    this.externalWindow.location &&
                    (this.externalWindow.location.href = generateQueryParamsFromObject(this.getOptionsForRealMode(key, props, params, descriptor),
                        extraUrl || (menuItem.direct ? menuItem.link : `${gameslinkObj.casinoUrl}/${Config.casino.gamesUrl}`), querySeparator, switchQueryToHash));
                };
                if (!menuItem.preLoadAuth) {
                    this.authRequiredKeys.indexOf(this.authRequiredKeys) === -1 && this.authRequiredKeys.push(key);
                    this.props.dispatch(getAuthTokenForGame(key, menuItem.id));
                }
                this.externalWindow = window.open("", "_black");
                return;
            }
            options = this.getOptionsForRealMode(key, null, params, descriptor);
        } else {
            options = {
                mode: "fun",
                lan: Config.env.lang,
                partnerid: Config.main.site_id,
                ...params
            };
        }
        this.externalWindow = window.open(generateQueryParamsFromObject(options,
            extraUrl || (menuItem.direct ? menuItem.link || gameslinkObj.chingaChoongUrl : `${gameslinkObj.casinoUrl}/${Config.casino.gamesUrl}`), querySeparator, switchQueryToHash), "_blank");
    },

    /**
     * @name getOptionsForRealMode
     * @description Collecting necessary data for colossus bet
     * @param {object} nextProps
     * @param {object} params
     * @param {object} descriptor
     * @returns {object}
     */
    getOptionsForRealMode (key, nextProps, params, descriptor = {}) {
        //eslint-disable-next-line react/prop-types
        let user = nextProps ? nextProps.user : this.props.user,
            {profile: {username: userName, unique_id: uniqueId, first_name: firstName, last_name: lastName, name, currency_name: currency}} = user,
            generated = {
                mode: "real",
                token: nextProps ? nextProps.navigationMenu.data[key] : this.props.navigationMenu.data[key],
                lan: Config.env.lang,
                username: userName,
                userid: uniqueId,
                firstname: firstName,
                lastname: lastName,
                nickname: name,
                currency: currency,
                partnerid: Config.main.site_id,
                ...params
            };

        descriptor && Object.keys(descriptor).map((key) => {
            generated[descriptor[key]] = generated[key];
            delete generated[key];
        });
        Config.main.mainMenuItems[key] && Config.main.mainMenuItems[key].resetToken && this.props.dispatch(loadingFailed(null, key));//reset auth token for game to load again on future
        return generated;
    },

    componentWillReceiveProps (nextProps) {
        let menuItems = Config.main.mainMenuItems;
        this.authRequiredKeys = this.authRequiredKeys || [];
        if (menuItems && nextProps.reallyLoggedIn && !this.props.reallyLoggedIn) {
            Object.keys(menuItems).map((key) => {
                nextProps.navigationMenu.loaded[key] === undefined &&
                !nextProps.navigationMenu.loading[key] &&
                !nextProps.navigationMenu.data[key] &&
                menuItems[key].preLoadAuth &&
                this.authRequiredKeys.push(key) !== undefined &&
                this.props.dispatch(getAuthTokenForGame(key, menuItems[key].id));
            });
        }
        if (typeof this.bufferedCallback === "function" && nextProps.reallyLoggedIn) {
            this.authRequiredKeys.map((key) => {
                if (nextProps.navigationMenu.data[key]) {
                    this.bufferedCallback(nextProps);
                    delete this.bufferedCallback;
                }
            });
        }
    },
    shouldComponentUpdate (nextProps) {
        return this.props.reallyLoggedIn !== nextProps.reallyLoggedIn ||
            this.props.user !== nextProps.user ||
            this.props.navigationMenu !== nextProps.navigationMenu;
    },
    render () {
        return (
            <div className="nav-bar-contain-m">
                <ul>{Config.main.mainMenuItemsOrder.map(getMenuItem.bind(this))}</ul>
            </div>
        );
    }
});

const mapStateToProps = (state) => {
    return {
        reallyLoggedIn: state.user.reallyLoggedIn,
        user: state.user,
        navigationMenu: state.navigationMenu
    };
};

export default connect(mapStateToProps)(NavMenu);