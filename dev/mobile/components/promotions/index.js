import {Component} from 'react';
import {connect} from 'react-redux';
import {CmsLoadPage} from "../../../actions/cms";
import {UIMixin} from '../../../mixins/uiMixin';
import {createSelector} from 'reselect';

class Promotions extends Component {
    render () {
        return Template.apply(this); //eslint-disable-line no-undef
    }
    componentWillMount () {
        if (!(this.props.cmsData.loaded && this.props.cmsData.loaded[this.props.slug])) {                                    //eslint-disable-line react/prop-types
            this.props.dispatch(CmsLoadPage(this.props.slug, this.props.preferences.lang, "posts"));    //eslint-disable-line react/prop-types
        }

    }
}

const mapStateToProps = () => {
    return createSelector(
        [
            state => "promotions-" + state.preferences.lang,
            state => state.cmsData.loaded["promotions-" + state.preferences.lang],
            state => state.cmsData,
            state => state.preferences
        ],
        (slug, loaded, cmsData, preferences) => {
            return {slug, loaded, cmsData, preferences};
        }
    );
};

export default connect(mapStateToProps)(UIMixin({Component: Promotions}));