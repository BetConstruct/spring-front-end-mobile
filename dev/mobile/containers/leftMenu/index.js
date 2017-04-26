import React from 'react';
import {connect} from 'react-redux';
import {UIMixin} from '../../../mixins/uiMixin';

const LeftMenu = React.createClass({
    render () {
        return Template.apply(this); //eslint-disable-line no-undef
    }
});

function mapStateToProps (state, ownParams) {
    return {
        ui: state.uiState,
        ownParams
    };
}

export default connect(mapStateToProps)(UIMixin({Component: LeftMenu}));