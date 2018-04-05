import {UICollapseElement, UIExpandElement, OpenPopup} from "../../actions/ui";
import {CmsLoadData, SelectProvider} from '../../actions/casino';
import Config from "../../config/main";
import Zergling from "../../helpers/zergling";
import gamesUrlFromHelpers from "../creationGamesUrl";
import {t} from "../../helpers/translator";

const addOptionsInRequest = (options, request) => {
    let list = options.split('&'),
        i = 0,
        option;
    for (; i < list.length; i += 1) {
        option = list[i].split("=");
        if (option.length === 2) {
            request[option[0]] = option[1];
        }
    }
};

export function HandleProviderClick (provider, callBack) {
    this.props.casino.selectedCategory !== 'favorite' && this.props.dispatch(UICollapseElement(`casino_categories_${this.props.casino.selectedCategory}::${this.props.casino.selectedProvider}`));
    this.props.casino.selectedCategory !== 'favorite' && this.props.dispatch(UIExpandElement(`casino_categories_${this.props.casino.selectedCategory}::${provider}`));
    this.props.dispatch(SelectProvider(provider));
    callBack && callBack();
    if ((!!this.props.casino.gamesList[`casino_categories_${this.props.casino.selectedCategory}::${provider}`] && !!this.props.casino.gamesList[`casino_categories_${this.props.casino.selectedCategory}::${provider}`].loaded) || this.props.casino.selectedCategory === 'favorite') {
        return;
    }
    return this.props.dispatch(CmsLoadData('getGames', this.props.casino.selectedCategory, provider));
}

export function HandleOpenGameClick (game, playType, authorized, isMostPopular, studioId) {
    let gameUrl,
        casinoUrl = gamesUrlFromHelpers.processingGamesUrl().casinoUrl,
        casinoBackendUrl = gamesUrlFromHelpers.processingGamesUrl().casinoBackendUrl,
        gameOption = game.game_options ? game.game_options : "",
        request,
        urlPrefix,
        userInfo,
        self = this;

    if (isMostPopular) {
        switch (true) {
            case !!game.link && authorized:
                return (window.location.href = game.link);
            case !!game.link && !authorized:
                return this.props.dispatch(OpenPopup("LoginForm"));
            default :
                return;
        }
    }

    if (!game.types.realMode && !game.types.viewMode && !game.types.funMode) {
        return;
    }

    if (!playType) {
        playType = authorized && game.types.realMode ? 'real' : 'fun';
    }
    if (playType === 'real' && !game.types.realMode) {
        playType = 'fun';
    }

    if ((playType === 'real' && !authorized)) {
        return this.props.dispatch(OpenPopup("LoginForm"));
    }

    if (Config.casino.providersThatWorkWithSwarm && (Config.casino.providersThatWorkWithSwarm.indexOf(game.provider) !== -1)) {
        request = {
            'provider': game.provider,
            'game_id': game.front_game_id,
            'external_game_id': game.extearnal_game_id,
            'mode': playType,
            'skin_host': casinoUrl
        };

        !!studioId && (request.studio = studioId);

        if (gameOption) {
            addOptionsInRequest(gameOption, request);
        }
        return Zergling.get(request, 'casino_game_url').then(function (data) {
            if (data && data.url) {
                window.location.href = data.url;
            } else {
                return self.props.dispatch(OpenPopup("message", {
                    type: "warning",
                    body: t("Sorry something went wrong please try again later")
                }));
            }
        }, function (reason) {
            return self.props.dispatch(OpenPopup("message", {
                type: "warning",
                body: t("Sorry something went wrong please try again later")
            }));
        });
    } else {
        urlPrefix = Config.casino.providersThatWorkWithCasinoBackend && Config.casino.providersThatWorkWithCasinoBackend.providers.indexOf(game.provider) !== -1 ? casinoBackendUrl + Config.casino.gamesUrl : casinoUrl + Config.casino.gamesUrl;
        gameUrl = urlPrefix + '?gameid=' + game.front_game_id + '&mode=' + playType + '&type=' + game.provider +
            '&lan=' + Config.env.lang + '&partnerid=' + Config.main.site_id + gameOption;

        !!studioId && (gameUrl += ('&studio=' + studioId));

        if (playType === 'real') {
            return Zergling.get({'game_id': parseInt(game.extearnal_game_id)}, 'casino_auth').then(function (response) {
                if (response && response.result) {
                    if (response.result.has_error === "False") {
                        userInfo = '&token=' + response.result.token + '&username=' + response.result.username + '&balance=' + response.result.balance + '&currency=' + response.result.currency + '&userid=' + response.result.id;
                        window.location.href = (gameUrl + userInfo);
                        return;
                    } else if (response.result.has_error === "True") {
                        return self.props.dispatch(OpenPopup("message", {
                            type: "warning",
                            body: t("Sorry something went wrong please try again later")
                        }));
                    }
                    return self.props.dispatch(OpenPopup("message", {
                        type: "warning",
                        body: t("Sorry something went wrong please try again later")
                    }));
                }
            }, function () {
                return self.props.dispatch(OpenPopup("message", {
                    type: "warning",
                    body: t("Sorry something went wrong please try again later")
                }));
            });
        } else {
            window.location.href = gameUrl;
        }
    }

}