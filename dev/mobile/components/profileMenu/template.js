import React from 'react';
import {Link} from 'react-router';
import Expandable from "../../containers/expandable/";
import {t} from "../../../helpers/translator";
import Config from "../../../config/main";

let profileConfigs = Config.main.rightMenu && Config.main.rightMenu.profile || null;
module.exports = function profileTemplate () {
    return (
        <div className="profile">
            <Expandable className="title-row-u-m" uiKey="rm_profile">
                <div className="icon-view-u-m profile-view-m"></div>
                <p><span>{t("My Profile")}</span></p>
                <i className="arrow-u-m"/>
            </Expandable>
            <div className="open-view-single-u-m">
                <ul>
                    <li>
                        <Link to="/profile/details" onClick={this.props.closeRightMenu()}>
                            <p className="name-sub-u-m-title">
                                <i className="arrow-u-m"/>
                                <span>{t("Personal details")}</span>
                            </p>
                        </Link>
                    </li>
                    <li>
                        <Link to="/profile/change-password" onClick={this.props.closeRightMenu()}>
                            <p className="name-sub-u-m-title">
                                <i className="arrow-u-m"/>
                                <span>{t("Change password")}</span>
                            </p>
                        </Link>
                    </li>
                    <li>
                        <Link to="/profile/verify" onClick={this.props.closeRightMenu()}>
                            <p className="name-sub-u-m-title">
                                <i className="arrow-u-m"/>
                                <span>{t("Verify account")}</span>
                            </p>
                        </Link>
                    </li>
                    {
                        profileConfigs && profileConfigs.exclude && profileConfigs.exclude.indexOf("self-exclusion") !== -1
                            ? (null)
                            : (
                            <li>
                                <Link to="/profile/self-exclusion" onClick={this.props.closeRightMenu()}>
                                    <p className="name-sub-u-m-title">
                                        <i className="arrow-u-m"/>
                                        <span>{t("Self-Exclusion")}</span>
                                    </p>
                                </Link>
                            </li>
                        )
                    }
                </ul>
            </div>
        </div>
    );
};
