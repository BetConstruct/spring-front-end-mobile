import React from "react";
import Loader from "../loader/index";
import {t} from "../../../helpers/translator";
import moment from "moment";
import Config from "../../../config/main";
import Helpers from "../../../helpers/helperFunctions";

module.exports = function withdrawsTemplate () {
    if (this.props.withdrawals.loading) {
        return <Loader />;
    }
    let sortByDate = Helpers.createSortingFn("date", false);
    let list = this.props.withdrawals.loaded && Array.isArray(this.props.withdrawals.data) && this.props.withdrawals.data.sort(sortByDate);
    if (!(list && list.length)) {
        list = <div>{t("You don't have any requests yet")}</div>;
    }
    return (
        <div className="deposits-wrapper">
            {
                <div className="deposit-methods">
                    {
                        list && list.constructor === Array
                            ? (
                                <div className="single-method-deposit transaction-l-v">
                                <ul>
                                    <li>
                                        <div className="transaction-date-id">
                                            <p>{t("Date")}</p><span>{t("ID")}</span>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="transaction-name-am-row">
                                            <div className="transaction-amount-v title-v">
                                                <p>{t("Amount")}</p>
                                            </div>
                                            <div className="transaction-payment-n"><p><i>{t("System")}</i></p></div>
                                        </div>
                                    </li>
                                    <li>
                                        { <p className="name-d-method"><i>{t("Status")}</i></p> }
                                    </li>
                                </ul>
                            </div>
                            )
                            : null
                    }
                    {
                        list && list.constructor === Array
                            ? list.map((transaction) => {
                                return (
                                <div className="single-method-deposit transaction-l-v">
                                    <ul>
                                        <li>
                                            <div className="transaction-date-id">
                                                <p>{moment.unix(transaction.date).format(Config.main.dateFormat)}</p><span>{t("ID")}: {transaction.id}</span>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="transaction-name-am-row">
                                                <div className="transaction-amount-v">
                                                    <p>{transaction.amount}</p>
                                                </div>
                                                <div className="transaction-payment-n"><p><i>{transaction.payment_system_name && t(transaction.payment_system_name)}</i></p></div>
                                            </div>
                                        </li>
                                        {
                                            Config.main.removeWithdrawCancelButton
                                                ? null
                                                : <li>
                                                    {
                                                        transaction.status === 0
                                                            ? (
                                                                <div className="deposit-method-b">
                                                                    {
                                                                        this.pandingCancelRequest && this.pandingCancelRequest.id === transaction.id
                                                                            ? <Loader />
                                                                            : <button className="button-view-normal-m" onClick={this.cancelWithdraw.bind(this, {id: transaction.id})} type="button">{t("Cancel")}</button>
                                                                    }
                                                                </div>
                                                            )
                                                            : (<p className="name-d-method"><i>{t(transaction.name)}</i></p>)
                                                    }
                                                </li>
                                        }
                                    </ul>
                                </div>
                                );
                            })
                            : React.isValidElement(list) ? list : null
                    }

                </div>
            }
        </div>
    );
};