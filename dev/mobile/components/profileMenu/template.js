import React from 'react';
import {Link} from 'react-router';
import Expandable from "../../containers/expandable/";
import {t} from "../../../helpers/translator";
import Config from "../../../config/main";

module.exports = function profileTemplate () {
    return (
        <div className="profile">
            <Expandable className="title-row-u-m" uiKey="rm_profile">
                <div className="icon-view-u-m profile-view-m" />
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
                    {
                        Config.main.userSelfExclusion && Config.main.userSelfExclusion.enabled
                            ? (
                            <li>
                                <Link to="/profile/self-exclusion" onClick={this.props.closeRightMenu()}>
                                    <p className="name-sub-u-m-title">
                                        <i className="arrow-u-m"/>
                                        <span>{t("Self-Exclusion")}</span>
                                    </p>
                                </Link>
                            </li>
                        )
                            : (null)
                    }
                    {
                        Config.main.userTimeOut && Config.main.userTimeOut.enabled
                            ? (
                            <li>
                                <Link to="/profile/timeout-limits" onClick={this.props.closeRightMenu()}>
                                    <p className="name-sub-u-m-title">
                                        <i className="arrow-u-m"/>
                                        <span>{t("Timeout Limits")}</span>
                                    </p>
                                </Link>
                            </li>
                        )
                            : (null)
                    }
                    {
                        Config.main.realityChecks && Config.main.realityChecks.enabled
                            ? (
                                <li>
                                    <Link to="/profile/reality-checks" onClick={this.props.closeRightMenu()}>
                                        <p className="name-sub-u-m-title">
                                            <i className="arrow-u-m"/>
                                            <span>{t("Reality Checks")}</span>
                                        </p>
                                    </Link>
                                </li>
                            )
                            : (null)
                    }
                    {
                        Config.main.userDepositLimits && Config.main.userDepositLimits.enabled
                            ? (
                            <li>
                                <Link to="/profile/deposit-limits" onClick={this.props.closeRightMenu()}>
                                    <p className="name-sub-u-m-title">
                                        <i className="arrow-u-m"/>
                                        <span>{t("Deposit Limits")}</span>
                                    </p>
                                </Link>
                            </li>
                        )
                            : (null)
                    }
                    {
                        Config.main.disableDocumentPageInMyProfile
                            ? (null)
                            : (
                            <li>
                                <Link to="/profile/verify" onClick={this.props.closeRightMenu()}>
                                    <p className="name-sub-u-m-title">
                                        <i className="arrow-u-m"/>
                                        <span>{t("Verify account")}</span>
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
