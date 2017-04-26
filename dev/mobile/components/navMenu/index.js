import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import Config from "../../../config/main";
import gamesUrlFromHelpers from "../../../helpers/creationGamesUrl";
import {t} from "../../../helpers/translator";
import {connect} from "react-redux";
import {getAuthToken} from "../../../actions/poolBetting";

let casinoUrl = gamesUrlFromHelpers.processingCasinoUrl(),
    beloteUrl = gamesUrlFromHelpers.processingBeloteUrl(),
    backgammonUrl = gamesUrlFromHelpers.processingBackgammonUrl(),
    matchCenterUrl = gamesUrlFromHelpers.processingMatchCenterUrl();

/**
 * @name getMenuItem
 * @description A helper function to render navigation menu links.
 * @param {String} name of each navigation link
 * @returns {Object} React Element
 */
function getMenuItem (name) {
    let item;
    switch (name) {
        case "live":
            item = <Link to="/live" activeClassName="active">{t("Live-In-Play")}</Link>; break;
        case "prematch":
            item = <Link to="/prematch" activeClassName="active">{t("Pre-Match")}</Link>; break;
        case "casino":
            item = <Link to="/casino" activeClassName="active">{t("Casino")}</Link>; break;
        case "live-casino":
            item = <Link to="/live-casino" activeClassName="active">{t("Live Casino")}</Link>; break;
        case "games":
            item = <Link to="/games" activeClassName="active">{t("Games")}</Link>; break;
        case "belote(fromUrl)":
            item = <a href={beloteUrl} activeClassName="active">{t("Belote")}</a>; break;
        case "backgammon(fromUrl)":
            item = <a href={backgammonUrl} activeClassName="active">{t("Backgammon")}</a>; break;
        case "matchCenter(fromUrl)":
            item = <a href={matchCenterUrl} activeClassName="active">{t("Match Center")}</a>; break;
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

/**
 * @name renderLink
 * @description A helper function to render navigation menu links witch can have additional listeners such onClick ....
 * @param {String} name of each navigation link
 * @returns {Object} React Element
 */
function renderLink (name) {
    switch (name) {
        case "colossusBets":
            return (
                <a onClick={this.handlePoolBettingClick} href="javascript:;">
                    {t(Config.main.mainMenuItems[name].title)}
                </a>
            );
    }
    return (
        <a href={Config.main.mainMenuItems[name].link}
           target={Config.main.mainMenuItems[name].target}>
            {t(Config.main.mainMenuItems[name].title)}
        </a>
    );
}

const NavMenu = React.createClass({
    propTypes: {
        reallyLoggedIn: PropTypes.bool.isRequired,
        user: PropTypes.object.isRequired,
        navigationMenu: PropTypes.object.isRequired
    },

    /**
     * @name handlePoolBettingClick
     * @description Pool betting click handler function redirecting to pool betting url which have 2 types fun and real mode
     * @returns {undefined}
     */
    handlePoolBettingClick () {
        let url;
        if (this.props.reallyLoggedIn) {
            //eslint-disable-next-line react/prop-types
            let {props: {username: userName, unique_id: uniqueId, first_name: firstName, last_name: lastName, name, currency_name: currency}} = this;
            url = `${casinoUrl}/global/mplay1.php?gameid=CSB1&type=CSB&mode=real&token=${this.props.navigationMenu.poolBet.data}&lan=${Config.env.lang}&username=${userName}&userid=${uniqueId}&firstname=${firstName}&lastname=${lastName}&nickname=${name}&currency=${currency}&partnerid=${Config.main.site_id}`;
        } else {
            url = casinoUrl + '/global/mplay1.php?gameid=CSB1&type=CSB&mode=fun';
        }
        window.open(url, "_blank");
    },
    componentWillReceiveProps (nextProps) {
        if (nextProps.reallyLoggedIn && !this.props.reallyLoggedIn && !nextProps.navigationMenu.poolBet.loading && Config.main.mainMenuItems && Config.main.mainMenuItems.hasOwnProperty("colossusBets")) {
            this.props.dispatch(getAuthToken());
        }
    },
    shouldComponentUpdate (nextProps) {
        return this.props.reallyLoggedIn !== nextProps.reallyLoggedIn ||
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