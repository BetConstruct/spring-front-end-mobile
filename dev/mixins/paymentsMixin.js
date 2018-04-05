import React from 'react';
import {filtersLoadingDone, LoadBetShops, LoadFilters} from '../actions/payments';
import Config from '../config/main';
import {connect} from "react-redux";

/**
 * @name PaymentsMixin
 * @description PaymentsMixin is a HOC(Higher Order Component) which adds additional properties and methods to wrapped component
 * @param {React.Component} ComposedComponent
 * @constructor
 */
export var PaymentsMixin = ComposedComponent => {
    class PaymentsMixin extends React.Component {

        /**
         * @name init
         * @description initializing method maybe there are some specifications to load
         * @param {object} props
         * @fire event:loadFilters
         * @fire event:loadBetShops
         */
        init (props) {
            if (props.user.loggedIn) {
                if (!Config.main.showAllAvailablePaymentSystems && !props.payments.filters.loaded && !Config.main.paymentByCurrency) {
                    this.props.dispatch(LoadFilters());
                } else if (Config.main.paymentByCurrency) {
                    Config.main.paymentByCurrency.deposit = Config.main.paymentByCurrency.deposit || {};
                    Config.main.paymentByCurrency.withdraw = Config.main.paymentByCurrency.withdraw || {};
                    try {
                        this.props.dispatch(filtersLoadingDone({
                            deposit: Config.main.paymentByCurrency.deposit[(props.profile.currency_name || props.profile.currency_id)],
                            withdraw: Config.main.paymentByCurrency.withdraw[(props.profile.currency_name || props.profile.currency_id)]
                        }));
                        Config.main.showAllAvailablePaymentSystems = false;
                    } catch (e) {
                        console.error(e);
                    }
                }
                if (Config.main.payments && !(props.payments.data.loaded || props.payments.data.loading || props.payments.data.failed)) {
                    let hasBetShops;
                    Config.main.payments.forEach(payment => { !hasBetShops && (hasBetShops = payment.hasBetShops); });
                    hasBetShops && this.props.dispatch(LoadBetShops());
                }
                this.inited = true;
            }
        }

        componentDidMount () {
            if (!this.inited && this.props.profile) {
                this.init(this.props);
            }
        }

        componentWillReceiveProps (nextProps) {
            if (!this.inited && nextProps.profile) {
                this.init(nextProps);
            }
        }

        render () {
            return <ComposedComponent.Component {...this.props} {...this.state} />;
        }
    }
    return connect((state) => ({profile: state.user.profile}))(PaymentsMixin);
}
