import React from 'react';

function LiveGameH2HChart (props) {
    return Template.apply({props}); //eslint-disable-line no-undef
}

LiveGameH2HChart.propTypes = {
    stats: React.PropTypes.object.isRequired,
    sportAlias: React.PropTypes.string.isRequired
};

export default LiveGameH2HChart;