import React from 'react';
import {Link} from 'react-router';
import ProfileChangePassword from "../../components/profileChangePassword/";
import ProfileDetails from "../../components/profileDetails/";
import ProfileSelfExclusion from "../../components/profileSelfExclusion/";
import ProfileVerify from "../../components/profileVerify/";
import {t} from "../../../helpers/translator";

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
                    <li>
                        <Link activeClassName="active" to="/profile/verify"><span>{t("Documents")}</span></Link>
                    </li>
                    <li>
                        <Link activeClassName="active" to="/profile/self-exclusion"><span>{t("Self Limits")}</span></Link>
                    </li>
                    <li>
                        <Link activeClassName="active" to="/profile/change-password"><span>{t("Change password")}</span></Link>
                    </li>

                </ul>
            </div>
            {(() => {
                switch (this.props.route && this.props.route.path) {
                    case "details": return <ProfileDetails/>;
                    case "verify": return <ProfileVerify/>;
                    case "self-exclusion": return <ProfileSelfExclusion/>;
                    case "change-password": return <ProfileChangePassword/>;
                    default: return null;
                }
            })()}
        </div>
    );
};
