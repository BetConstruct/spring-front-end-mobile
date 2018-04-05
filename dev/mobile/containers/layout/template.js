import React from "react";
import Header from "../header/";
import LeftMenu from "../../containers/leftMenu/";
import RightMenu from "../../containers/rightMenu/";
import Footer from "../footer/";
import Popup from "../popup/";
import NavigationMenuWrapper from "../../components/navigationMenuWrapper";
import Betslip from "../../components/betslip/";
import ProfileHandler from "../../components/userProfileSubscriber/";
import Loader from "../../components/loader/";
import {RenderOptions} from "../../../helpers/getPartnerRenderOptions";

module.exports = function layoutTemplate () {
    let {renderOptions} = RenderOptions;
    return (
        this.props.appReady // start rendering only when application is ready (translations/config/etc are loaded)
            ? <div className={`wrapper-m ${this.props.lastRouteType} ${renderOptions.disableHeader ? 'integration-view' : ''}`}>
                <div className="full-container-m">
                    {renderOptions.disableHeader ? (null) : <Header {...this.props}/>}
                    {renderOptions.disableNavigationMenu ? (null) : <NavigationMenuWrapper routeType={this.props.routeType}/>}
                    {renderOptions.disableLeftMenu ? (null) : <LeftMenu location={this.props.location} />}
                    {renderOptions.disableRightMenu ? (null) : <RightMenu />}
                    <div className="content-m">
                        {this.props.children}
                        {this.props.lastRouteType === "sport" ? <Betslip /> : null}
                        {this.props.user && !this.props.user.loginInProgress && this.props.user.loggedIn ? <ProfileHandler /> : (null)}
                    </div>
                    {renderOptions.disablePopups ? (null) : <Popup />}
                </div>
                {renderOptions.disableFooter ? (null) : <Footer {...this.props} />}
              </div>
            : <Loader/>
    );
};
