import React, {Component} from 'react';
import {connect} from 'react-redux';
import {GetProfile} from "../../../helpers/selectors";
import {UIMixin} from '../../../mixins/uiMixin';
import {LoadBonusData} from "../../../actions/bonus";
import {createSelector} from 'reselect';
import Config from "../../../config/main";
import PropTypes from 'prop-types';

class Balance extends Component {
    componentWillMount () {
        if (!(this.props.swarmData.loaded.casinoBonuses && this.props.swarmData.loaded.sportBonuses) && this.props.user.reallyLoggedIn && Config.enableCasinoAndSportsBonusesToShow) {
            this.props.dispatch(LoadBonusData(true));
            this.props.dispatch(LoadBonusData(false));
        }
    }
    componentWillReceiveProps (nextProps) {
        if (nextProps.user.reallyLoggedIn && !this.props.user.reallyLoggedIn) {
            this.props.dispatch(LoadBonusData(true));
            this.props.dispatch(LoadBonusData(false));
        }
    }
    render () {
        return Template.apply(this); //eslint-disable-line no-undef
    }
}

const mapStateToProps = (_) => {
    let bonusDataSelector = createSelector(
        [
            state => {
                let swarmData = state.swarmData;
                return ((swarmData && swarmData.data && swarmData.data.sportBonuses && swarmData.data.sportBonuses.bonuses && swarmData.data.sportBonuses.bonuses.filter((bonus) => {
                    return bonus.acceptance_type === 0;
                }) || []).length || 0);
            },
            state => {
                let swarmData = state.swarmData;
                return ((swarmData && swarmData.data && swarmData.data.casinoBonuses && swarmData.data.casinoBonuses && swarmData.data.casinoBonuses.bonuses.filter((bonus) => {
                    return bonus.acceptance_type === 0;
                }) || []).length || 0);
            }
        ],
        (casinoBonus, sportBonus) => {
            return casinoBonus + sportBonus;
        }
    );
    return createSelector(
        [
            state => state.preferences,
            state => state.uiState.lastRouteType,
            GetProfile,
            state => state.swarmData,
            state => state.user,
            bonusDataSelector
        ],
        (preferences, lastRouteType, profile, swarmData, user, bonusData) => {
            return {preferences, lastRouteType, profile, swarmData, user, bonusData};
        }
    );
};
export default connect(mapStateToProps)(UIMixin({Component: Balance}));

Balance.propTypes = {
    swarmData: PropTypes.object,
    user: PropTypes.object,
    bonusData: PropTypes.number
};