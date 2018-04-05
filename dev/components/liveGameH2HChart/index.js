import PropTypes from 'prop-types';

function LiveGameH2HChart (props) {
    return Template.apply({props}); //eslint-disable-line no-undef
}

LiveGameH2HChart.propTypes = {
    stats: PropTypes.object.isRequired,
    sportAlias: PropTypes.string.isRequired
};

export default LiveGameH2HChart;