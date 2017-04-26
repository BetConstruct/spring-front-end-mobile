import React from 'react';
import {connect} from 'react-redux';
import {BetslipAdd, BetslipRemove, BetslipPlaceBet} from "../../../actions/betslip";
import OddConverter from "../../../helpers/sport/oddConverter";
import {GetOddsFormat} from "../../../helpers/selectors";
import {createBetslipEventObject, BETSLIP_TYPE_SINGLE} from "../../../helpers/sport/betslip";

/**
 * Renders the event <div> ( name, price, arrows when price changes)
 * on click event is added/removed from betslip or bet is made if betslip is in quick bet mode.
 */
const Event = React.createClass({
    propTypes: {
        event: React.PropTypes.object,
        game: React.PropTypes.object,
        market: React.PropTypes.object,
        name: React.PropTypes.string
    },

    /**
     * @name makeQuickBet
     * @description helper function for preparing bets object
     * @returns {undefined}
     * */
    makeQuickBet () {
        let {betterOddSelectionMode, acceptPriceChanges, eachWayMode, freeBet, stake, quickBet} = this.props.betslip; //eslint-disable-line react/prop-types
        let bet = createBetslipEventObject(this.props.game, this.props.market, this.props.event);
        bet.singleStake = stake;
        let betData = {
            type: BETSLIP_TYPE_SINGLE,
            betterOddSelectionMode,
            acceptPriceChanges,
            eachWayMode,
            freeBet,
            stake,
            quickBet,
            events: {
                [this.props.event.id]: bet
            }
        };
        this.props.dispatch(BetslipPlaceBet(betData));
    },

    /**
     * @name toggle
     * @description toggle function for adding and removing events from betSlip
     * @returns {undefined}
     * */
    toggle () {
        if (this.props.betslip.events[this.props.event.id] !== undefined) {  //eslint-disable-line react/prop-types
            this.props.dispatch(BetslipRemove(this.props.event.id));
        } else {
            this.props.dispatch(BetslipAdd(createBetslipEventObject(this.props.game, this.props.market, this.props.event))); //eslint-disable-line react/prop-types
        }
    },

    /**
     * @name isEventInBetslip
     * @description check if event in betSlip
     * @returns {undefined}
     * */
    isEventInBetslip () {
        return !this.props.betslip.quickBet && this.props.event && this.props.betslip.events[this.props.event.id] !== undefined; //eslint-disable-line react/prop-types
    },
    render () {
        let price = OddConverter(this.props.event && this.props.event.price, this.props.oddsFormat); //eslint-disable-line react/prop-types
        let priceChange = this.props.event && this.props.event.price_change && this.props.event.price_change.toString();
        return (
            <div className={"single-coefficient-m" + (this.isEventInBetslip() ? " active" : "")}
                 onClick={this.props.betslip.quickBet ? this.makeQuickBet : this.toggle}
            >
                {this.props.name ? <p><b><i className="event-text-v-b">{this.props.name} {this.props.event.base}</i></b></p> : null}
                <span><i className={{"1": "top-m", "-1": "bot-m"}[priceChange]}>{price}</i></span>
            </div>
        );
    }
});

function mapStateToProps (state) {
    return {
        betslip: state.betslip,
        oddsFormat: GetOddsFormat(state)
    };
}

export default connect(mapStateToProps)(Event);