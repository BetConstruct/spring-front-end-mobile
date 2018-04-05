import React, {Component} from "react";
import {connect} from "react-redux";

class BonusWagering extends Component {

    render () {
        return Template.apply(this);
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user
    };
};

export default connect(mapStateToProps)(BonusWagering);