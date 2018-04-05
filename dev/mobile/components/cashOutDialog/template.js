import React from 'react';
import Loader from "../../components/loader/";
import {t} from "../../../helpers/translator";
import Keyboard from "../../components/virtualKeyboard/";

module.exports = function CashOutDialogTemplate () {
    console.log("Cahsout dialog props", this.props);
    let cashOutValue = this.props.betHistory && this.props.betHistory.cashout && this.props.betHistory.cashout.amount;
    return <div className="cashout-dialog" onClick={(e) => {
        this.props.ui.showVirtualKeyBoard && !e.defaultPrevented && this.hideKeyboard();
    }}>
        <div className="cashout-column-view" >
            <div className="cashout-info-container">
            <p>{t("Bet id:")} {this.props.betId}</p>

            {this.props.swarmData.loaded.cashOut === false ? <Loader/> : null}

            {this.props.swarmData.data.cashOut && this.props.swarmData.data.cashOut.result && this.props.swarmData.data.cashOut.result !== "Ok" || this.props.swarmData.data.cashOut && this.props.swarmData.data.cashOut.result === "Fail"
                ? <div className="cashout-failed">
                    <p>{t("Cannot cash out")}</p>
                    {this.props.swarmData.data.cashOut.result_text && <p>{t(this.props.swarmData.data.cashOut.result_text)}</p>}
                    {/*{this.props.swarmData.dat.cashOut.result_text && this.props.swarmData.data.cashOut.result_text === "2425"}*/}
                    {/*<p>{t("Suggested amount:") + this.props.swarmData.data.cashOut.details.new_price} </p>*/}
                </div>
                : <div className="cashout-initial-price">
                    <p>{t("Amount: ") + cashOutValue}</p>
                </div>
            }
            {this.props.swarmData.data.cashOut && this.props.swarmData.data.cashOut.result === "Ok"
                ? <div className="cashout-success">
                    <p>{t("Cashout done!") + this.props.swarmData.data.cashOut.details.price} </p>
                </div>
                : null}
            {
                !(this.props.swarmData.data.cashOut && this.props.swarmData.data.cashOut.result === "Ok")
                    ? <div className="single-form-item" defaultValue={this.props.price}>
                        <span onClick={(e) => {
                            if (!this.props.ui.showVirtualKeyBoard) {
                                this.openKeyBoard(cashOutValue, this.setCashOutAmount(cashOutValue), null, e, this.hideKeyboard());
                            }
                        }}>{cashOutValue}</span>
                    </div>
                    : null
            }
            {
                !(this.props.swarmData.data.cashOut && this.props.swarmData.data.cashOut.result === "Ok")
                    ? <button className="button-view-normal-m" onClick={this.doCashOut} disabled={this.props.swarmData.loaded.cashOut === false}>{t("CashOut")}</button>
                    : null
            }
            </div>
        </div>
        {
            (() => {
                return this.props.ui.showVirtualKeyBoard ? <Keyboard settings={this.keyboardSettings} bindToElement={false} /> : (null);
            })()
        }
    </div>;
};
