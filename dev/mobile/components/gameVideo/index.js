import React from "react";

function GameVideo (props) {
    return Template.apply({props}); //eslint-disable-line no-undef
}

GameVideo.propTypes = {
    streamURL: React.PropTypes.string.isRequired,
    loggedIn: React.PropTypes.bool.isRequired,
    balance: React.PropTypes.number.isRequired
};

export default GameVideo;