import React from 'react';
import Loader from "../../components/loader/";
import DepositLimitationsForm from "./pices/depositLimitationForm";

module.exports = function profileDepositLimitationTemplate () {

    if (!(this.props.swarmData.loaded.userLimits && this.props.swarmData.data.userLimits)) {
        return <Loader />;
    }
    return (
        <div className="form-wrapper-v-m">
            <DepositLimitationsForm initialValues={this.props.initialValues}/>
        </div>
    );
};