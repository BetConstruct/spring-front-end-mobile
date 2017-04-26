import React from 'react';

function LiveGameStatsTable (props) {
    return Template.apply({props}); //eslint-disable-line no-undef
}

LiveGameStatsTable.propTypes = {
    stats: React.PropTypes.object.isRequired,
    sportAlias: React.PropTypes.string.isRequired,
    team1_name: React.PropTypes.string.isRequired,
    team2_name: React.PropTypes.string.isRequired
};

export default LiveGameStatsTable;