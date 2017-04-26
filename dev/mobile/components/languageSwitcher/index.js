import React from 'react';
import {connect} from 'react-redux';
import {PreferencesSet} from "../../../actions/";

const LanguageSwitcher = React.createClass({
    propTypes: {
        mode: React.PropTypes.string
    },
    render () {
        return Template.apply(this); //eslint-disable-line no-undef
    },

    /**
     * @name changeLanguage
     * @description set language
     * @returns {undefined}
     * */
    changeLanguage () {
        console.log("language changed to", this.refs.lngSelect.value);
        if (this.refs.lngSelect.value !== this.props.preferences.lang) { //eslint-disable-line react/prop-types
            this.props.dispatch(PreferencesSet("lang", this.refs.lngSelect.value));
            setTimeout(() => window.location.reload(), 500);
        }
    },

    /**
     * @name changeLanguageTo
     * @description change language
     * @param lang
     * @returns {Function}
     * */
    changeLanguageTo (lang) {
        return () => {
            this.props.dispatch(PreferencesSet("lang", lang));
            setTimeout(() => window.location.reload(), 500);
        };
    }
});

function mapStateToProps (state, ownParams) {
    return {
        preferences: state.preferences,
        user: state.user,
        ownParams
    };
}

export default connect(mapStateToProps)(LanguageSwitcher);