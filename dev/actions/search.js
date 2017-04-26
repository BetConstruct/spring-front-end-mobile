import 'whatwg-fetch';
import Zergling from '../helpers/zergling';
import Config from "../config/main";
import {CmsLoadData} from '../actions/casino';

import {SwarmLoadingStart, SwarmLoadingDone, SwarmReceiveData} from './swarm';

/**
 * @description Search sport events
 * @param {String} term
 * @returns {Function} async action dispatcher
 */
export function DoSportSearch (term) {
    var lang = Config.swarm.languageMap[Config.env.lang] || Config.env.lang;
    var like = {[lang]: term};

    let swarmRequestGames = {
        'source': 'betting',
        'what': {
            'competition': [],
            'region': ["alias"],
            'game': ['type', 'start_ts', 'team1_name', 'team2_name', 'id'],
            'sport': ['id', 'name', 'alias']
        },
        'where': {
            'game': {
                '@limit': 10,
                '@or': [
                    {'team1_name': {'@like': like}},
                    {'team2_name': {'@like': like}}
                ]
            }
        }
    };
    let swarmRequestCompetitions = {
        'source': 'betting',
        'what': {
            'competition': [],
            'region': ["alias"],
            'game': ['type', 'start_ts', 'team1_name', 'team2_name', 'id'],
            'sport': ['id', 'name', 'alias']
        },
        'where': {
            'competition': {
                'name': {'@like': like}
            }
        }
    };

    return function (dispatch) {
        var swarmDataKey = "searchResults";
        dispatch(SwarmLoadingStart(swarmDataKey));
        var searchRequests = [Zergling.get(swarmRequestGames), Zergling.get(swarmRequestCompetitions)];
        Promise.all(searchRequests).then(response => {
            dispatch(SwarmReceiveData(processSearchResults(response), swarmDataKey));
        }).catch().then(() => dispatch(SwarmLoadingDone(swarmDataKey)));
    };
}

/**
 * @description Search sport events
 * @param {Object} results
 * @returns {Object} Search results
 */
function processSearchResults (results) {
    let searchResults = {}, order = 0;
    results.map(
        result => Object.keys(result.data.sport).map(
            sportId => Object.keys(result.data.sport[sportId].region).map(
                regionId => Object.keys(result.data.sport[sportId].region[regionId].competition).map(
                    competitionId => Object.keys(result.data.sport[sportId].region[regionId].competition[competitionId].game).map(
                        gameId => {
                            let sport = result.data.sport[sportId],
                                region = sport.region[regionId],
                                competition = region.competition[competitionId],
                                game = competition.game[gameId];
                            searchResults[sport.id] = searchResults[sport.id] || {order: order++, results: [], name: sport.name, alias: sport.alias};
                            searchResults[sport.id].results.push({
                                game: game,
                                start_ts: game.start_ts, //for sorting
                                region: {alias: region.alias},
                                competition: {name: competition.name, id: competition.id}
                            });
                        }
                    )
                )
            )
        )
    );
    return searchResults;
}

/**
 * @description Search casino games
 * @param {String} term
 * @returns {Function} async action dispatcher
 */
export function DoCasinoSearch (term) {
    return function (dispatch) {
        let swarmDataKey = "casinoSearchResults";
        CmsLoadData("searchForCasinoGames", null, null, null, null, term)(dispatch,
            () => {
                dispatch(SwarmLoadingStart(swarmDataKey));
            },
            (response) => {
                dispatch(SwarmReceiveData(response, swarmDataKey));
                dispatch(SwarmLoadingDone(swarmDataKey));
            },
            () => {
                dispatch(SwarmLoadingDone(swarmDataKey));
            },
            true
        );
        //TODO: perform a search, then dispatch(SwarmReceiveData(response, swarmDataKey));
    };
}