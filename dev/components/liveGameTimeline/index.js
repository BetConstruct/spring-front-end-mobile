import PropTypes from 'prop-types';

function LiveGameTimeline (props) {
    return Template.apply({props}); //eslint-disable-line no-undef
}

LiveGameTimeline.propTypes = {
    game: PropTypes.object.isRequired,
    sportAlias: PropTypes.string.isRequired
};

export default LiveGameTimeline;