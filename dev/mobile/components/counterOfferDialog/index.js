import React from 'react';
import {connect} from 'react-redux';
import {SwarmClearData} from "../../../actions/swarm";
import {AcceptCounterOffer, DeclineCounterOffer} from "../../../actions/betslip";
import {UIMixin} from '../../../mixins/uiMixin';

const CounterOfferDialog = React.createClass({
    propTypes: {
        betId: React.PropTypes.number.isRequired,
        betInfo: React.PropTypes.object
    },
    componentWillMount () {
        this.props.dispatch(SwarmClearData("counterOffer"));
    },
    /**
     * @name acceptOffer
     * @description fires async action
     * @returns {undefined}
     * @fire event:acceptCounterOffer
     */
    acceptOffer () {
        this.props.dispatch(AcceptCounterOffer(this.props.betInfo.id));
    },
    /**
     * @name declineOffer
     * @description fires async action
     * @returns {undefined}
     * @fire event:declineCounterOffer
     */
    declineOffer () {
        this.props.dispatch(DeclineCounterOffer(this.props.betInfo.id));
    },
    render () {
        return Template.apply(this); //eslint-disable-line no-undef
    }
});

function mapStateToProps (state) {
    return {
        swarmData: state.swarmData,
        betslipData: state.betslip,
        ui: state.uiState
    };
}

export default connect(mapStateToProps)(UIMixin({Component: CounterOfferDialog}));