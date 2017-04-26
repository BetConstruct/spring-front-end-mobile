import React from 'react';
import Scroll from "react-scroll";
import {connect} from 'react-redux';
import {UIMixin} from '../../../mixins/uiMixin';

const Footer = React.createClass({
    toTop () {
        Scroll.animateScroll.scrollToTop();
    },
    render () {
        return Template.apply(this); //eslint-disable-line no-undef
    }
});

function mapStateToProps (state, ownParams) {
    return {
        //TODO write getHomeData selector function to pass some data 'example (homeData: getHomeData(state))'
        ownParams
    };
}

export default connect(mapStateToProps)(UIMixin({Component: Footer}));