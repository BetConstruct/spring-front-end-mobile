import React from 'react';
import {Link} from 'react-router';
import Config from "../../../config/main";
import Loader from "../../components/loader/";
import Promotions from "../../components/promotions/";
import Balance from "../../components/balance/";
import ProfileMenu from "../../components/profileMenu/";
import Expandable from "../../containers/expandable/";
import LanguageSwitcher from "../../components/languageSwitcher/";
import OddFormatSwitcher from "../../components/oddFormatSwitcher/";
import {t} from "../../../helpers/translator";
import Swipeable from 'react-swipeable';
import ContentLink from '../../components/contentLink';
import RightMenuFooter from '../../components/rightMenuFooter';
import SuitableApp from '../../components/checkDeviceForApp';
import {getPageBySLug} from '../../../helpers/cms';
import {
    checkPartnerExternalLinks, getExternalLink
} from "../../../helpers/checkPartnerIntegrationExternalLinks";
let sportsbook = !!(Config.main.mainMenuItemsOrder && (Config.main.mainMenuItemsOrder.indexOf('prematch') !== -1 || Config.main.mainMenuItemsOrder.indexOf('live') !== -1));
module.exports = function RightMenuTemplate () {
    console.debug("right menu props", this.props.user);
    this.showTopPages = true;
    return (
        <div className={"right-nav-container-m" + (this.props.menuOpened ? " open" : "")}>
            <Swipeable className="closed-nav-icon" onClick={this.props.closeRightMenu()} onSwipingRight={this.props.closeRightMenu()}/>
            <div className="left-trans-box-m"/>
            {
                !this.props.menuOpened
                    ? null
                    : (
                        <div className="right-menu-full-box-m">

                        {/**/}
                        <Swipeable className="right-navigate-list-view-m" onSwipingRight={this.props.closeRightMenu()}>

                            { !this.props.user.loginInProgress
                                ? (this.props.user.loggedIn
                                    ? <div className="userMenu">
                                        {this.props.user.profile
                                            ? <div className="import-view-container">
                                                <div className="user-name-contain-m">
                                                    <div className="user-icon-m" />
                                                    <p className="user-name-title-m">{this.props.user.profile.username}</p>
                                                    <span className="user-id-m">{t("ID:")} {this.props.user.profile.id}</span>
                                                </div>
                                            </div> : null}

                                        <Balance/>

                                        <ProfileMenu/>
                                        {sportsbook
                                            ? <div className="history">
                                                <Expandable className="title-row-u-m" uiKey="rm_history">
                                                    <div className="icon-view-u-m history-view-m" /><p><span>{t("History")}</span></p><i className="arrow-u-m"/>
                                                </Expandable>
                                                <div className="open-view-single-u-m"><ul>
                                                    <li><Link to="/history/open-bets" onClick={this.props.closeRightMenu()}>
                                                        <p className="name-sub-u-m-title"><i className="arrow-u-m"/><span>{t("Open bets")}</span></p>
                                                    </Link></li>
                                                    <li><Link to="/history/bets" onClick={this.props.closeRightMenu()}>
                                                        <p className="name-sub-u-m-title"><i className="arrow-u-m"/><span>{t("Bet history")}</span></p>
                                                    </Link></li>
                                                </ul></div>
                                            </div> : null}

                                        {this.props.user.profile && !(Config.messages && Config.messages.disableMessages)
                                            ? <div className="messages">
                                                <Expandable className="title-row-u-m" uiKey="rm_messages">
                                                    <div className="icon-view-u-m messages-view-m"></div>
                                                    <p><span>{t("Messages")}{ this.props.user.profile.unread_count ? <i>{this.props.user.profile.unread_count}</i> : null }</span></p>
                                                    <i className="arrow-u-m"/>
                                                </Expandable>
                                                <div className="open-view-single-u-m">
                                                    <ul>
                                                        {!(Config.messages && Config.messages.disableInboxMessages)
                                                            ? <li><Link onClick={this.props.closeRightMenu()}
                                                                        to="/messages/inbox">
                                                                <p className="name-sub-u-m-title"><i
                                                                    className="arrow-u-m"/><span>{t("Inbox")}</span></p>
                                                            </Link></li>
                                                            : null
                                                        }
                                                        {!(Config.messages && Config.messages.disableSentMessages)
                                                            ? <li><Link onClick={this.props.closeRightMenu()}
                                                                        to="/messages/sent">
                                                                <p className="name-sub-u-m-title"><i
                                                                    className="arrow-u-m"/><span>{t("Sent")}</span></p>
                                                            </Link></li>
                                                            : null
                                                        }
                                                        {!(Config.messages && Config.messages.disableNewMessages)
                                                            ? <li><Link onClick={this.props.closeRightMenu()} to="/messages/new">
                                                                <p className="name-sub-u-m-title"><i className="arrow-u-m"/><span>{t("New message")}</span></p>
                                                            </Link></li>
                                                            : null
                                                        }
                                                    </ul>
                                                </div>
                                            </div> : null}
                                    </div>
                                    : <div className="import-view-container">
                                        <div className="sign-in-reg-buttons-m">
                                            <div className="separator-box-buttons-m sign-in-m">
                                                {!Config.main.disableRegisterButtons ? <label>{t("Already existing account?")}</label> : null}
                                                {
                                                    checkPartnerExternalLinks("login")
                                                        ? <a href={getExternalLink("login")}>{t("LOGIN")}</a>
                                                        : <button className="button-view-normal-m trans-m" onClick={this.props.openPopup("LoginForm")}>{t("LOGIN")}</button>
                                                }
                                            </div>
                                            {
                                                !Config.main.disableRegisterButtons && !(Config.main.regConfig && Config.main.regConfig.disabled)
                                                    ? (
                                                        <div className="separator-box-buttons-m">
                                                            <label>{t("New user?")}</label>
                                                            {
                                                                checkPartnerExternalLinks("registration")
                                                                    ? <a href={getExternalLink("registration")}>{t("JOIN NOW")}</a>
                                                                    : <button className="button-view-normal-m" onClick={this.props.openPopup("RegistrationForm")}>{t("JOIN NOW")}</button>
                                                            }
                                                        </div>
                                                    )
                                                    : null
                                            }
                                        </div>
                                    </div>)
                                : <Loader/>
                            }

                            <Promotions/>
                            <LanguageSwitcher mode={Config.main.languageSelectorMode}/>
                            {sportsbook ? <OddFormatSwitcher/> : null}
                            {/*Info menu*/}
                            <div className="import-view-container">
                                <div className="info-menu-contain-m">
                                    <ul>
                                        <li>
                                            {this.props.cmsData && this.props.cmsData.page && Config.main.rightMenuVisibleCMSContentLinksSlugs && Config.main.rightMenuVisibleCMSContentLinksSlugs.map(slug => {
                                                let page = getPageBySLug(this.props.cmsData.page, slug);
                                                this.showTopPages = this.showTopPages && !page;
                                                return page ? <Link
                                                    key={page.slug}
                                                    onClick={this.props.closeRightMenu()}
                                                    to={`/page/help-root-${this.props.preferences.lang}/${encodeURIComponent(page.title)}`}>
                                                    {t(page.title)}
                                                </Link> : null;
                                            })}
                                        </li>
                                        <li>
                                            {this.showTopPages && this.props.cmsData && this.props.cmsData.page && this.props.cmsData.page.children && this.props.cmsData.page.children.map(page => {
                                                return page && page.hasContent ? <Link
                                                    key={page.slug}
                                                    onClick={this.props.closeRightMenu()}
                                                    to={`/page/help-root-${this.props.preferences.lang}/${encodeURIComponent(page.slug || page.title)}`}>
                                                    {t(page.title)}
                                                </Link> : null;
                                            })}
                                        </li>
                                        <li>
                                            {Config.main.rightMenuContentLinks.map(item => {
                                                switch (item.type) {
                                                    case "cms": return null;
                                                    case "url": return <a key={item.link} onClick={this.props.closeRightMenu()} href={item.link} target={item.target || "_self"}>{t(item.title)}</a>;
                                                    case "support": return <ContentLink key={item.link} {...item} title={t(item.title)} isLiveChat={item.link === "contact-support"}/>;
                                                    case "checkDevice": return <SuitableApp key={item.type} title={t(item.title)} />;
                                                    default: return null;
                                                }
                                            })}
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <RightMenuFooter />
                            {/*Info menu END*/}

                            {this.props.user.loggedIn
                                ? <div className="log-out-b-m" onClick={this.logout}>
                                    <button >{t("Logout")}</button>
                                </div>
                                : null
                            }

                        </Swipeable>
                        {/**/}

                    </div>
                    )
            }
        </div>
    );
};
