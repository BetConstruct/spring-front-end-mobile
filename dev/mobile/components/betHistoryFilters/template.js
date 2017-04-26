import React from "react";
import {Field} from "redux-form";
import {t} from "../../../helpers/translator";
import {predefinedDateRanges} from "../../../constants/balanceHistory";
import moment from "moment";
import DatePicker from 'react-datepicker';

/**
 * @name datePicker
 * @description helper function to pick date and return it
 * @param {object} field
 * @returns {object}
 * */
let datePicker = field => {
    let {input, min, max} = field,
        isFromDate = input.name.indexOf("from") !== -1,
        date = moment(isFromDate ? new Date(Date.now() - 24 * 60 * 60 * 1000) : Date.now());

    return (
        <DatePicker
            maxDate={max ? moment(max) : null}
            minDate={min ? moment(min) : null}
            selected={moment(input.value || date)}
            dateFormat="YYYY-MM-DD"
            dropdownMode="scroll"
            onChange={input.onChange}
        />
    );
};

module.exports = function betHistoryFilters () {
    return (
        <div className="filter-view-b">
            <form onSubmit={this.props.handleSubmit(this.submit)}>
                <div className="details-form-item-m">
                    <label>{t("Search Period")}</label>
                    <div className="form-p-i-m">
                        <div className="select-contain-m">
                            <Field component="select" name="range">
                                {predefinedDateRanges.map((range, index) => <option value={index}
                                                                                    key={index}>{t(range.name)}</option>)}
                                <option value={-1}>{t("Custom range")}</option>
                            </Field>
                        </div>
                    </div>
                </div>

                {(this.props.formValues && this.props.formValues.range === "-1")
                    ? (
                    <div className="column-view-form-m">
                        <div className="details-form-item-m">
                            <label>{t("From")}</label>
                            <div className="date-picker-wrapper">
                                <Field name="from_date" defaultValue={this.props.filters.from_date || '0'}
                                       max={this.props.formValues.to_date || this.props.filters.to_date}
                                       component={datePicker}/>
                            </div>
                        </div>
                        <div className="details-form-item-m">
                            <label>{t("To")}</label>
                            <div className="date-picker-wrapper">
                                <Field name="to_date" defaultValue={this.props.filters.to_date}
                                       max={(() => {
                                           let current = new Date(this.props.formValues.from_date || this.props.filters.from_date);
                                           return current.setMonth(current.getMonth() + 1);
                                       })()}
                                       min={new Date(this.props.formValues.from_date || this.props.filters.from_date).getTime()}
                                       component={datePicker}/>
                            </div>
                        </div>
                    </div>
                )
                    : (
                        null
                )}
                <div className="details-form-item-m">
                    <button className="button-view-normal-m" type="submit"
                            disabled={this.props.submitting || this.props.pristine || !this.props.valid}>{t("Load")}</button>
                </div>
            </form>
        </div>
    );
};