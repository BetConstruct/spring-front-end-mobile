import React from 'react';
import {connect} from 'react-redux';
import {UIMixin} from '../../../mixins/uiMixin';

const HomeWrapper = React.createClass({
    render () {
        return Template.apply(this); //eslint-disable-line no-undef
    }
});

function mapStateToProps (state) {
    return {
        prematchWidgetTimeFilter: state.persistentUIState.prematchWidgetTimeFilter
    };
}

export default connect(mapStateToProps)(UIMixin({Component: HomeWrapper}));