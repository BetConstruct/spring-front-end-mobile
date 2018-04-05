import React from 'react';
import Scroll from "react-scroll";
import {connect} from 'react-redux';
import {UIMixin} from '../../../mixins/uiMixin';
import Config from "../../../config/main";

const Footer = React.createClass({

    getSocialLinks (item) {
        return (<li className={Config.social[item].name}>
            <a href={Config.social[item].url} target={Config.social[item].target || "_self"} />
        </li>);
    },

    componentWillMount () {
        let extrnalProp = window.APG || window.CEG;
        Config.main.enableCallToExternalScriptsInitCallback && extrnalProp && extrnalProp.init && extrnalProp.init();
    },
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