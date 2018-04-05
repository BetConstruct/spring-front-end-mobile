import React from 'react';
import {t} from "../../../helpers/translator";

module.exports = function MethodItemsTemplate () {

    let method = this.props.method;
    /**
     * @name inlineStyle
     * @description  function for styling deposit methods
     * @param {Object} method
     * @returns {object}
     * */
    let inlineStyle = (method) => {
        return Object.assign({}, {backgroundImage: 'url(' + method.image + ')'});
    };

    return (
        <div className="single-method-deposit">
            <ul>
                <li>
                    <div className="deposit-m-icon" style={inlineStyle(method)}/>
                </li>
                <li>
                    <p className="name-d-method"><i>{t(method.displayName || method.name)}</i></p>
                </li>
                <li>
                    <div className="deposit-method-b">
                        <button className="button-view-normal-m" type="button"
                                onClick={ () => {
                                    this.props.selectMethod(method);
                                }}>
                            {(() => {
                                switch (this.props.forAction) {
                                    case "deposit":
                                        return t("Deposit");
                                    case "withdraw":
                                        return t("Withdraw");
                                    default:
                                        return t(this.props.forAction);
                                }
                            })()}
                        </button>
                    </div>
                </li>
            </ul>
        </div>
    );
}