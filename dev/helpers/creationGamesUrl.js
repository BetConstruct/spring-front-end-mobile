import Config from "../config/main";

let gamesUrlFromHelpers = (function () {
    let siteUrl = window.location.origin,
        replaceablePartForCasino = Config.casino && Config.casino.replaceGamesWithLaunchgames ? '://launchgames.' : '://games.',
        casinoUrl,
        casinoBackendUrl,
        beloteUrl,
        backgammonUrl,
        matchCenterUrl;
    return {
        /**
         * @description returns "weighted" random element of array
         * @return {String} generated url for casino games (providers That Work With Casino Backend)
         */
        processingCasinoBackendUrl: function () {
            switch (true) {
                case !!(Config.casino && Config.casino.providersThatWorkWithCasinoBackend && Config.casino.providersThatWorkWithCasinoBackend.url):
                    casinoBackendUrl = Config.casino.providersThatWorkWithCasinoBackend.url;
                    break;
                case siteUrl.indexOf("://m.") !== -1:
                    casinoBackendUrl = siteUrl.replace("://m.", '://launchgames.');
                    break;
                case siteUrl.indexOf("://mobile.") !== -1:
                    casinoBackendUrl = siteUrl.replace("://mobile.", '://launchgames.');
                    break;
                default:
                    return '';
            }
            return casinoBackendUrl;
        },

        /**
         * @description returns "weighted" random element of array
         * @return {String} generated url for casino games
         */
        processingCasinoUrl: function () {
            switch (true) {
                case !!(Config.casino && Config.casino.urlPrefix):
                    casinoUrl = Config.casino.urlPrefix;
                    break;
                case siteUrl.indexOf("://m.") !== -1:
                    casinoUrl = siteUrl.replace("://m.", replaceablePartForCasino);
                    break;
                case siteUrl.indexOf("://mobile.") !== -1:
                    casinoUrl = siteUrl.replace("://mobile.", replaceablePartForCasino);
                    break;
                default:
                    return '';
            }
            return casinoUrl;
        },
        /**
         * @description returns "weighted" random element of array
         * @return {String} generated url for Belote
         */
        processingBeloteUrl: function () {
            switch (true) {
                case siteUrl.indexOf("://m.") !== -1:
                    beloteUrl = siteUrl.replace("://m.", "://belote.");
                    break;
                case siteUrl.indexOf("://mobile.") !== -1:
                    beloteUrl = siteUrl.replace("://mobile.", "://belote.");
                    break;
                default:
                    return '';
            }
            return beloteUrl;
        },
        /**
         * @description returns "weighted" random element of array
         * @return {String} generated url for Backgammon
         */
        processingBackgammonUrl: function () {
            switch (true) {
                case siteUrl.indexOf("://m.") !== -1:
                    backgammonUrl = siteUrl.replace("://m.", "://backgammon.");
                    break;
                case siteUrl.indexOf("://mobile.") !== -1:
                    backgammonUrl = siteUrl.replace("://mobile.", "://backgammon.");
                    break;
                default:
                    return '';
            }
            return backgammonUrl;
        },
        /**
         * @description returns "weighted" random element of array
         * @return {String} generated url for MatchCenter
         */
        processingMatchCenterUrl: function () {
            switch (true) {
                case siteUrl.indexOf("://m.") !== -1:
                    matchCenterUrl = siteUrl.replace("://m.", "://mc.");
                    break;
                case siteUrl.indexOf("://mobile.") !== -1:
                    matchCenterUrl = siteUrl.replace("://mobile.", "://mc.");
                    break;
                default:
                    return '';
            }
            return matchCenterUrl;
        }
    };

})();

export default gamesUrlFromHelpers;