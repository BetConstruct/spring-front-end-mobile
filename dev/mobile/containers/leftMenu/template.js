import React from 'react';
import NavMenu from "../../components/navMenu/";
import LeftMenuSportsList from "../../components/leftMenuSportsList/";
import CasinoProvidersList from "../../components/casinoProvidersList/";
import Swipeable from 'react-swipeable';
import {t} from "../../../helpers/translator";

module.exports = function LeftMenuTemplate () {

    if (this.props.ui.lastRouteType === "sport") {
        // TODO: remove this regex if it causes performance issues. It's needed for selected sport highlighting in left menu
        var matchedSport = this.props.location.pathname.match(/(live|prematch)\/((?!game)\w*)/);
        matchedSport = matchedSport && matchedSport[2];
    }

    let isInSport = this.props.ui.lastRouteType === "sport" || this.props.ui.lastRouteType === "";
    let isInCasino = this.props.ui.lastRouteType === "casino";

    return (
        <div className={"left-nav-container-m" + (this.props.ui.opened && this.props.ui.opened.leftMenu ? " open" : "")}>
            <Swipeable className="closed-nav-icon" onClick={this.props.closeLeftMenu()} onSwipingLeft={this.props.closeLeftMenu()}/>
            <div className="right-trans-box-m"/>
            <div className="left-menu-full-box-m">
                <div className="import-view-container">

                    <div className="navigation-container-m site-navigate-m">
                        <NavMenu/>
                    </div>

                    <div className="navigation-container-m site-navigate-second-l-m">
                        <div className="nav-bar-contain-m">
                            <ul>
                                {isInSport ? <li><p>{t("Choose a sport")}</p></li> : null}
                                {isInCasino ? <li><p>{t("Choose a provider")}</p></li> : null}

                                {/* <li>
                                    <Link to="/live" activeClassName="active">Sport</Link>
                                </li>
                                <li>
                                    <Link to="/casino" activeClassName="active">Casino</Link>
                                </li>
                                <li>
                                    <Link to="/live-casino" activeClassName="active">Live Casino</Link>
                                </li> */}
                            </ul>

                        </div>

                    </div>
                    <Swipeable className="left-navigate-list-view-m" onSwipingLeft={this.props.closeLeftMenu()}>
                        {isInSport ? <LeftMenuSportsList isInLive={!!this.props.location.pathname.match("live")} sport={matchedSport}/> : null}
                        {isInCasino ? <CasinoProvidersList isInLive={!!this.props.location.pathname.match("live")} /> : null}
                    </Swipeable>
                </div>
            </div>
        </div>
    );
};
