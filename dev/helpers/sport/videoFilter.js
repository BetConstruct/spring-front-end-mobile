import Config from "../../config/main";

/**
 * @description Create video request list for available providers.
 * @returns {Array}
 */

export function getVideoFilterRequest () {
    if (Config.main.video.enableOptimization) {
        return {
            video_provider: {'@ne': null}
        };
    }

    let filterList = [], availableProviders = Config.main.video.availableVideoProviderIds;

    for (var i = 0, length = availableProviders.length; i < length; i += 1) {
        switch (availableProviders[i]) {
            case 1:         // PerformGroup
                filterList.push({tv_type: 1, video_id: {'@gt': 0}});
                break;
            case 3:         // Unas TV
                filterList.push({video_id: {'@lt': 0}});
                break;
            case 5:         // IMG
                filterList.push({tv_type: 5, video_id: {'@gt': 0}});
                break;
            case 6:         // Private TV
                filterList.push({video_id2: {'@gt': 0}});
                break;
            case 7:         // Futsal1
            case 8:         // Futsal2
            case 11:        // Hockey
            case 12:        // futsal3
            case 16:        // ua_tv
            case 19:        // E-Football
            case 26:        // private vivaro
                filterList.push({tv_type: availableProviders[i]});
                break;
            case 17:        // urakulas_tv
            case 21:        // dota streaming
            case 22:        // dota streaming
            case 23:        // dota streaming
                filterList.push({video_id3: {'@gt': 0}});
                break;
            case 25:        // dota streaming
                filterList.push({tv_type: 25, video_id: {'@gt': 0}});
                break;
            case 15:         // VIRTAUL_SPORTS
                filterList.push({tv_type: 15, video_id: {'@gt': 0}});
                break;
            case 18: //IMG for topsport
                filterList.push({partner_video_id: true});
                break;
            case 28:         // Alba solution
                filterList.push({tv_type: 28, video_id: {'@gt': 0}});
                break;
            case 999999:    // horce racing
                filterList.push({video_id: 999999});
                break;
            default:
                break;
        }
    }
    return filterList;
}

/**
 * Checks if game has video
 * @param game
 * @returns {*|boolean}
 */
export const hasVideo = (game) => {
    if (Config.main.video.enableOptimization) {
        if (game.video_provider) {
            game.tv_type = game.video_provider[0];
            game.video_id = game.video_provider[1];
            return true;
        }
        game.video_id = undefined;
        return false;
    }
    if (game.tv_type === 15 && game.video_id && Config.main.video.availableVideoProviderIds.indexOf(game.tv_type) !== -1) {  // virtual sports
        return true;
    }
    if (game.type === 1) { // games from 'prematch'  can't have video streams
        if ([1, 3, 5, 25, 28].indexOf(game.tv_type) !== -1 && game.video_id && Config.main.video.availableVideoProviderIds.indexOf(game.tv_type) !== -1) {
            return true;
        }
        if (game.video_id < 0 && Config.main.video.availableVideoProviderIds.indexOf(3) !== -1) {
            game.tv_type = 3;
            return true;
        }
        if (game.video_id2 && Config.main.video.availableVideoProviderIds.indexOf(6) !== -1 && (!game.tv_type || (game.tv_type !== 19 && game.tv_type !== 16))) {
            game.video_id = game.video_id2;
            game.tv_type = 6;
            return true;
        }
        if ([7, 8, 11, 12, 16, 19, 26].indexOf(game.tv_type) !== -1 && Config.main.video.availableVideoProviderIds.indexOf(game.tv_type) !== -1) {
            return true;
        }
        if (game.video_id === 999999 && Config.main.video.availableVideoProviderIds.indexOf(999999) !== -1) { // the horse racing case
            game.tv_type = 999999;
            return true;
        }
        if (game.video_id3 && Config.main.video.availableVideoProviderIds.indexOf(17) !== -1 && (!game.tv_type || game.tv_type !== 21)) {
            game.video_id = game.video_id3;
            game.tv_type = 17;
            return true;
        }
        if (game.video_id3 && ((game.tv_type === 21 && Config.main.video.availableVideoProviderIds.indexOf(21) !== -1) || (game.tv_type === 22 && Config.main.video.availableVideoProviderIds.indexOf(22) !== -1) || (game.tv_type === 23 && Config.main.video.availableVideoProviderIds.indexOf(23) !== -1))) {
            game.video_id = game.video_id3;
            return true;
        }
        if (game.partner_video_id && Config.main.video.availableVideoProviderIds.indexOf(24) !== -1) {
            game.video_id = game.partner_video_id;
            game.tv_type = 24;
            return true;
        }
        if (game.partner_video_id && Config.main.video.availableVideoProviderIds.indexOf(18) !== -1) {
            game.video_id = game.partner_video_id;
            game.tv_type = 18;
            return true;
        }
    }

    game.video_id = undefined;
    return false;
};
