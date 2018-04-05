import PropTypes from 'prop-types';

function GameAnimation (props) {
    return Template.apply({props}); //eslint-disable-line no-undef
}

GameAnimation.propTypes = {
    game: PropTypes.object.isRequired,
    sport: PropTypes.string.isRequired
};

export default GameAnimation;