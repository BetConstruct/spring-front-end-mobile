import React from "react";
import LoginForm from "../../components/loginForm/";
import ForgotPassword from "../../components/forgotPassword/";
import ResetPasswordForm from "../../components/resetPasswordForm/";
import RegistrationForm from "../../components/registrationForm/";
import GamePopup from "../../components/gamePopup/";
import CashOutDialog from "../../components/cashOutDialog/";
import CounterOfferDialog from "../../components/counterOfferDialog/";
import ConfirmDepositOrWithdraw from "../../components/confirmDepositOrWithdraw/";
import {t} from "../../../helpers/translator";

module.exports = function popupTemplate () {
    console.log("popup props", this.props);
    return (this.props.popup
            ? <div className={"popup-m" + (this.props.popupParams ? " message" : "")}>
            <div className="mini-box-popup">
                <div className="align-wrapper">
                    <div className="ver-center-view-b">
                        <div className="title-popup-page-m">
                            <h4>{
                                {
                                    LoginForm: t("Login"),
                                    RegistrationForm: t("Register"),
                                    ForgotPassword: t("Reset password"),
                                    CashOutDialog: t("CashOut"),
                                    CounterOfferDialog: t("SuperBet Counter-Offer"),
                                    ConfirmDeposit: t("Confirm Deposit"),
                                    ResetPasswordForm: t("Reset password"),
                                    GamePopup: "",
                                    ConfirmWithdraw: t("Confirm withdraw"),
                                    message: t(this.props.popupParams && this.props.popupParams.title),
                                    templateAsMessage: t(this.props.popupParams && this.props.popupParams.title),
                                    confirm: t(this.props.popupParams && this.props.popupParams.title)

                                }[this.props.popup]
                            }</h4>
                            <button className="popup-closed-b" onClick={this.props.closePopup()}/>
                        </div>
                        <div className="popup-content-view-m">
                            {(() => {
                                switch (this.props.popup) {
                                    case "CounterOfferDialog":
                                        return <CounterOfferDialog {...this.props.popupParams}/>;
                                    case "CashOutDialog":
                                        return <CashOutDialog {...this.props.popupParams}/>;
                                    case "LoginForm":
                                        return <LoginForm/>;
                                    case "ConfirmDeposit":
                                    case "ConfirmWithdraw":
                                        return <ConfirmDepositOrWithdraw/>;
                                    case "GamePopup":
                                        return <GamePopup/>;
                                    case "ForgotPassword":
                                        return <ForgotPassword/>;
                                    case "ResetPasswordForm":
                                        return <ResetPasswordForm {...this.props.popupParams}/>;
                                    case "RegistrationForm":
                                        return <RegistrationForm/>;
                                    case "message":
                                        return <div className={"popup-message " + this.props.popupParams.type} dangerouslySetInnerHTML={{__html: this.props.popupParams.body}}></div>;
                                    case "templateAsBody":
                                        return <div className={"popup-message " + this.props.popupParams.type} >{this.props.popupParams.body}</div>;
                                    case "iframe":
                                        return <div className="popup-iframe"><iframe src={this.props.popupParams.iframeUrl}/></div>;
                                    case "confirm":
                                        return <div className={"popup-confirm-message " + this.props.popupParams.type}>

                                                    <p dangerouslySetInnerHTML={{__html: this.props.popupParams.body}}/>
                                                    {this.props.popupParams.answers.map(answer =>
                                                    <div className="button-separator-view">
                                                        <button
                                                            onClick={this.answerDialog(this.props.popupParams.id, answer.value, this.props.popupParams.data)}
                                                            className={"button-view-normal-m " + answer.type}
                                                        >
                                                            {answer.title}
                                                        </button>
                                                    </div>
                                                    )}
                                        </div>;
                                    default:
                                        return null;
                                }
                            })() }
                        </div>
                    </div>
                </div>
            </div>
        </div>
            : null
    );
};
