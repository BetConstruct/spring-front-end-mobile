import React from 'react';
import {connect} from 'react-redux';
import {reduxForm} from 'redux-form';
import moment from 'moment';
import Config from "../../../config/main";
import {GetProfile} from "../../../helpers/selectors";
import {UpdateProfile} from "../../../actions/user";
import Validate from "../../../helpers/validate";
import formsNames from '../../../constants/formsNames';

const formName = "profileDetails";

let regFieldsAttrs = Object.keys(Config.main.regConfig.fields).reduce((acc, k) => { acc[Config.main.regConfig.fields[k].name] = Config.main.regConfig.fields[k].customAttrs; return acc; }, {});
let regFieldsValidationMessages = Object.keys(Config.main.regConfig.fields).reduce((acc, k) => { acc[Config.main.regConfig.fields[k].name] = Config.main.regConfig.fields[k].validationMessages; return acc; }, {});
let allFields = Config.main.personalDetails.editableFields.concat(Config.main.personalDetails.readOnlyFields).concat(Config.main.personalDetails.requiredFields).reduce((acc, f) => { acc[f] = null; return acc; }, {});


/**
 * @name getFieldProperties
 * @description get personal details fields properties and check requirements
 * @param {Object} props
 * @returns {Object|undefined}
 */
let getFieldProperties = (props) => {
    let fieldProperties = {};
    // collect all field names from editable, required and read only lists
    Config.main.personalDetails.editableFields.map(fieldName => {
        fieldProperties[fieldName] = fieldProperties[fieldName] || {};
        fieldProperties[fieldName].readOnly = false;
    });
    Config.main.personalDetails.readOnlyFields.map(fieldName => {
        fieldProperties[fieldName] = fieldProperties[fieldName] || {};
        // set read-only only if not required or not empty
        if (!(regFieldsAttrs[fieldName] && regFieldsAttrs[fieldName].required) || (props && props.profile && props.profile[fieldName])) {
            fieldProperties[fieldName].readOnly = true;
        }
    });
    Config.main.personalDetails.requiredFields.map(fieldName => {
        fieldProperties[fieldName].required = true;
    });
    return fieldProperties;
};



/**
 * @name validate
 * @description get personal details fields properties and check validations
 * @param {Object} vau
 * @returns {Object|undefined}
 */
const validate = values => {
    const errors = {};
    let fieldProperties = getFieldProperties();
    // add validations based on config
    Config.main.personalDetails.editableFields.map(fieldName => {
        if (fieldName === "password") {
            return; // we're not checking password requirements here, because user can have old password not meeting our new requirements
        }
        if (regFieldsAttrs[fieldName] && regFieldsAttrs[fieldName].maxlength) {
            Validate(values[fieldName], fieldName, ["maxlength", regFieldsAttrs[fieldName].maxlength], errors, regFieldsValidationMessages[fieldName] && regFieldsValidationMessages[fieldName].maxlength);
        }
        if (regFieldsAttrs[fieldName] && regFieldsAttrs[fieldName].minlength) {
            Validate(values[fieldName], fieldName, ["minlength", regFieldsAttrs[fieldName].minlength], errors, regFieldsValidationMessages[fieldName] && regFieldsValidationMessages[fieldName].minlength);
        }
        if (regFieldsAttrs[fieldName] && regFieldsAttrs[fieldName].regex) {
            Validate(values[fieldName], fieldName, ["regex", regFieldsAttrs[fieldName].regex], errors, regFieldsValidationMessages[fieldName] && regFieldsValidationMessages[fieldName].regex);
        }
    });
    Config.main.personalDetails.requiredFields.map(fieldName => Validate(values[fieldName], fieldName, "required", errors));
    if (fieldProperties.email && fieldProperties.email.required) {
        Validate(values.email, "email", "email", errors);
    }
    return errors;
};

/**
 * @name getProfileDetails
 * @description Selector. Returns fields from profile that have to be shown on profile page
 * @param {Object} profile object
 * @returns {Object}
 */
let getProfileDetails = (profile) => {
    if (!profile) {
        return profile;
    }
    let ret = Object.keys(allFields).reduce((acc, f) => { (allFields[f] !== undefined) && (acc[f] = profile[f]); return acc;}, {});
    ret.birth_date && (ret.birth_date = moment(ret.birth_date).format("YYYY-MM-DD"));
    return ret;
};

const ProfileDetails = React.createClass({

    /**
     * @name save
     * @description Change user profile details and update profile
     * @param {Object} values
     * @returns {Object|undefined}
     */
    save (values) {
        console.log("save", values);
        let data = {
            first_name: values.first_name,
            last_name: values.last_name,
            email: values.email,
            birth_date: moment(values.birth_date).format("YYYY-MM-DD"),
            country_code: values.country_code,
            gender: values.gender,
            password: values.password,
            doc_number: values.doc_number,
            phone: values.phone,
            city: values.city,
            address: values.address
        };
        console.log("data to send", data);
        this.props.dispatch(UpdateProfile(data, formName)); //eslint-disable-line react/prop-types
    },
    render () {
        this.fieldFroperties = getFieldProperties(this.props);
        return Template.apply(this); //eslint-disable-line no-undef
    }
});

function mapStateToProps (state) {
    return {
        preferences: state.preferences,
        profile: GetProfile(state),
        initialValues: getProfileDetails(GetProfile(state)),
        ui: state.uiState,
        forms: state.form
    };
}

export default connect(mapStateToProps)(reduxForm({form: formsNames.profileDetailsForm, validate})(ProfileDetails));