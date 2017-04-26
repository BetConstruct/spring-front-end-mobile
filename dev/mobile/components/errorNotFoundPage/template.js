import React from 'react';
// import {Link} from 'react-router';
import {t} from "../../../helpers/translator";

module.exports = function notFoundTemplate () {
    return <div className="error-404-m">
        <h1>404</h1>
        <p>{t("Page not found")}</p>
        <div className="animation-error">
            <div className="error-icon-b"></div>
        </div>
    </div>;

};
