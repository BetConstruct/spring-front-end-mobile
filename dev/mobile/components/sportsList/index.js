import React from 'react';
import {connect} from 'react-redux';
import {defaultMemoize} from "reselect";
import {GetSportListDataSelector, CreateComponentSwarmLoadedStateSelector} from "../../../helpers/selectors";
import {SwarmDataMixin, getSwarmDataKeyForRequest} from '../../../mixins/swarmDataMixin';
import {getVideoFilterRequest} from "../../../helpers/sport/videoFilter";
import {SCROLLED_TO_SPORT_ALIAS} from "../../../actions/actionTypes";
import PropTypes from 'prop-types';
import moment from "moment";

function mouseUpHandler () {
    clearTimeout(this.timerScroll);
    this.clickedSportsList = true;
    this.delta = 0;
    document.removeEventListener("mouseup", mouseUpHandler);
}

let ctx, filter;
const SportsList = React.createClass({
    propTypes: {
        gameType: PropTypes.string.isRequired,
        timeFilter: PropTypes.number,
        videoFilter: PropTypes.string,
        selectedSportAlias: PropTypes.string,
        routeParams: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired
    },
    contextTypes: {
        router: PropTypes.object.isRequired
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
    },
    handleMouseUp () {
        document.addEventListener("mouseup", mouseUpHandler.bind(this));
    },
    scroll (scroller, scrollSize, delay) {
        let iterator = scrollSize > 0 ? 0.1 : -0.1;
        this.delta = this.delta || iterator;
        this.delta += iterator;
        this.clickedSportsList = false;
        scroller.scrollLeft += (scrollSize + this.delta);
        this.timerScroll = setTimeout(() => {
            !this.clickedSportsList && this.scroll(scroller, scrollSize, delay);
        }, delay);
    }
});

function getSwarmSubscriptionRequest (gameType, timeFilter, videoFilter, isForHashing) {
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
        req.where.game.start_ts = {'@now': {'@gte': 0, '@lt': timeFilter === 'today' ? isForHashing ? 'today' : moment().endOf("day").unix() - moment().unix() : timeFilter * 3600}};
    }
    if (videoFilter && videoFilter !== 'all') {
        req.where.game['@or'] = getVideoFilterRequest();
    }
    return req;
}

let createSwarmDataKeySelector = defaultMemoize(
    (gameType, timeFilter, videoFilter) => () => getSwarmDataKeyForRequest(getSwarmSubscriptionRequest(gameType, timeFilter, videoFilter, true))),
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
            this.swarmDataKey = getSwarmDataKeyForRequest(getSwarmSubscriptionRequest(this.props.gameType, this.props.timeFilter, this.props.videoFilter, true));
            this.keepDataAfterUnsubscribe = true;
        },
        ComponentWillReceiveProps: function (nextProps) {
            // select first sport if no sport is selected
            if (!this.props.routeParams.sportAlias && nextProps.data && nextProps.data.length) {
                let firstSport = nextProps.data[0];
                let alias = firstSport && firstSport.alias;
                if (alias && ctx && this.props.location.pathname.indexOf(alias) === -1) {
                    filter = this.props.timeFilter;
                    return ctx.router.replace(this.props.location.pathname + "/" + alias);
                }
            }

            if ((!filter || (this.props.timeFilter !== filter)) && nextProps.data && nextProps.data.length && nextProps.data[0] && nextProps.data[0].alias && this.props.routeParams.sportAlias && this.props.routeParams.sportAlias !== 'Favorites') {
                filter = this.props.timeFilter;
                for (let i = 0, length = nextProps.data.length; i < length; i++) {
                    if (nextProps.data[i] && nextProps.data[i].alias && nextProps.data[i].alias === this.props.routeParams.sportAlias) {
                        return;
                    }
                }
                ctx.router.replace(this.props.location.pathname.replace(this.props.routeParams.sportAlias, nextProps.data[0].alias));
            }
        }
    }
));