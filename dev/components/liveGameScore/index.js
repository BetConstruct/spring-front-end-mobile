import PropTypes from 'prop-types';

function LiveGameScore (props) {
    return Template.apply({props}); //eslint-disable-line no-undef
}

LiveGameScore.propTypes = {
    game: PropTypes.object.isRequired,
    sportAlias: PropTypes.string.isRequired
};

export default LiveGameScore;