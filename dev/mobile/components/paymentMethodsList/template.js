import React from 'react';
// import Helpers from "../../../helpers/helperFunctions";
// import Config from "../../../config/main";
import {t} from "../../../helpers/translator";
import PaymentsNavigationMenu from "../../components/paymentsNavigationMenu";
import Loader from "../loader";

MethodsListTemplate.propTypes = {
    selectMethod: React.PropTypes.func,
    methods: React.PropTypes.array
};

function MethodsListTemplate () {

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
        <div className="deposit-view-wrapper">
            <div className="title-separator-contain-b">
                <h1>{t("Payments")}</h1>
            </div>
            <PaymentsNavigationMenu />
            <div className="deposits-wrapper">
                {
                    this.props.payments.availableMethods.length
                        ? this.props.getFilteredMethods().map((method, index) => {
                            return <div className="deposit-methods" key={index}>
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
                                                            this.selectMethod(method);
                                                        }}>
                                                    {(() => {
                                                        switch (this.props.route.forAction) {
                                                            case "deposit": return t("Deposit");
                                                            case "withdraw": return t("Withdraw");
                                                            default: return t(this.props.route.forAction);
                                                        }
                                                    })()}
                                                </button>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>;
                        })
                        : <Loader />
                }
            </div>
        </div>
    );
}
module.exports = MethodsListTemplate;

