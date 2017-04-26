import React from 'react';
import Config from "../../../config/main";
import {Field} from 'redux-form';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import {t} from "../../../helpers/translator";
import {mainTransactionTypes, casinoTransactionTypes, predefinedDateRanges} from "../../../constants/balanceHistory";
import Loader from "../../components/loader/";
import MoneyAmount from "../../components/moneyAmount/";

// must be defined outside of render method, see redux-form Field(stateless function) documentation

/**
 * @name datePicker
 * @description helper function to pick date and return it
 * @param {object} field
 * @returns {object}
 * */
let datePicker = field => {
    let {input} = field,
        isFromDate = input.name.indexOf("from") !== -1,
        date = moment(isFromDate ? new Date(Date.now() - 24 * 60 * 60 * 1000) : Date.now());

    return (
        <DatePicker
            selected={moment(input.value || date)}
            dateFormat="YYYY-MM-DD"
            dropdownMode="scroll"
            onChange={input.onChange}
        />
    );
};

module.exports = function balanceHistoryTemplate () {
    console.log(this.props);
    const transactionHighlightColors = {
        "0": "yellow", //new bet
        "1": "green", // winning bet
        "2": "red", // returned bet
        "5": "green", //bonus
        "14": "red", //withdrawal denied
        "17": "green", // pool bet win
        "18": "red",  // Pool Bet Return
        "23": "red", // In the process of revision
        "24": "red", // Bet Recalculation
        "29": "green", // Free Bet Bonus received
        "30": "green", //Wagering Bonus received
        "37": "red", // Declined Superbet
        "39": "yellow", // Bet on hold
        "40": "yellow", // Bet cashout
        "20": "green", // Fair Win
        "21": "red "// Fair Commission
    };
    let transactionTypes = (this.props.formValues && this.props.formValues.product === "Casino")
        ? Config.main.balanceHistoryCasinoSelectableTypes.map(type => <option value={type} key={type}>{t(casinoTransactionTypes[type])}</option>)
        : Config.main.balanceHistoryMainSelectableTypes.map(type => <option value={type} key={type}>{t(mainTransactionTypes[type])}</option>);
    return <div className="balance-view-wrapper">
        <div className="filter-view-b">
            <form onSubmit={this.props.handleSubmit(this.load)}>
                <div className="column-view-form-m">
                    <ul>
                        <li>
                            <div className="details-form-item-m">
                                <label>Type</label>
                                <div className="form-p-i-m">
                                    <div className="select-contain-m">
                                        <Field component="select" name="type">
                                            <option value="-1">{t("All")}</option>
                                            {transactionTypes}
                                        </Field>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div className="details-form-item-m">
                                <label>{t("Category")}</label>
                                <div className="form-p-i-m">
                                    <div className="select-contain-m">
                                        <Field component="select" name="product">
                                            {!Config.disableSportsbook ? <option value="Sport">{t("Main")}</option> : null}
                                            <option value="Casino">{t("Casino")}</option>
                                        </Field>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>

                <div className="details-form-item-m">
                    <label>{t("Search Period")}</label>
                    <div className="form-p-i-m">
                        <div className="select-contain-m">
                            <Field component="select" name="range">
                                {predefinedDateRanges.map((range, index) => <option value={index} key={index}>{t(range.name)}</option>)}
                                <option value={-1}>{t("Custom range")}</option>
                            </Field>
                        </div>
                    </div>
                </div>

                {(this.props.formValues && this.props.formValues.range === "-1") ? <div className="column-view-form-m">
                            <div className="details-form-item-m">
                                <label>{t("From")}</label>
                                <div className="date-picker-wrapper">
                                    <Field name="from_date" component={datePicker}/>
                                </div>
                            </div>
                            <div className="details-form-item-m">
                                <label>{t("To")}</label>
                                <div className="date-picker-wrapper">
                                    <Field name="to_date" component={datePicker}/>
                                </div>
                            </div>
                </div> : null}
                <div className="details-form-item-m">
                    <button className="button-view-normal-m" type="submit">{t("Load")}</button>
                </div>
            </form>
        </div>
        {this.props.loaded
            ? <div className="history-results">
            {this.props.data.history && this.props.data.history.map((entry, i) => <div className="balance-history-inf-b" key={i}>
                    <div className="single-b-row-m">
                        <div className="balance-h-row-b">
                            <h5 className={transactionHighlightColors[entry.operation]}>
                                {t((this.selectedProduct === "Casino" ? casinoTransactionTypes : mainTransactionTypes)[entry.operation])}
                            </h5>
                            <span>{t("Amount")}</span>
                        </div>
                        {this.selectedProduct === "Casino" ? <div className="balance-h-row-casino-b">
                                <h5>{entry.game}</h5>
                        </div> : null}
                        <div className="balance-h-row-b">
                            <h6>ID: {entry.bet_id}</h6>
                            <p><MoneyAmount amount={entry.amount}/></p>
                        </div>
                    </div>

                    <div className="single-b-row-m second-r-b">
                        <div className="balance-h-row-b">
                            <h5>{moment.unix(entry.date_time).format("DD/MM/YYYY")}</h5>
                            <span>{t("Final Balance")}</span>
                        </div>
                        <div className="balance-h-row-b">
                            <h6>{moment.unix(entry.date_time).format("HH:mm:ss")}</h6>
                            <p><MoneyAmount amount={entry.balance}/></p>
                        </div>
                    </div>
                </div>
            )}
            {this.props.data.history && this.props.data.history.length === 0 ? <p className="no-transactions">{t("No transactions in selected period.")}</p> : null}
            </div>
            : <Loader/>
        }
    </div>;

};
