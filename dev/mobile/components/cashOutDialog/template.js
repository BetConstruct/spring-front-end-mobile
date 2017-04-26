import React from 'react';
import Loader from "../../components/loader/";
import MoneyAmount from "../../components/moneyAmount/";
import {t} from "../../../helpers/translator";

module.exports = function CashOutDialogTemplate () {
    console.log("Cahsout dialog props", this.props);
    return <div className="cashout-dialog">
                <div className="cashout-column-view">
                    <div className="cashout-info-container">
                    <p>{t("Bet id:")} {this.props.betId}</p>

                    {this.props.swarmData.loaded.cashOut === false ? <Loader/> : null}

                    {this.props.swarmData.data.cashOut && this.props.swarmData.data.cashOut.result === "Fail"
                        ? <div className="cashout-failed">
                            <p>{t("Cannot cash out")} <MoneyAmount amount={this.props.price}/></p>
                            <p>{t("Suggested amount:")} <MoneyAmount amount={this.props.swarmData.data.cashOut.details.new_price}/></p>
                        </div>
                        : <div className="cashout-initial-price"><p>{t("Amount:")} <MoneyAmount amount={this.props.price}/></p></div>}

                    {this.props.swarmData.data.cashOut && this.props.swarmData.data.cashOut.result === "Ok"
                        ? <div className="cashout-success">
                            <p>{t("Cashout done!")} <MoneyAmount amount={this.props.swarmData.data.cashOut.details.price}/></p>
                        </div>
                        : null}

                    { !(this.props.swarmData.data.cashOut && this.props.swarmData.data.cashOut.result === "Ok")
                        ? <button className="button-view-normal-m" onClick={this.doCashOut} disabled={this.props.swarmData.loaded.cashOut === false}>{t("CashOut")}</button>
                        : null}
                    </div>
            </div>
    </div>;
};
