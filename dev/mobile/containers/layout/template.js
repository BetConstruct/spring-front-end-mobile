import React from "react";
import Header from "../header/";
import LeftMenu from "../../containers/leftMenu/";
import RightMenu from "../../containers/rightMenu/";
import Footer from "../footer/";
import Popup from "../popup/";
import Config from '../../../config/main';
import NavigationMenuWrapper from "../../components/navigationMenuWrapper";
import Betslip from "../../components/betslip/";
import Loader from "../../components/loader/";

module.exports = function layoutTemplate () {
    let renderOptions = {};
    if (Config.isPartnerIntegration && Config.isPartnerIntegration.mode) {
        let keys = Object.keys(Config.isPartnerIntegration.mode),
            length = keys.length,
            i = 0;

        for (; i < length; i++) {
            if (Config.isPartnerIntegration.mode[keys[i]]) {
                renderOptions = Config.isPartnerIntegration[keys[i]];
                break;
            }
        }
    }
    return (
        this.props.appReady // start rendering only when application is ready (translations/config/etc are loaded)
            ? <div className={`wrapper-m ${this.props.lastRouteType}`}>
                <div className="full-container-m">
                    {renderOptions.disableHeader ? (null) : <Header {...this.props}/>}
                    {renderOptions.disableNavigationMenu ? (null) : <NavigationMenuWrapper routeType={this.props.routeType}/>}
                    {renderOptions.disableLeftMenu ? (null) : <LeftMenu location={this.props.location} />}
                    {renderOptions.disableRightMenu ? (null) : <RightMenu />}
                    <div className="content-m">
                        {this.props.children}
                        {this.props.lastRouteType === "sport" ? <Betslip /> : null}
                    </div>
                    {renderOptions.disablePopups ? (null) : <Popup />}
                </div>
                {renderOptions.disableFooter ? (null) : <Footer {...this.props} />}
              </div>
            : <Loader/>
    );
};
