import React from 'react';
import {connect} from 'react-redux';
import {SwarmDataMixin} from '../../../mixins/swarmDataMixin';

const profileDepositLimitation = React.createClass({
    render () {
        return Template.apply(this); //eslint-disable-line no-undef
    }
});

const getInitalData = (state) => {

    if (state.swarmData.loaded.userLimits && state.swarmData.data.userLimits) {
        return {
            daily: state.swarmData.data.userLimits.max_day_deposit,
            weekly: state.swarmData.data.userLimits.max_week_deposit,
            monthly: state.swarmData.data.userLimits.max_month_deposit
            /*  year: state.swarmData.data.max_year_deposit
             single: state.swarmData.data.max_single_deposit*/
        };
    }

    return {
        daily: "",
        weekly: "",
        monthly: ""
        /*   year: "",
         single: ""*/
    };
};

function mapStateToProps (state) {
    return {
        swarmData: state.swarmData,
        user: state.user,
        ui: state.uiState,
        forms: state.form,
        initialValues: getInitalData(state)
    };
}

export default connect(mapStateToProps)(SwarmDataMixin({
    Component: profileDepositLimitation,
    ComponentWillMount: function () {
        this.swarmInitialDataRequest = {type: 'deposit'};
        this.swarmInitialDataRequestCommand = 'user_limits';
        this.swarmDataKey = "userLimits";
        this.takeFromResponse = "details";
    }
}));