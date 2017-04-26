import React from 'react';
import {connect} from 'react-redux';
import {DoCashOut} from "../../../actions/betHistory";
import {SwarmClearData} from "../../../actions/swarm";
import {UIMixin} from '../../../mixins/uiMixin';

const CashOutDialog = React.createClass({
    propTypes: {
        betId: React.PropTypes.number.isRequired,
        price: React.PropTypes.number.isRequired
    },
    componentWillMount () {
        this.props.dispatch(SwarmClearData("cashOut"));
    },

    /**
     * @description function which is preparing to do cash out
     * @returns {undefined}
     * */
    doCashOut () {
        var data = this.props.swarmData.data.cashOut; //eslint-disable-line react/prop-types
        var price = (data && data.details && data.details.new_price) || this.props.price;
        this.props.dispatch(DoCashOut(this.props.betId, price));
    },
    render () {
        return Template.apply(this); //eslint-disable-line no-undef
    }
});

function mapStateToProps (state) {
    return {
        swarmData: state.swarmData
    };
}

export default connect(mapStateToProps)(UIMixin({Component: CashOutDialog}));