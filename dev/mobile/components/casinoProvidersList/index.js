import React from 'react';
import {connect} from 'react-redux';
import {UIMixin} from '../../../mixins/uiMixin';
import PropTypes from 'prop-types';

class CasinoProvidersList extends React.PureComponent {
    render () {
        return Template.apply(this); //eslint-disable-line no-undef
    }
}

CasinoProvidersList.propTypes = {
    casino: PropTypes.object
};

function mapStateToProps (state) {
    return {
        casino: state.casino
    };
}

export default connect(mapStateToProps)(UIMixin({
    Component: CasinoProvidersList
}));
