import React, {Component, PropTypes} from "react";
import {connect} from 'react-redux';
import {t} from '../../../../helpers/translator';

class TotalGames extends Component {
    render () {
        return (
            <span>
                <b>{t("{1} Matches", this.props.totalGames)} </b>
            </span>
        );
    }
    shouldComponentUpdate (nextProps) {
        let currentProps = this.props;
        return nextProps.totalGames !== currentProps.totalGames;
    }
}

TotalGames.propTypes = {
    totalGames: PropTypes.number.isRequired
};

function mapStateToProps (state, ownProps) {
    return ownProps.dataSelector(state);
}

export default connect(mapStateToProps)(TotalGames)