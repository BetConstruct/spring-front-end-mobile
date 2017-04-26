import Helpers from "../helperFunctions";
import Config from "../../config/main";

/**
 * Returns games count in a sport object
 * @param {Object} sport sport data object (a tree having sport->region->competition->game structure)
 * @returns {number} number of games in a tree
 */
export function GetSportGamesCount (sport) {
    var gamesCount = 0;
    Object.keys(sport).map(
        sportId => Object.keys(sport[sportId].region).map(
            regionId => Object.keys(sport[sportId].region[regionId].competition).map(
                competitionId => {
                    gamesCount += Object.keys(sport[sportId].region[regionId].competition[competitionId].game).length;
                }
            )
        )
    );
    return gamesCount;
}
/**
 * List of market types having p1 x p2 events
 * @type {string[]}
 */
export const P1XP2MarketTypes = ["P1XP2", "P1P2", "MatchWinner", "MatchResult"];

/**
 * Checks if game has X (draw) market
 * @param {Object} game game object
 * @returns {boolean}
 */
export function hasXMarket (game) {
    return getPrimaryMarketType(game) === "P1XP2";
}

/**
 * Checks if game has P1 or P2 markets
 * @param {Object} game game object
 * @returns {boolean}
 */
export function hasP1P2Market (game) {
    var primaryMarketType = getPrimaryMarketType(game);
    return P1XP2MarketTypes.indexOf(primaryMarketType) !== -1;
}

/**
 * Returns game's first market type
 * @param {Object} game game object
 * @returns {String|null}
 */
export function getPrimaryMarketType (game) {
    var market = game && Helpers.firstElement(game.market);
    return market && market.type;
}

/**
 * Returns number of game's additional markets with "+" sign or null if there are no additional markets
 * @param {Object} game game object
 * @returns {String|null}
 */
export function additionalMarketsCount (game) {
    let alreadyShown = hasP1P2Market(game) ? 1 : 0;
    return game.markets_count - alreadyShown > 0 ? "+" + (game.markets_count - alreadyShown) : null;
}

/**
 * Returns statistics page link for game
 * @param {Object} game game object
 * @param {String} language language code
 * @returns {string} the link
 */
export function getStatsLink (game, language) {
    let statLang = Config.main.availableLanguages[language].short.toLowerCase() || Config.main.statsHostname.defaultLang;
    let hostName = Config.main.statsHostname.prefixUrl + statLang + Config.main.statsHostname.subUrl;
    if (Config.main.GmsPlatform) {
        return hostName + 'redirect/' + game.id;
    }
    if (game.game_external_id) {
        return hostName + 'redirect/' + game.game_external_id;
    }
    return hostName + 'h2h/' + game.team1_external_id + '/' + game.team2_external_id;
}