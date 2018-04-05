import PropTypes from 'prop-types';

function GameVideo (props) {
    return Template.apply({props}); //eslint-disable-line no-undef
}

GameVideo.propTypes = {
    streamURL: PropTypes.string.isRequired,
    loggedIn: PropTypes.bool.isRequired,
    balance: PropTypes.number.isRequired
};

export default GameVideo;