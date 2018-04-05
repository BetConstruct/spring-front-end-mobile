import React from 'react';
import ReactTelephoneInput from 'react-telephone-input';
import PropTypes from 'prop-types';

class TelephoneInput extends React.Component {
    constructor (props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleFocus = this.handleChange.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
    }

    handleFocus () {
        this.props.onFocus();
    }

    handleBlur (val, selectedCountry) {
        this.props.onBlur({fullNumber: val, code: selectedCountry.dialCode, pattern: this.renderPatternFromFormat(selectedCountry.format)});
    }

    handleChange (val, selectedCountry) {
        let customFormat = this.props.customFormat;
        if (customFormat instanceof Object && selectedCountry.format !== customFormat.format && selectedCountry.iso2 === customFormat.iso2) {
            selectedCountry.format = customFormat.format;
        }
        val !== undefined && this.props.onChange({fullNumber: val, code: selectedCountry.dialCode, pattern: this.renderPatternFromFormat(selectedCountry.format)});
    }

    renderPatternFromFormat (format) {
        return ("." + format.replace(/\./g, '[0-9]') + "$").replace(/(\()/g, "\\(").replace(/(\))/g, "\\)");
    }

    render () {
        const {value, error, touched, key, className, defaultCountry} = this.props;

        return (
            <div key={key} className={className}>
                <ReactTelephoneInput value={value ? value.fullNumber || '' : ''}
                                     onFocus={ this.handleFocus }
                                     defaultCountry={ defaultCountry }
                                     onBlur={ this.handleBlur }
                                     onChange={ (evt) => {
                                         this.handleFocus(evt);
                                         this.handleChange(evt);
                                     } }/>
                {error && touched && <p className="error-message">{error}</p>}
            </div>
        );
    }
}

TelephoneInput.propTypes = {
    input: PropTypes.object,
    value: PropTypes.object,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    touched: PropTypes.bool,
    error: PropTypes.string,
    className: PropTypes.string,
    defaultCountry: PropTypes.string,
    key: PropTypes.string,
    customFormat: PropTypes.object
};

export default TelephoneInput;