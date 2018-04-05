import Config from "../config/main";

let gamesUrlFromHelpers = (function () {
    let siteUrl = window.location.origin,
        domainPrefix,
        i = 0,
        domainPrefixVersions = ['://m.', '://mobile.', '://mobil.'],
        replaceablePartForCasino = Config.casino && Config.casino.replaceGamesWithLaunchgames ? '://launchgames.' : '://games.',
        gameUrl = {};
    for (; i < domainPrefixVersions.length; i++) {
        if (siteUrl.indexOf(domainPrefixVersions[i]) !== -1) {
            domainPrefix = domainPrefixVersions[i];
            break;
        } else {
            domainPrefix = '';
        }
    }
    return {
        processingGamesUrl: function () {
            gameUrl.casinoBackendUrl = (Config.casino && Config.casino.providersThatWorkWithCasinoBackend && Config.casino.providersThatWorkWithCasinoBackend.url) ? Config.casino.providersThatWorkWithCasinoBackend.url : siteUrl.replace(domainPrefix, '://launchgames.');
            gameUrl.casinoUrl = (Config.casino && Config.casino.urlPrefix) ? Config.casino.urlPrefix : siteUrl.replace(domainPrefix, replaceablePartForCasino);
            gameUrl.beloteUrl = siteUrl.replace(domainPrefix, "://belote.");
            gameUrl.backgammonUrl = siteUrl.replace(domainPrefix, "://backgammon.");
            gameUrl.matchCenterUrl = siteUrl.replace(domainPrefix, "://mc.");
            gameUrl.chingaChoongUrl = siteUrl.replace(domainPrefix, "://chingachung.");
            return gameUrl;
        }
    };
})();
export default gamesUrlFromHelpers;