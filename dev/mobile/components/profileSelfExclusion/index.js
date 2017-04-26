import React from 'react';
import {connect} from 'react-redux';
// import {SwarmDataMixin} from '../../../mixins/swarmDataMixin';
import {reduxForm} from 'redux-form';
import {SetUserLimits} from "../../../actions/user";
import formsNames from '../../../constants/formsNames';

const ProfileSelfExclusion = React.createClass({
    /**
     * @name submit
     * @description submit user's self exlusion period
     * @param values
     * @returns {undefined}
     */
    submit (values) {
        console.log("submit", values);
        this.props.dispatch(SetUserLimits("self-exclusion", {period: values.period}, formsNames.selfExclusionForm)); //eslint-disable-line react/prop-types
    },
    render () {
        return Template.apply(this); //eslint-disable-line no-undef
    }
});

function mapStateToProps (state) {
    return {
        // swarmData: state.swarmData,
        // profile: state.swarmData.data.profile,
        // user: state.user,
        ui: state.uiState,
        forms: state.form
    };
}

export default connect(mapStateToProps)(reduxForm({form: formsNames.selfExclusionForm})(ProfileSelfExclusion));

// export default connect(mapStateToProps)(SwarmDataMixin({
//     Component: reduxForm({form: "selfExclusion"})(ProfileSelfExclusion),
//     ComponentWillMount: function () {
//         // there's a problem, swarm response doesn't contain "data" field, instead data is in "details".
//         // Right now we don't need it, but if we need to implement deposit limits, we need to take this into account
//         this.swarmInitialDataRequest = {type: 'deposit'};
//         this.swarmInitialDataRequestCommand = 'user_limits';
//         this.swarmDataKey = "userLimits";
//     }
// }));