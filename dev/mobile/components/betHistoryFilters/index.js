import {Component, PropTypes} from "react";
import {connect} from "react-redux";
import formsNames from "../../../constants/formsNames";
import {reduxForm} from 'redux-form';
import {predefinedDateRanges} from '../../../constants/balanceHistory';
import {SetBetHistoryFilters} from "../../../actions/betHistory";

const mapStateToProps = (state) => {
    return {
        initialValues: {
            ...state.betHistoryFilters
        },
        formValues: state.form && state.form[formsNames.betHistoryFiltersForm] && state.form[formsNames.betHistoryFiltersForm].values,
        filters: state.betHistoryFilters,
        pathName: state.routing.locationBeforeTransitions.pathname
    };
};

class BetHistoryFilters extends Component {
    constructor (props) {
        super(props);
        this.submit = this.submit.bind(this);
    }

    /**
     * @name submit
     * @description submit bet history filter
     * @returns {undefined}
     * */
    submit (values) {
        this.props.dispatch(SetBetHistoryFilters(this.processSubmittingData(values)));
    }

    /**
     * @name processSubmittingData
     * @description process submitting data and return submitted values
     * @param {object} values
     * @returns {object|undefined}
     * */
    processSubmittingData (values) {
        if (values.range !== "-1" && typeof values.range !== "undefined") {
            values.from_date = predefinedDateRanges[+values.range].fromDate;
            values.to_date = predefinedDateRanges[+values.range].toDate;
        }
        return values;
    }
    componentWillReceiveProps (nextProps) {
        if (this.props.formValues && this.props.formValues.range !== this.props.initialValues.range && this.props.pathName !== nextProps.pathName) {
            this.props.dispatch(SetBetHistoryFilters(this.processSubmittingData(this.props.formValues)));
        } else if (this.props.formValues && this.props.formValues.range === this.props.initialValues.range && this.props.pathName !== nextProps.pathName && this.props.initialValues.range === "-1" &&
            (this.props.formValues.from_date !== this.props.initialValues.from_date || this.props.formValues.to_date !== this.props.initialValues.to_date)) {
            this.props.dispatch(SetBetHistoryFilters(this.processSubmittingData(this.props.formValues)));
        }
    }
    render () {
        return Template.apply(this); //eslint-disable-line no-undef
    }
}

BetHistoryFilters.propTypes = {
    route: PropTypes.object,
    formValues: PropTypes.object,
    initialValues: PropTypes.object,
    pathName: PropTypes.string,
    unSettled: PropTypes.bool
};

export default connect(mapStateToProps)(reduxForm({form: formsNames.betHistoryFiltersForm})(BetHistoryFilters));