import React from 'react';
import PropTypes from 'prop-types';
import {Link} from "react-router";
import {t} from "../../../helpers/translator";

export default function ExternalForm ({src, transactionType, method}) {
    return (
        (
            <div className="payments-form-wrapper animate-from-right-to-left">
                <div className="bread-crumbs-view-m">
                    <Link to={`/balance/${transactionType}`}>
                        <span className="back-arrow-crumbs"/>
                    </Link>
                    <p>
                        <span>{t(method.displayName || method.name)}</span>
                    </p>
                </div>
                <div className="iframe-wrapper">
                    <iframe src={src} frameBorder="0" />
                </div>
            </div>
        )
    );
}

ExternalForm.propTypes = {
    src: PropTypes.string,
    transactionType: PropTypes.string,
    method: PropTypes.object
};