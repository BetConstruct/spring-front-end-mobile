import React, {Component} from 'react';
import {SwarmDataMixin} from '../../../mixins/swarmDataMixin';
import {connect} from 'react-redux';
import {SubscribeForMessages, UserProfileUpdateReceived} from "../../../actions/user";
import {GetProfile} from "../../../helpers/selectors";
import PropTypes from 'prop-types';
import {GetUserBalance} from "../../../actions/balance";
import Config from '../../../config/main';

class ProfileHandler extends Component {

    componentWillMount () {
        !(Config.messages && Config.messages.disableMessages) && this.props.dispatch(SubscribeForMessages((unSubscribe) => {
            this.unSubscribe = unSubscribe;
        }));
        Config.isPartnerIntegration && (Config.isPartnerIntegration.mode.iframe || Config.isPartnerIntegration.needToLoginFromUrl) && this.props.profile && this.activateBalanceChecker(this.props.profile);
    }
    activateBalanceChecker (profile) {
        this.checkBalanceEnabled = true;
        this.checkBalance(profile);
    }

    checkBalance (profile) {
        if (this.checkBalanceEnabled) {
            this.props.dispatch(GetUserBalance(this.props.profile || profile));
            setTimeout(this.checkBalance.bind(this, this.props.profile || profile), 30000);
        }
    }

    deactivateBalanceChecker () {
        this.checkBalanceEnabled = false;
    }

    componentWillUnmount () {
        this.unSubscribe && this.unSubscribe();
    }

    componentWillReceiveProps (nextProps) {
        let newProfileData = nextProps.profile;
        let oldProfileData = this.props.profile; //eslint-disable-line react/prop-types
        if (newProfileData && (!oldProfileData || (JSON.stringify(newProfileData) !== JSON.stringify(oldProfileData)))) {
            let profile = {
                ...newProfileData,
                "currency_name": Config.main.showPointsInsteadCurrencyName ? "PTS" : newProfileData.currency_name
            };

            this.props.dispatch(UserProfileUpdateReceived(profile));
        }
        if (!oldProfileData && newProfileData) {
            Config.isPartnerIntegration && (Config.isPartnerIntegration.mode.iframe || Config.isPartnerIntegration.needToLoginFromUrl) && !this.checkBalanceEnabled && this.activateBalanceChecker(newProfileData);
        } else if (!newProfileData && oldProfileData) {
            Config.isPartnerIntegration && (Config.isPartnerIntegration.mode.iframe || Config.isPartnerIntegration.needToLoginFromUrl) && this.checkBalanceEnabled && this.deactivateBalanceChecker();
        }
    }

    render () {
        return <input type="hidden" value={this.props.user.loggedIn}/>;
    }
}

ProfileHandler.propTypes = {
    profile: PropTypes.object,
    user: PropTypes.object
};

export default connect(state => ({user: state.user, profile: GetProfile(state), reallyLoggedIn: state.user.reallyLoggedIn}))(SwarmDataMixin({
    Component: ProfileHandler,
    ComponentWillMount: function () {
        this.swarmSubscriptionRequest = {
            "source": "user",
            "what": {"profile": []}
        };
        this.swarmDataKey = "profile";
    }
}));