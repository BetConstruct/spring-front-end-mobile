import React from 'react';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import 'whatwg-fetch';
import {
    CreateComponentSwarmDataSelector,
    CreateComponentSwarmLoadedStateSelector,
    GetBalance
} from "../../../helpers/selectors";
import {SwarmDataMixin, getSwarmDataKeyForRequest} from '../../../mixins/swarmDataMixin';
import Config from "../../../config/main";
import Zergling from "../../../helpers/zergling";
import Helpers from "../../../helpers/helperFunctions";
import {hasVideo} from '../../../helpers/sport/videoFilter';
import {getVideoURL} from "../../../helpers/sport/gameHelpers";

function checkStatus (response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    } else {
        var error = new Error(response.statusText);
        error.response = response;
        throw error;
    }
}

const Game = React.createClass({
    getGameInfo (props) {
        let data = props.swarmDataLoaded && props.swarmData;
        let Sport, Region, Competition, Game;
        if (data && data.sport) {
            Sport = Helpers.firstElement(data.sport);
            if (Sport) {
                Region = Helpers.firstElement(Sport.region);
                Competition = Helpers.firstElement(Region.competition);
                Game = Helpers.firstElement(Competition.game);
            }
        }
        this.game = Game;
        return {data, Sport, Region, Competition, Game, hasVideo: this.game && hasVideo(this.game)};
    },
    loadVideoData (game, evenIfNotLoggedIn) {
        let profile = this.props.user.profile || {},  //eslint-disable-line react/prop-types
            calculatedBalance = parseFloat(profile.balance - (profile.frozen_balance !== undefined ? profile.frozen_balance : 0));
        //eslint-disable-next-line react/prop-types
        if (!game || (!evenIfNotLoggedIn && !this.props.user.loggedIn) ||
            game.tv_type === undefined || game.video_id === undefined ||
            (parseFloat(profile.initial_balance) === 0 && calculatedBalance === 0)) {
            this.videoData = null;
            this.videoDataLoaded = false;
            return;
        }

        if (this.videoDataLoaded || this.videoDataLoading || !hasVideo(game)) {
            return;
        }

        this.videoDataLoading = true;

        let params = {
            video_id: game.video_id,
            provider: game.tv_type,
            use_hls: true
        };
        return Zergling
            .get(params, 'video_url')
            .then(data => {
                if (typeof data === 'string' && data.indexOf('dge') === -1 && data.indexOf('.m3u8') !== -1) {
                    setVideoData.apply(this, [data, false, true]);
                    return;
                }
                if (data) {
                    fetch(data).then(checkStatus).then(response => response.json()).then((data) => {
                        if (params.provider === 1) {
                            setVideoData.apply(this, [getVideoURL(data.data), false, true]);
                        } else if (Config.main.video.useHlsUrlFromResponse || params.provider === 5) {
                            setVideoData.apply(this, [data.hlsUrl ? data.hlsUrl : data.data && data.data.hlsUrl || '', false, true]);
                        } else if (data.url && typeof data.url === "string" && data.url.indexOf('dge') !== -1) {
                            setVideoData.apply(this, [data.url, false, true]);
                        }
                    }).catch(e => {
                        console.warn("cannot load video data", e);
                    });
                }
            })
            .catch(e => { console.warn("cannot load video data", e); })
            .then(() => { this.videoDataLoaded = true; this.videoDataLoading = false; });
    },
    componentWillReceiveProps (nextProps) {
        if (Config.main.video.enabled) {
            !this.game && this.getGameInfo(nextProps);
            this.loadVideoData(this.game, Config.main.video.evenIfNotLoggedIn || (nextProps.user.loggedIn && nextProps.balance > 0)); //eslint-disable-line react/prop-types
        }
    },
    render () {
        return Template.apply(this); //eslint-disable-line no-undef
    }
});

// implemented using reselect not to compute hash(getSwarmDataKeyForRequest) until it's really necessary
let getGameId = (state, props) => parseInt(props.routeParams.gameId, 10);
let getSwarmDataKey = createSelector(getGameId, gameId => getSwarmDataKeyForRequest(getSwarmSubscriptionRequest(gameId)));

function setVideoData (url, videoDataLoading, videoDataLoaded) {
    this.videoData = url;
    this.videoDataLoading = videoDataLoading;
    this.videoDataLoaded = videoDataLoaded;
    this.forceUpdate();
}

function getSwarmSubscriptionRequest (gameId) {
    return {
        "source": "betting",
        "what": {
            "sport": ["name", "alias"],
            "region": ["name", "alias"],
            "competition": ["name", "id"],
            "game": [],     // TODO: request only needed properties
            // "id", "team1_name", "team2_name", "order", "start_ts", "markets_count", "is_blocked", "exclude_ids"
            "market": ["name", "type", "id", "market_type", "order", "col_count", "express_id", "cashout", "base"], // "group_id", "group_name"
            "event": ["id", "order", "name", "price", "type", "base"]
        },
        "where": {
            "game": {"id": gameId}
        }
    };
}

function mapStateToProps (state, ownParams) {
    return {
        user: state.user,
        balance: GetBalance(state),
        swarmData: CreateComponentSwarmDataSelector(getSwarmDataKey)(state, ownParams),
        swarmDataLoaded: CreateComponentSwarmLoadedStateSelector(getSwarmDataKey)(state, ownParams),
        favorites: state.favorites,
        preferences: state.preferences,
        ui: state.persistentUIState,
        uiState: state.uiState,
        ownParams: ownParams
    };
}

export default connect(mapStateToProps)(SwarmDataMixin(
    {
        Component: Game,
        ComponentWillReceiveProps: function (nextProps) {
            if (nextProps.routeParams.gameId !== this.props.routeParams.gameId) { //eslint-disable-line react/prop-types
                console.debug("game id changed!", nextProps.routeParams.gameId);
                this.swarmSubscriptionRequest = getSwarmSubscriptionRequest(getGameId(null, nextProps));
                this.swarmDataKey = undefined; // to generate a new one when subscribing
                this.resubscribe();
            }
        },
        ComponentWillMount: function () {
            this.swarmSubscriptionRequest = getSwarmSubscriptionRequest(getGameId(null, this.props));
        }
    }
));