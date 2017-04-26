import React from 'react';
import {connect} from 'react-redux';
import {checkIfUserIsLoggedIn} from "../../../mixins/checkAuthentication";
import {LoadLoyaltyLevels, LoadLoyaltyRates, ExchangeLoyaltyPoints} from "../../../actions/loyalty";
import {UIMixin} from "../../../mixins/uiMixin";
import {GetLoginState, GetLoyaltyRates, GetLoyaltyLevels, GetUserCurrencyId, GetProfile} from "../../../helpers/selectors";

const LoyaltyPoints = React.createClass({
    propTypes: {
        type: React.PropTypes.string
    },

    /**
     * @name exchangePoints
     * @description help function for exchanging loyalty point
     * @param values
     * @returns {undefined}
     * */
    exchangePoints (values) {
        this.props.dispatch(ExchangeLoyaltyPoints(values.amount));
    },
    render () {
        //eslint-disable-next-line react/prop-types
        return checkIfUserIsLoggedIn(this.props.user, this.props.dispatch) || Template.apply(this); //eslint-disable-line no-undef
    },
    componentWillMount () {
        if (this.props.loggedIn) { //eslint-disable-line react/prop-types
            this.props.dispatch(LoadLoyaltyLevels());
            this.props.dispatch(LoadLoyaltyRates());
        }
    },
    componentWillReceiveProps (nextProps) {
        if ((this.props.loggedIn !== nextProps.loggedIn && nextProps.loggedIn)) {  //eslint-disable-line react/prop-types
            this.props.dispatch(LoadLoyaltyLevels());
            this.props.dispatch(LoadLoyaltyRates());
        }
    }
});

function mapStateToProps (state) {
    return {
        user: state.user,
        profile: GetProfile(state),
        currencyId: GetUserCurrencyId(state),
        loggedIn: GetLoginState(state),
        levelsLoaded: state.swarmData.loaded.loyalty_levels,
        levelsData: GetLoyaltyLevels(state),
        ratesLoaded: state.swarmData.loaded.loyalty_rates,
        ratesData: GetLoyaltyRates(state), //state.swarmData.data.loyalty_rates,
        ui: state.uiState
    };
}

export default connect(mapStateToProps)(UIMixin({Component: LoyaltyPoints}));