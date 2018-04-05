import React from 'react';
import {connect} from 'react-redux';
import {UIMixin} from '../../../mixins/uiMixin';
import {Logout, LoggedOut} from "../../../actions/login";
import {CmsLoadPage} from "../../../actions/cms";
import {GetRightMenuData} from "../../../helpers/selectors";

const RightMenu = React.createClass({
    componentWillMount () {
        this.props.dispatch(CmsLoadPage("help-root-" + this.props.preferences.lang, this.props.preferences.lang));  //eslint-disable-line react/prop-types
    },
    render () {
        return Template.apply(this); //eslint-disable-line no-undef
    },
    logout () {
        this.props.dispatch(Logout()); //eslint-disable-line react/prop-types
        //eslint-disable-next-line react/prop-types
        this.props.dispatch(LoggedOut()); // to update state immediately, without waiting for network
    }
});

export default connect(GetRightMenuData)(UIMixin({Component: RightMenu}));