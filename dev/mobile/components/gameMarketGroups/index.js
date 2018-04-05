import React from 'react';
import {connect} from 'react-redux';
import {MarketFilter} from '../../../actions/ui';
import {GetMarkets} from "../../../helpers/selectors";

class GameMarketGroups extends React.Component {
    setMarketFilter (marketName) {
        this.props.dispatch(MarketFilter(marketName));
    }

    render () {
        return this.props.game ? Template.apply(this) : null; //eslint-disable-line no-undef
    }
}

function mapStateToProps (state, ownParams) {
    let key = ownParams.selectorKey;
    return GetMarkets(key)(state);
}

export default connect(mapStateToProps)(GameMarketGroups);
