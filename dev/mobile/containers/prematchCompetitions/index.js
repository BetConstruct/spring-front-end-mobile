import React from 'react';
import {defaultMemoize} from "reselect";
import {connect} from 'react-redux';
import {GetCompetitionsDataSelector, CreateComponentSwarmLoadedStateSelector} from "../../../helpers/selectors";
import {SwarmDataMixin, getSwarmDataKeyForRequest} from '../../../mixins/swarmDataMixin';
import FavoritesMixin from "../../../mixins/favoritesMixin";
import PropTypes from 'prop-types';
import moment from "moment";

const PrematchCompetitions = React.createClass({
    propTypes: {
        selectedSportAlias: PropTypes.string.isRequired,
        timeFilter: PropTypes.number
    },
    render () {
        console.info("rendering preMatch regions list");
        return Template.apply(this); //eslint-disable-line no-undef
    },
    shouldComponentUpdate (nextProps) {
        let currentProps = this.props;
        return nextProps.data.region.length !== currentProps.data.region.length || currentProps.swarmDataKey !== nextProps.swarmDataKey;
    }
});

let createSwarmDataKeySelector = defaultMemoize((sportAlias, timeFilter) => () => getSwarmDataKeyForRequest(getSwarmSubscriptionRequest(sportAlias, timeFilter, true))),
    selectorInstance = {};

/**
 * @name getSelector
 * @description Get prematch selector
 * @param {String} key
 * @return {Function}
 */
function getSelector (key) {
    selectorInstance.key !== key && (selectorInstance.selector = GetCompetitionsDataSelector(key));
    return selectorInstance.selector;
}

function mapStateToProps (state, ownParams) {
    let keySelector = createSwarmDataKeySelector(ownParams.selectedSportAlias, ownParams.timeFilter);
    return {
        data: getSelector(keySelector())(state),
        loaded: CreateComponentSwarmLoadedStateSelector(keySelector)(state),
        swarmDataKey: keySelector(),
        dataSelector: selectorInstance.selector,
        ownParams: ownParams
    };
}

/**
 * @name getSwarmSubscriptionRequest
 * @description Prepare swarm subscription request
 * @param {String} sportAlias
 * @param {Number | String} timeFilter
 * @return {Object} request
 */
function getSwarmSubscriptionRequest (sportAlias, timeFilter, isForHashing) {
    let req = {
        "source": "betting",
        "what": {
            "sport": [["id", "name", "alias"]],
            "region": ["name", "alias", "order", "id"],
            "competition": ["id", "name", "alias", "order"],
            "game": "@count"
        },
        "where": {
            "game": {
                "@or": [{"type": {"@in": [0, 2]}}, {"visible_in_prematch": 1}]
            },
            "sport": {"alias": sportAlias}
        }
    };
    if (timeFilter) {
        req.where.game.start_ts = {'@now': {'@gte': 0, '@lt': timeFilter === 'today' ? isForHashing ? 'today' : moment().endOf("day").unix() - moment().unix() : timeFilter * 3600}};
    }
    return req;
}

export default connect(mapStateToProps)(SwarmDataMixin(
    {
        Component: FavoritesMixin({Component: PrematchCompetitions}),
        ComponentWillMount: function () {
            this.swarmSubscriptionRequest = getSwarmSubscriptionRequest(this.props.selectedSportAlias, this.props.timeFilter);
            this.swarmDataKey = getSwarmDataKeyForRequest(getSwarmSubscriptionRequest(this.props.selectedSportAlias, this.props.timeFilter, true));
            this.keepDataAfterUnsubscribe = true;
        }
    }
));
