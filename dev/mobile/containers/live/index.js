import React, {Component} from 'react';
import {connect} from 'react-redux';
import Config from "../../../config/main";
import {LiveVideoFilter} from "../../../actions/ui";
import PropTypes from "prop-types";

class Live extends Component {
    componentDidMount () {
        if (Config.main.video && Config.main.video.disableLiveGamesVideoFiler && this.props.liveVideoFilter !== 'all') {
            this.props.dispatch(LiveVideoFilter('all'));
        }
    }
    render () {
        return Template.apply(this); //eslint-disable-line no-undef
    }
}

function mapStateToProps (state) {
    return {
        liveVideoFilter: state.persistentUIState.liveVideoFilter
    };
}

Live.propTypes = {
    liveVideoFilter: PropTypes.string
};

export default connect(mapStateToProps)(Live);