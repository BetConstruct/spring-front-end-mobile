import React from 'react';
import Loader from "../../components/loader/";
import MoneyAmount from "../../components/moneyAmount/";
import {t} from "../../../helpers/translator";
import Keyboard from "../../components/virtualKeyboard/";

module.exports = function PartialCashOutDialogTemplate () {
    // console.log("Partial Cahsout dialog props", this.props);

    let cashOutValue = this.props.betHistory && this.props.betHistory.cashout && this.props.betHistory.cashout.amount;

    return <div className="cashout-dialog">
        <div className="cashout-column-view" onClick={(e) => {
            this.props.ui.showVirtualKeyBoard && !e.defaultPrevented && this.hideKeyboard();
        }}>
            <div className="cashout-info-container">
                <p>{t("Bet id:")} {this.props.betId}</p>

                {this.props.swarmData.loaded.cashOut === false ? <Loader/> : null}

                {this.props.swarmData.data.cashOut && this.props.swarmData.data.cashOut.result === "Fail"
                    ? <div className="cashout-failed">
                        <p>{t("Cannot cash out")} <MoneyAmount amount={this.props.price}/></p>
                        <p>{t("Suggested amount:")} <MoneyAmount amount={this.props.swarmData.data.cashOut.details.new_price}/></p>
                    </div>
                    : <div className="cashout-initial-price"><p>{t("Max Amount:")} <MoneyAmount amount={this.props.price}/></p></div>}

                {this.props.swarmData.data.cashOut && this.props.swarmData.data.cashOut.result === "Ok"
                    ? <div className="cashout-success">
                        <p>{t("Partial Cashout done!")} <MoneyAmount amount={this.props.swarmData.data.cashOut.details.price}/></p>
                    </div>
                    : null}
                {
                    !(this.props.swarmData.data.cashOut && this.props.swarmData.data.cashOut.result === "Ok")
                        ? <div className="single-form-item">
                            <span onClick={(e) => {
                                if (!this.props.ui.showVirtualKeyBoard) {
                                    this.openKeyBoard(cashOutValue, this.setCashOutAmount(cashOutValue), null, e, null);
                                }
                            }}>{cashOutValue || t("Amount")}</span>
                        </div>
                        : null
                }
                { !(this.props.swarmData.data.cashOut && this.props.swarmData.data.cashOut.result === "Ok")
                    ? <button className="button-view-normal-m" onClick={this.doPartialCashOut.bind(this)} disabled={this.props.swarmData.loaded.cashOut === false}>{t("CashOut")}</button>
                    : null}
                {
                    (() => {
                        return this.props.ui.showVirtualKeyBoard ? <Keyboard settings={this.keyboardSettings} bindToElement={false} /> : (null);
                    })()
                }
            </div>
        </div>
    </div>;
};
