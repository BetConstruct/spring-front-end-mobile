import React from 'react';
import {Link} from 'react-router';
import ProfileChangePassword from "../../components/profileChangePassword/";
import ProfileDetails from "../../components/profileDetails/";
import ProfileSelfExclusion from "../../components/profileSelfExclusion/";
import ProfileDepositLimitation from "../../components/profileDepositLimitation/";
import ProfileTimeoutLimitation from "../../components/profileTimeoutLimitation/";
import ProfileRealityChecks from "../../components/profileRealityChecks/";
import ProfileVerify from "../../components/profileVerify/";
import {t} from "../../../helpers/translator";
import Config from "../../../config/main";

module.exports = function profileTemplate () {
    return (
        <div className="profile-view-wrapper">
            <div className="title-separator-contain-b">
                <h1>{t("Profile")}</h1>
            </div>

            <div className="page-menu-contain">
                <ul>
                    <li>
                        <Link activeClassName="active" to="/profile/details"><span>{t("My Details")}</span></Link>
                    </li>
                    {
                        Config.main.disableDocumentPageInMyProfile
                            ? (null)
                            : (
                            <li>
                                <Link activeClassName="active" to="/profile/verify"><span>{t("Documents")}</span></Link>
                            </li>
                        )
                    }

                    {
                        Config.main.userSelfExclusion && Config.main.userSelfExclusion.enabled
                            ? (
                            <li>
                                <Link activeClassName="active" to="/profile/self-exclusion"><span>{t("Self Limits")}</span></Link>
                            </li>
                        )
                            : (null)

                    }
                    {
                        Config.main.userTimeOut && Config.main.userTimeOut.enabled
                            ? (
                            <li>
                                <Link activeClassName="active" to="/profile/timeout-limits"><span>{t("Timeout Limits")}</span></Link>
                            </li>
                        )
                            : (null)

                    }
                    {
                        Config.main.realityChecks && Config.main.realityChecks.enabled
                            ? (
                                <li>
                                    <Link activeClassName="active" to="/profile/reality-checks"><span>{t("Reality Checks")}</span></Link>
                                </li>
                            )
                            : (null)

                    }
                    {
                        Config.main.userDepositLimits && Config.main.userDepositLimits.enabled
                            ? (
                            <li>
                                <Link activeClassName="active" to="/profile/deposit-limits"><span>{t("Deposit Limits")}</span></Link>
                            </li>
                        )
                            : (null)

                    }
                    <li>
                        <Link activeClassName="active" to="/profile/change-password"><span>{t("Change password")}</span></Link>
                    </li>

                </ul>
            </div>
            {(() => {
                switch (this.props.route && this.props.route.path) {
                    case "details": return <ProfileDetails />;
                    case "verify": return <ProfileVerify />;
                    case "self-exclusion": return <ProfileSelfExclusion />;
                    case "timeout-limits": return <ProfileTimeoutLimitation />;
                    case "reality-checks": return <ProfileRealityChecks />;
                    case "deposit-limits": return <ProfileDepositLimitation />;
                    case "change-password": return <ProfileChangePassword />;
                    default: return null;
                }
            })()}
        </div>
    );
};
