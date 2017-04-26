import React from 'react';

function LiveGameScore (props) {
    return Template.apply({props}); //eslint-disable-line no-undef
}

LiveGameScore.propTypes = {
    game: React.PropTypes.object.isRequired,
    sportAlias: React.PropTypes.string.isRequired
};

export default LiveGameScore;