import React from "react";
import LoginForm from "../../components/loginForm/";
import ForgotPassword from "../../components/forgotPassword/";
import ResetPasswordForm from "../../components/resetPasswordForm/";
import RegistrationForm from "../../components/registrationForm/";
import GamePopup from "../../components/gamePopup/";
import CashOutDialog from "../../components/cashOutDialog/";
import PartialCashOutDialog from "../../components/partialCashOutDialog/";
import CounterOfferDialog from "../../components/counterOfferDialog/";
import ConfirmDepositOrWithdraw from "../../components/confirmDepositOrWithdraw/";
import {t} from "../../../helpers/translator";
import {checkPartnerExternalLinks} from "../../../helpers/checkPartnerIntegrationExternalLinks";

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
                                    PartialCashOutDialog: t("Partial Cash Out"),
                                    CounterOfferDialog: t("SuperBet Counter-Offer"),
                                    ConfirmDeposit: t("Confirm Deposit"),
                                    ResetPasswordForm: t("Reset password"),
                                    GamePopup: "",
                                    ConfirmWithdraw: t("Confirm withdraw"),
                                    message: t(this.props.popupParams && this.props.popupParams.title),
                                    templateAsMessage: t(this.props.popupParams && this.props.popupParams.title),
                                    confirm: t(this.props.popupParams && this.props.popupParams.title),
                                    accept_or_cancel: t(this.props.popupParams && this.props.popupParams.title)

                                }[this.props.popup]
                            }</h4>
                            <button className="popup-closed-b" onClick={this.props.closePopup()}/>
                        </div>
                        <div className="popup-content-view-m">
                            {(() => {
                                switch (true) {
                                    case this.props.popup === "CounterOfferDialog":
                                        return <CounterOfferDialog {...this.props.popupParams}/>;
                                    case this.props.popup === "CashOutDialog":
                                        return <CashOutDialog {...this.props.popupParams}/>;
                                    case this.props.popup === "PartialCashOutDialog":
                                        return <PartialCashOutDialog{...this.props.popupParams}/>;
                                    case this.props.popup === "LoginForm" && !checkPartnerExternalLinks("login"):
                                        return <LoginForm/>;
                                    case this.props.popup === "ConfirmDeposit":
                                    case this.props.popup === "ConfirmWithdraw":
                                        return <ConfirmDepositOrWithdraw/>;
                                    case this.props.popup === "GamePopup":
                                        return <GamePopup/>;
                                    case this.props.popup === "ForgotPassword" && !checkPartnerExternalLinks("forgotPassword"):
                                        return <ForgotPassword/>;
                                    case this.props.popup === "ResetPasswordForm" && !checkPartnerExternalLinks("resetPassword"):
                                        return <ResetPasswordForm {...this.props.popupParams}/>;
                                    case this.props.popup === "RegistrationForm" && !checkPartnerExternalLinks("registration"):
                                        return <RegistrationForm/>;
                                    case this.props.popup === "message":
                                        return <div className={"popup-message " + this.props.popupParams.type} dangerouslySetInnerHTML={{__html: this.props.popupParams.body}} />;
                                    case this.props.popup === "templateAsBody":
                                        return <div className={"popup-message app-info  " + this.props.popupParams.type} >{this.props.popupParams.body}</div>;
                                    case this.props.popup === "iframe":
                                        return <div className="popup-iframe"><iframe src={this.props.popupParams.iframeUrl}/></div>;
                                    case this.props.popup === "accept_or_cancel":
                                        return <div className={"popup-message accept_or_cancel " + this.props.popupParams.type}>
                                            <p dangerouslySetInnerHTML={{__html: this.props.popupParams.body}}/>
                                            <button className="button-view-normal-m" onClick={this.props.popupParams.accept_button_function}> {t(this.props.popupParams.accept_button)}</button>
                                            <button className="button-view-normal-m trans-m" onClick={this.props.closePopup()}> {t(this.props.popupParams.cancel_button)}</button>
                                        </div>;
                                    case this.props.popup === "confirm":
                                        return <div className={"popup-confirm-message " + this.props.popupParams.type} key="confirmPopup">
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
