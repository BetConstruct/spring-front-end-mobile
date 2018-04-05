import React from 'react';
import {t} from "../../../helpers/translator";
import LiveChat from "../../../components/liveChat/";
import Config from "../../../config/main";

module.exports = function footerTemplate () {
    return (
        <div className="footer-m">
            <div className="import-view-container">
                <div className="back-top-top-m">
                    <a onClick={this.toTop}>{t("Back to top")}</a>
                </div>
                <LiveChat/>
                {/*
                <div className="logo-f">
                    <Link to="/">Logotip</Link>
                </div>
                 */}
                {
                    Config.social && Config.social.enabled && <div className="social-icons-footer-m">
                        <ul>{Config.social.socialItems.map((item) => this.getSocialLinks(item))}</ul>
                    </div>
                }
            </div>
        </div>
    );
};
