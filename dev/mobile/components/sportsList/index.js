import React from 'react';
import {connect} from 'react-redux';
import {defaultMemoize} from "reselect";
import {GetSportListDataSelector, CreateComponentSwarmLoadedStateSelector} from "../../../helpers/selectors";
import {SwarmDataMixin, getSwarmDataKeyForRequest} from '../../../mixins/swarmDataMixin';
import {getVideoFilterRequest} from "../../../helpers/sport/videoFilter";
import {SCROLLED_TO_SPORT_ALIAS} from "../../../actions/actionTypes";

let ctx;
const SportsList = React.createClass({
    propTypes: {
        gameType: React.PropTypes.string.isRequired,
        timeFilter: React.PropTypes.number,
        videoFilter: React.PropTypes.string,
        selectedSportAlias: React.PropTypes.string,
        routeParams: React.PropTypes.object.isRequired,
        location: React.PropTypes.object.isRequired
    },
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    render () {
        ctx = this.context;
        return Template.apply(this); //eslint-disable-line no-undef
    },
    favoritesCount () {
        return (this.props.favorites.game && Object.keys(this.props.favorites.game).length) + //eslint-disable-line react/prop-types
                (this.props.favorites.competition && Object.keys(this.props.favorites.competition).length); //eslint-disable-line react/prop-types
    },
    componentWillReceiveProps (nextProps) {
        if (!!nextProps.selectedSportAlias &&
            !this.props.selectedSportAlias &&
            !!this[nextProps.selectedSportAlias] &&
            nextProps.selectedSportAlias !== this.props.selectedSportAlias) {
            setTimeout(() => {
                let element = this[nextProps.selectedSportAlias],
                    parent = element.parentElement.parentElement;

                parent.scrollLeft = element.offsetLeft;
                this.props.dispatch({type: SCROLLED_TO_SPORT_ALIAS});
            }, 200);
        }
    }
});

function getSwarmSubscriptionRequest (gameType, timeFilter, videoFilter) {
    let gameTypeCondition = {
        "live": {"type": 1},
        "prematch": {"@or": [{"type": {"@in": [0, 2]}}, {"visible_in_prematch": 1}]}
    };
    let req = {
        "source": "betting",
        "what": {"sport": ["id", "name", "alias", "order"], "game": "@count"},
        "where": {"game": gameTypeCondition[gameType]}
    };
    if (timeFilter) {
        req.where.game.start_ts = {'@now': {'@gte': 0, '@lt': timeFilter * 3600}};
    }
    if (videoFilter && videoFilter !== 'all') {
        req.where.game['@or'] = getVideoFilterRequest();
    }
    return req;
}

let createSwarmDataKeySelector = defaultMemoize((gameType, timeFilter, videoFilter) => () => getSwarmDataKeyForRequest(getSwarmSubscriptionRequest(gameType, timeFilter, videoFilter))),
    selectorInstance = {};

function getSelector (key) {
    selectorInstance.key !== key && (selectorInstance.selector = GetSportListDataSelector(key));
    return selectorInstance.selector;
}

function mapStateToProps (state, ownParams) {
    let keySelector = createSwarmDataKeySelector(ownParams.gameType, ownParams.timeFilter, ownParams.videoFilter);
    return {
        user: state.user,
        selectedSportAlias: state.uiState.selectedSportAlias,
        data: getSelector(keySelector())(state),
        loaded: CreateComponentSwarmLoadedStateSelector(keySelector)(state),
        favorites: state.favorites,
        ownParams: ownParams
    };
}
export default connect(mapStateToProps)(SwarmDataMixin(
    {
        Component: SportsList,
        ComponentWillMount: function () {
            this.swarmSubscriptionRequest = getSwarmSubscriptionRequest(this.props.gameType, this.props.timeFilter, this.props.videoFilter);
            this.keepDataAfterUnsubscribe = true;
        },
        ComponentWillReceiveProps: function (nextProps) {
            // select first sport if no sport is selected
            if (!this.props.routeParams.sportAlias && nextProps.data && nextProps.data.length) {
                let firstSport = nextProps.data[0];
                let alias = firstSport && firstSport.alias;
                if (alias && ctx && this.props.location.pathname.indexOf(alias) === -1) {
                    ctx.router.replace(this.props.location.pathname + "/" + alias);
                }
            }
        }
    }
));