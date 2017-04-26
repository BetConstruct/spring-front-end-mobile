import React from "react";

function GameAnimation (props) {
    return Template.apply({props}); //eslint-disable-line no-undef
}

GameAnimation.propTypes = {
    game: React.PropTypes.object.isRequired,
    sport: React.PropTypes.string.isRequired
};

export default GameAnimation;