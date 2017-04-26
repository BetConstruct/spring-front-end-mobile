import React from 'react';
import {connect} from 'react-redux';
import Scroll from "react-scroll";
import {CmsLoadPage} from "../../../actions/cms";
import {UIExpandElement} from '../../../actions/ui';
import {getPageIdBySLug} from "../../../helpers/cms";

const CmsPage = React.createClass({
    render () {
        if (this.props.route.path.indexOf("promo") === 0) { //eslint-disable-line react/prop-types
            this.pageType = "promo";
            // promotions are already (being) loaded by component in  right menu
        } else {
            this.pageType = "page";
            if (!(this.props.cmsData.loaded && this.props.cmsData.loaded[this.props.routeParams.slug] !== undefined)) { //eslint-disable-line react/prop-types
                this.props.dispatch(CmsLoadPage(this.props.routeParams.slug, this.props.preferences.lang));  //eslint-disable-line react/prop-types
            }
        }
        return Template.apply(this); //eslint-disable-line no-undef
    },
    componentWillReceiveProps (nextProps) {
        if (nextProps.cmsData.data[nextProps.routeParams.slug] && nextProps.cmsData.data[nextProps.routeParams.slug].page) {
            var pageIds = getPageIdBySLug(nextProps.cmsData.data[nextProps.routeParams.slug].page, nextProps.routeParams.section);

            pageIds && pageIds.map(pageId => this.props.dispatch(UIExpandElement("p" + pageId))); //expand all parent elements
            setTimeout(() => { Scroll.scroller.scrollTo(nextProps.routeParams.section, {smooth: true, offset: -100}); }, 1000);
        }

    }
});

function mapStateToProps (state) {
    return {
        promotionsLoaded: state.cmsData.loaded["promotions-" + state.preferences.lang],
        promotionsData: state.cmsData.data["promotions-" + state.preferences.lang],
        cmsData: state.cmsData,
        preferences: state.preferences
    };
}

export default connect(mapStateToProps)(CmsPage);