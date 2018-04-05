import PropTypes from 'prop-types';

function LiveGameStatsTable (props) {
    return Template.apply({props}); //eslint-disable-line no-undef
}

LiveGameStatsTable.propTypes = {
    stats: PropTypes.object.isRequired,
    sportAlias: PropTypes.string.isRequired,
    team1_name: PropTypes.string.isRequired,
    team2_name: PropTypes.string.isRequired
};

export default LiveGameStatsTable;