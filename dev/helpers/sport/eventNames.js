import Config from "../../config/main";

const replacements = {
        "eng": {
            "Team 1": "team1_name",
            "Player 1": "team1_name",
            "team 1": "team1_name",
            "Team 2": "team2_name",
            "Player 2": "team2_name",
            "team 2": "team2_name",
            "W1": "team1_name",
            "W2": "team2_name",
            "Home": "team1_name",
            "Away": "team2_name"
        },
        "rus": {
            "Ком. 1": "team1_name",
            "Ком1": "team1_name",
            "Ком. 2": "team2_name",
            "Ком2": "team2_name",
            "П1": "team1_name",
            "П2": "team2_name",
            "W1": "team1_name",
            "W2": "team2_name",
            "Home": "team1_name",
            "Away": "team2_name"
        },
        "arm": {
            "Խաղացող 1": "team1_name",
            "Խաղացող 2": "team2_name",
            "Թիմ 1": "team1_name",
            "Թիմ 2": "team2_name",
            "Հ1": "team1_name",
            "Հ2": "team2_name"
        },
        "tur": {
            "G1": "team1_name",
            "G2": "team2_name",
            "Home": "team1_name",
            "Away": "team2_name"
        }
    },
    exactReplacements = {
//            '1' : 'team1_name',
        ' 1': 'team1_name',
        '1 ': 'team1_name',
//            '2' : 'team2_name',
        '2 ': 'team2_name',
        ' 2': 'team2_name'
    },
    cache = {};

/**
 * Returns a readable event name (replaces special values like "1", "W1", "team1", etc. with real team name)
 * @param {String} rawName raw event name
 * @param {Object} game the game object to take team names from
 * @returns {*}
 */
export function niceEventName (rawName, game) {
    if (!rawName) {
        return;
    }
    var cacheKey = rawName + (game && (game.id || ''));
    if (cache[cacheKey] === undefined) {
        cache[cacheKey] = rawName;
        var lang = replacements[Config.env.lang] === undefined ? 'eng' : Config.env.lang;
        if (exactReplacements[cache[cacheKey]]) {
            cache[cacheKey] = game[exactReplacements[cache[cacheKey]]];
        } else if (replacements[lang]) {
            Object.keys(replacements[lang]).map((term) => {
                let fieldName = replacements[lang][term];
                if (game && game[fieldName]) {
                    while ((game[fieldName].lastIndexOf(term) === -1) && (cache[cacheKey] != cache[cacheKey].replace(term, game[fieldName] + ' '))) {
                        cache[cacheKey] = cache[cacheKey].replace(term, game[fieldName] + ' ');
                    }
                }
            });
        }
    }
    return cache[cacheKey];
}

/**
 * Displays event base based on market type and base value
 * @param {Object} event
 * @param initialBase
 * @returns {string}
 */
export function displayEventBase (event, initialBase = null) {
    var baseFieldName = initialBase ? 'baseInitial' : 'base';
    var prefix = (event.marketType && event.marketType.substr(-8) === 'Handicap' && event[baseFieldName] > 0 ? '+' : '');

    return prefix + (event.eventBases && !Config.main.displayEventsMainBase ? event.eventBases.join("-") : event[baseFieldName]);
}
