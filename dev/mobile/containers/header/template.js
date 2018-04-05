import React from 'react';
import {Link} from 'react-router';
import Swipeable from 'react-swipeable';
import {t} from "../../../helpers/translator";
import {RenderOptions} from "../../../helpers/getPartnerRenderOptions";
import {
    checkPartnerExternalLinks, getExternalLink
} from "../../../helpers/checkPartnerIntegrationExternalLinks";

module.exports = function headerTemplate () {
    let {renderOptions} = RenderOptions;
    return (
        <div className={"header-wrapper-m " + (this.props.loggedIn ? "logged-in" : "")}>
            <div className="import-view-container">
                <div className="header-construction">
                    <div className="header-separator-m">
                        {
                            renderOptions.disableLeftMenu
                                ? (null)
                                : (
                                    <Swipeable className="sw-contain-b" onSwipingRight={this.props.openLeftMenu()}>
                                        <label className="left-top-nav" onClick={this.props.openLeftMenu()}>
                                            <span>{t("Menu")}</span>
                                        </label>
                                    </Swipeable>
                                )
                        }
                        {
                            renderOptions.disableLogo
                                ? (null)
                                : (
                                <Swipeable className="logo-wrapper-m" onSwipingRight={this.props.openLeftMenu()} onSwipingLeft={this.props.openRightMenu()}>
                                    {
                                        checkPartnerExternalLinks("logo")
                                            ? <a href={getExternalLink("logo")}>logo</a>
                                            : <Link to="/">logo</Link>
                                    }
                                </Swipeable>
                            )
                        }
                        {
                            renderOptions.disableRightMenu
                                ? (null)
                                : (
                                <Swipeable className="sw-contain-b" onSwipingLeft={this.props.openRightMenu()}>
                                    <label className="right-top-nav" onClick={this.props.openRightMenu()}>
                                        <span className={this.props.unreadCount ? "new_message_icon" : ''} />
                                    </label>
                                </Swipeable>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};
