import React from 'react';
import {connect} from 'react-redux';
import {CmsLoadPage} from "../../../actions/cms";
import {UIMixin} from '../../../mixins/uiMixin';

const Promotions = React.createClass({
    render () {
        return Template.apply(this); //eslint-disable-line no-undef
    },
    componentWillMount () {
        if (!(this.props.cmsData.loaded && this.props.cmsData.loaded[this.props.slug])) {                                    //eslint-disable-line react/prop-types
            this.props.dispatch(CmsLoadPage(this.props.slug, this.props.preferences.lang, "posts"));    //eslint-disable-line react/prop-types
        }

    }
});

function mapStateToProps (state) {
    return {
        slug: "promotions-" + state.preferences.lang,
        loaded: state.cmsData.loaded["promotions-" + state.preferences.lang],
        cmsData: state.cmsData,
        preferences: state.preferences
    };
}

export default connect(mapStateToProps)(UIMixin({Component: Promotions}));