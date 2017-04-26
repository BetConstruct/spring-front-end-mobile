import React from 'react';
import {LoadBetShops, LoadFilters} from '../actions/payments';
import Config from '../config/main';

/**
 * @name PaymentsMixin
 * @description PaymentsMixin is a HOC(Higher Order Component) which adds additional properties and methods to wrapped component
 * @param {React.Component} ComposedComponent
 * @constructor
 */
export var PaymentsMixin = ComposedComponent => class PaymentsMixin extends React.Component {

    constructor (props) {
        super(props);
        this.getFilteredMethods = this.getFilteredMethods.bind(this);
    }

    /**
     * @name filterEnabledMethods
     * @description Helper method to filter payments method dependant on transaction type and externally loaded filters
     * @param {string} transactionType
     * @returns {array}
     */
    filterEnabledMethods (transactionType) {
        let payments = this.props.payments, //eslint-disable-line react/prop-types
            methods = payments.availableMethods,
            loadedFilters,
            enabledKey = `can${transactionType.charAt(0).toUpperCase()}${transactionType.slice(1)}`;

        if (!Config.main.showAllAvailablePaymentSystems) {
            loadedFilters = payments.filters.data[transactionType];

            loadedFilters && (methods = methods.filter((method) => {
                return loadedFilters.includes(method.name);
            }));
        }

        return methods.filter((method) => {
            return method[enabledKey];
        });
    }

    /**
     * @name init
     * @description initializing method maybe there are some specifications to load
     * @param {object} props
     * @fire event:loadFilters
     * @fire event:loadBetShops
     */
    init (props) {
        if (props.user.loggedIn) {
            if (!Config.main.showAllAvailablePaymentSystems && !props.payments.filters.loaded) {
                this.props.dispatch(LoadFilters());
            }
            if (!(props.payments.data.loaded || props.payments.data.loading || props.payments.data.failed)) {
                this.props.dispatch(LoadBetShops());
            }
            this.inited = true;
        }
    }

    componentDidMount () {
        if (!this.inited) {
            this.init(this.props);
        }
    }

    componentWillReceiveProps (nextProps) {
        if (!this.inited) {
            this.init(nextProps);
        }
    }

    /**
     * @name getFilteredMethods
     * @description Helper method to filter enabled methods
     * @returns {Array}
     */
    getFilteredMethods () {
        let props = this.props;
        return this.filterEnabledMethods(props.route.forAction);
    }

    render () {
        return <ComposedComponent.Component {...this.props} {...this.state}
                getFilteredMethods={this.getFilteredMethods}
            />;
    }
};
