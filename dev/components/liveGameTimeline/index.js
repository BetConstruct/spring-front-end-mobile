import React from 'react';

function LiveGameTimeline (props) {
    return Template.apply({props}); //eslint-disable-line no-undef
}

LiveGameTimeline.propTypes = {
    game: React.PropTypes.object.isRequired,
    sportAlias: React.PropTypes.string.isRequired
};

export default LiveGameTimeline;