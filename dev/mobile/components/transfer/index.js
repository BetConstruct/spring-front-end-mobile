import React, {PropTypes} from 'react';
import {checkIfUserIsLoggedIn} from '../../../mixins/checkAuthentication';
import {connect} from 'react-redux';
import {reduxForm, SubmissionError, reset} from 'redux-form';
import formsNames from '../../../constants/formsNames';
import {changeTransferDestination} from '../../../actions/reduxForm';
import Validate from '../../../helpers/validate';
import {DoPaymentRequest} from '../../../actions/payments';
import {t} from '../../../helpers/translator';
import {types, alias} from '../../../constants/productTypes';
import {getErrorMessageByCode} from '../../../constants/errorCodes';
import {OpenPopup} from '../../../actions/ui';
import Config from '../../../config/main';

/**
 * @name validate
 * @description the validation of user min and max amount
 * @param {Object} time
 * @returns {Function}
 * */
const validate = (values, state) => {
    let max = state.user && state.user.profile
        ? values.from === types[0] ? state.user.profile.balance : state.user.profile.casino_balance
        : Infinity,
        errors = {},
        min = 1 / Math.pow(10, Config.main.balanceFractionSize || 0);

    Validate(values.amount, "amount", ["minAmount", min], errors);
    Validate(values.amount, "amount", ["maxAmount", max], errors);
    return errors;
};

/**
 * @name handleSubmissionErrors
 * @description get error message by code
 * @param code = 0
 * @returns {Function}
 * */
const handleSubmissionErrors = (code = 0) => {
    throw new SubmissionError({_error: t(getErrorMessageByCode(code))});
};

class Transfer extends React.Component {

    constructor (data) {
        super(data);
        this.submitHandler = this.submitHandler.bind(this);
        this.selectChangeHandler = this.selectChangeHandler.bind(this);
        this.processRequest = this.processRequest.bind(this);
    }

    /**
     * @name submitHandler
     * @description transfer handler submit function
     * @param {Object} values
     * @returns {Object}
     * */
    submitHandler (values) {
        let request = {
            "from_product": alias[values.from],
            "to_product": alias[values.to],
            "amount": parseInt(values.amount, 10)
        };
        return this.processRequest(request);
    }

    processRequest (request) {
        return DoPaymentRequest(request, "transfer")(this.props.dispatch).then(
            (data) => {
                if (data.result || (data.details && (data.details.code && data.details.error))) {
                    handleSubmissionErrors(data.result || (data.details && (data.details.code || data.details.error)));
                } else {
                    this.props.dispatch(OpenPopup("message", {
                        title: t("Success"),
                        type: "accept",
                        body: "Your transaction has been successfully completed"
                    }));
                    this.props.dispatch(reset(formsNames.transferForm));
                }
            }
        );
    }

    selectChangeHandler (value, field) {
        this.props.dispatch(changeTransferDestination(value, formsNames.transferForm, field));
    }

    render () {
        return checkIfUserIsLoggedIn(this.props.user, this.props.dispatch) || Template.apply(this); //eslint-disable-line no-undef
    }
}

const mapStateToProps = (state, ownParams) => {
    return {
        user: state.user,
        from_account: state.form[formsNames.transferForm] && state.form[formsNames.transferForm].values ? state.form[formsNames.transferForm].values.from || '' : '',
        forProduct: state.uiState.lastRouteType,
        initialValues: {
            from: types[0],
            to: types[1],
            amount: 0
        },
        ownParams
    };
};

Transfer.propTypes = {
    selectChangeHandler: PropTypes.func.isRequired,
    submitHandler: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    forProduct: PropTypes.string.isRequired
};

export default connect(mapStateToProps)(reduxForm({form: formsNames.transferForm, validate})(Transfer));