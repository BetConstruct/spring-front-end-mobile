import React, {PropTypes} from 'react';
import {connect} from 'react-redux';

const BetDetails = React.createClass({
    propTypes: {
        id: PropTypes.string,
        dataSelectorKey: PropTypes.string,
        router: PropTypes.object.isRequired,
        swarmData: PropTypes.object.isRequired,
        previousPath: PropTypes.string
    },

    /**
     * @name getSelectedBet
     * @description get selected bet
     * @returns {undefined}
     * */
    getSelectedBet () {
        let key = this.props.previousPath && this.props.previousPath.indexOf("open-bets") !== -1 ? "betHistory_unsettled" : "betHistory_settled",
            data = this.props.swarmData.data[key],
            bets = data && data.bets; //eslint-disable-line react/prop-types

        if (bets) {
            this.selectedBet = bets.find(bet => (bet.id === parseInt(this.props.id, 10) ? bet : undefined));
        }
    },
    componentWillMount () {
        this.selectedBet = null;
        this.getSelectedBet();
        if (!this.selectedBet) {     //eslint-disable-line react/prop-types
            this.context.router.push("/history/bets");
        } else {
            console.log("bet found in store", this.selectedBet);
        }
    },
    componentWillReceiveProps (nextProps) {
        if (!this.selectedBet && nextProps.swarmData.data[this.props.dataSelectorKey]) { //eslint-disable-line react/prop-types
            this.getSelectedBet();
        }
    },
    render () {
        return Template.apply(this); //eslint-disable-line no-undef
    }
});

BetDetails.contextTypes = {
    router: React.PropTypes.object.isRequired
}

function mapStateToProps (state) {
    return {
        preferences: state.preferences,
        swarmData: state.swarmData,
        previousPath: state.uiState.previousPath
    };
}

export default connect(mapStateToProps)(BetDetails);
