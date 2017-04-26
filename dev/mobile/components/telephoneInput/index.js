import React from 'react';
import ReactTelephoneInput from 'react-telephone-input';

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
                                     onChange={ this.handleChange }/>
                {error && touched && <p className="error-message">{error}</p>}
            </div>
        );
    }
}

TelephoneInput.propTypes = {
    input: React.PropTypes.object,
    value: React.PropTypes.object,
    onChange: React.PropTypes.func,
    onBlur: React.PropTypes.func,
    onFocus: React.PropTypes.func,
    touched: React.PropTypes.bool,
    error: React.PropTypes.string,
    className: React.PropTypes.string,
    defaultCountry: React.PropTypes.string,
    key: React.PropTypes.string
};

export default TelephoneInput;