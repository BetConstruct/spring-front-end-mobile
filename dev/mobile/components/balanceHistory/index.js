import React from 'react';
import {connect} from 'react-redux';
import {reduxForm} from 'redux-form';
import formsNames from "../../../constants/formsNames";
import {LoadBalanceHistory} from "../../../actions/balanceHistory";

import {predefinedDateRanges} from "../../../constants/balanceHistory";

const BalanceHistory = React.createClass({

    /**
     * @name load
     * @description function which loads balance history
     * @param values
     * @returns {undefined}
     * */
    load (values) {
        if (values.range !== "-1") {
            console.log("loading balance history for", predefinedDateRanges[values.range]);
            this.props.dispatch(LoadBalanceHistory(values.product, predefinedDateRanges[values.range], values.type));
        } else { //custom
            this.props.dispatch(LoadBalanceHistory(values.product, {fromDate: values.from_date, toDate: values.to_date}, values.type));
        }
        this.selectedProduct = values.product;
    },
    componentWillMount () {
        this.props.dispatch(LoadBalanceHistory(null, predefinedDateRanges[0], "-1"));
    },
    render () {
        return Template.apply(this); //eslint-disable-line no-undef
    }
});

const initialValues = {
    product: "Sport",
    type: "-1",
    range: 0,
    to_date: predefinedDateRanges[0].toDate,
    from_date: predefinedDateRanges[0].fromDate
};

function mapStateToProps (state) {
    return {
        data: state.swarmData.data.balanceHistory,
        loaded: state.swarmData.loaded.balanceHistory,
        initialValues,
        formValues: state.form.balanceHistory && state.form.balanceHistory.values,
        user: state.user
    };
}

export default connect(mapStateToProps)(reduxForm({form: formsNames.balanceHistoryForm})(BalanceHistory));