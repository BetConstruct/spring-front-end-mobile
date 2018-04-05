import {createSelector} from "reselect";
import Helpers from "./helperFunctions";
import _ from "lodash";
import Config from "../config/main";
import {checkForContent} from "./cms";
import moment from "moment";

export const GetSwarmData = state => state.swarmData.data;

export const GetSwarmLoadedState = state => state.swarmData.loaded;

export const CreateComponentSwarmDataSelector = dataKeySelector => createSelector([GetSwarmData, dataKeySelector], (data, key) => {
    let ret = _.cloneDeep(data);
    ret[key] && (ret[key].__swarmDataKey = key);
    return ret[key];
});

export const GetFilteredMarkets = dataKeySelector => {
    return createSelector(
        [
            CreateComponentSwarmDataSelector(dataKeySelector),
            state => state.gameMarkets.marketName
        ],
        (data, activeFilter) => {
            data && (data = _.cloneDeep(data));
            let ret = {sport: {}, __swarmDataKey: data && data.__swarmDataKey}, Region, Competition, Game, Sport,
                filteredMarkets = {};
            if (activeFilter !== "all") {
                if (data && data.sport) {
                    Sport = Helpers.firstElement(data.sport);
                    if (Sport) {
                        Region = Helpers.firstElement(Sport.region, null, "id");
                        Competition = Helpers.firstElement(Region.competition, null, "id");
                        Game = Helpers.firstElement(Competition.game, null, "id");
                    }
                    Object.keys(Game.market).map((marketId) => {
                        if ((Game.market[marketId].group_name === activeFilter) || (activeFilter === "Other" && !Game.market[marketId].hasOwnProperty("group_name"))) {
                            filteredMarkets[marketId] = Game.market[marketId];
                        }
                    });
                    ret.sport[Object.keys(data.sport)[0]] = Sport;
                    ret.sport[Object.keys(data.sport)[0]].region[Region.id].competition[Competition.id].game[Game.id].market = filteredMarkets;
                    return ret;
                }
            }
            return data;
        }
    );
};

export const GetMarkets = key => {
    return createSelector(
        [
            GetSwarmData,
            state => state.gameMarkets.marketName
        ],
        (data, activeFilter) => {
            let Region, Competition, Game, Sport;
            if (data && data[key] && data[key].sport) {
                Sport = Helpers.firstElement(data[key].sport);
                if (Sport) {
                    Region = Helpers.firstElement(Sport.region, null, "id");
                    Competition = Helpers.firstElement(Region.competition, null, "id");
                    Game = Helpers.firstElement(Competition.game, null, "id");
                }
            }
            return {game: Game, activeFilter};
        }
    );
};

export const CreateComponentSwarmLoadedStateSelector = dataKeySelector => createSelector([GetSwarmLoadedState, dataKeySelector], (loaded, key) => loaded[key]);

export const GetProfile = state => state.swarmData && state.swarmData.data && state.swarmData.data.profile && state.swarmData.data.profile.profile && Helpers.firstElement(state.swarmData.data.profile.profile);

export const GetBalance = createSelector(GetProfile, profile => profile && profile.balance);

export const GetUserCurrencyId = createSelector(GetProfile, profile => profile && profile.currency_id);

export const GetLoginState = state => !!(state.user && state.user.loggedIn);

export const GetCompetitionsDataSelector = (key) => {
    return createSelector(
        [
            state => Helpers.firstElement((GetSwarmData(state)[key] || {}).sport),
            state => (Helpers.firstElement((GetSwarmData(state)[key] || {}).sport) || {}).region
        ],
        (sport, region) => {
            let retData = {
                ...sport,
                region: Helpers.objectToArray(region).sort(Helpers.byOrderSortingFunc),
                totalGames: 0
            };
            retData.region = retData.region.map((region) => {
                region._totalGames = 0;
                region.competition = Helpers.objectToArray(region.competition, null,
                    ({game}) => {
                        retData.totalGames += game;
                        region._totalGames += game;
                    }).sort(Helpers.byOrderSortingFunc);
                return region;
            });
            return retData;
        }
    );
};
export const GetPopupsData = createSelector(
    [
        state => state.uiState.popup,
        state => state.uiState.popupParams,
        state => state.cmsData.loaded.popups,
        state => state.cmsData.data.popups,
        state => state.user,
        state => state.preferences
    ],
    (popup, popupParams, externalPopupsLoaded, externalPopups, user, preferences) => {
        let loadedPopups = externalPopups ? externalPopups.popups : [],
            shouldOpen,
            registrationPopup = popup === "confirm" && popupParams && popupParams.data && popupParams.data.slug === 'registration-popup';

        if (loadedPopups.length && !popup) {
            for (let i = loadedPopups.length - 1; i >= 0; i--) {
                if (registrationPopup === (loadedPopups[i].slug === 'registration-popup')) {
                    shouldOpen = loadedPopups[i];
                    break;
                }
            }
        }

        return {
            popup,
            popupParams,
            externalPopupsLoaded,
            externalPopups: loadedPopups,
            user,
            preferences,
            shouldOpen
        };
    }
);

export const GetBetslipData = createSelector(
    [
        state => state.user,
        state => state.swarmData.data.betslip,
        state => state.swarmData.loaded.betslip,
        state => state.betslip,
        state => state.user.profile && state.swarmConfigData.currency[state.user.profile.currency_id] || {
            rate: 1,
            rounding: Config.main.defaultCurrencyRounding
        },
        state => state.uiState,
        state => state.persistentUIState,
        state => state.preferences
    ],
    (user, data, loaded, betslip, currency, ui, persistentUI, preferences) => {
        return {
            user,
            data,
            loaded,
            betslip,
            currency,
            ui,
            persistentUI,
            preferences
        };
    }
);

export const GetRightMenuData = createSelector(
    [
        state => state.preferences,
        state => state.user,
        state => state.uiState.opened.rightMenu,
        state => state.cmsData.data["help-root-" + state.preferences.lang]
    ],
    (preferences, user, menuOpened, cmsData) => {
        let cmsPageData = _.cloneDeep(cmsData || {});
        cmsPageData.page && checkForContent(cmsPageData.page);

        return {
            preferences,
            user,
            menuOpened,
            cmsData: cmsPageData
        };
    }
);

export const GetLeftMenuData = () => createSelector(
    [
        state => state.swarmData.data.leftMenuSportsList,
        state => state.swarmData.loaded.leftMenuSportsList
    ],
    (data, loaded) => ({
        data: Helpers.objectToArray(data ? data.sport || {} : {}).sort(Helpers.byOrderSortingFunc),
        loaded
    })
);

export const GetSportListDataSelector = (key) => {
    return createSelector(
        [
            state => (GetSwarmData(state)[key] || {}).sport
        ],
        (sport) => {
            return Helpers.objectToArray(sport).sort(Helpers.byOrderSortingFunc);
        }
    );
};

export const GetRegionDataSelector = (key, regionId, sportAlias) => {
    return createSelector(
        [
            state => (Helpers.firstElement((GetSwarmData(state)[key] || {}).sport) || {}).region,
            state => state.favorites,
            state => state.persistentUIState.expanded
        ],
        (regions, favorites, expanded) => {
            return {
                region: regions[regionId],
                favorites,
                expanded: expanded[sportAlias + regions[regionId].alias]
            };
        }
    );
};

export const GetSearchBarData = createSelector(
    [
        state => state.swarmData.loaded.searchResults,
        state => state.swarmData.data.searchResults,
        state => state.swarmData.loaded.casinoSearchResults,
        state => state.swarmData.data.casinoSearchResults
    ],
    (searchResults, searchResultsData, casinoSearchResults, casinoSearchResultsData) => {
        return {
            loaded: {
                casinoSearchResults,
                searchResults
            },
            data: {
                searchResults: searchResultsData,
                casinoSearchResults: casinoSearchResultsData
            }
        };
    }
);
export const GetPaymentsData = createSelector(
    [
        state => state.payments,
        state => state.user.profile ? state.user.profile.currency_name : null,
        state => state.user.profile ? state.user.profile.country_code : null,
        state => state.routing.locationBeforeTransitions.pathname.indexOf("deposit") !== -1 ? "deposit" : "withdraw"
    ],
    (payments, currencyName, countryCode, transactionType) => {
        if (!currencyName || (!Config.main.showAllAvailablePaymentSystems && !payments.filters.loaded)) {
            let {data, availableMethods, filters} = payments;
            return {
                data,
                availableMethods,
                filters
            };
        }
        let paymentsObj = Config.main.payments,
            swarmPaymentFilterEnabled = !Config.main.showAllAvailablePaymentSystems,
            loadedFilters = payments.filters.data[transactionType],
            enabledKey = `can${transactionType.charAt(0).toUpperCase()}${transactionType.slice(1)}`,
            availableMethods = paymentsObj.filter(function (method) {
                if (method.info && method.info.hasOwnProperty(currencyName) && (typeof method.info[currencyName] === "object")) {
                    if ((method.countryAllow || method.countryRestrict) && countryCode) {
                        let defaultFiltered = method[enabledKey]
                            ? method.countryAllow
                                ? method.countryAllow.indexOf(countryCode) !== -1
                                : method.countryRestrict.indexOf(countryCode) === -1
                            : false;

                        return !swarmPaymentFilterEnabled
                            ? defaultFiltered
                            : defaultFiltered && (loadedFilters.includes(method.name) || (Config.main.additionalPayments && Config.main.additionalPayments.reduce((matched, additionalMethod) => {
                                !matched && (matched = (additionalMethod.name === method.name));
                                return matched;
                            }, false)));
                    }

                    return !swarmPaymentFilterEnabled
                        ? method[enabledKey]
                        : method[enabledKey] && (
                            loadedFilters.includes(method.name) || (Config.main.additionalPayments && Config.main.additionalPayments.reduce((matched, additionalMethod) => {
                                !matched && (matched = (additionalMethod.name === method.name));
                                return matched;
                            }, false))
                        );
                }
            }).map((method) => {
                let exist,
                    amountField = {
                        name: "amount",
                        type: "number",
                        label: "Amount",
                        required: true
                    };

                if (!(method.hasBetShops || method.hideDepositButton || method.depositPrefilledAmount || method.onlyInfoTextOnDeposit)) {
                    if (method.depositFormFields) {
                        method.depositFormFields.forEach((field) => {
                            if (field.name === "amount") {
                                exist = true;
                            }
                        });

                        !exist && method.depositFormFields.push(amountField);
                    } else {
                        method.depositFormFields = [amountField];
                    }
                    exist = false;
                }

                if (method.withdrawFormFields) {
                    method.withdrawFormFields.forEach((field) => {
                        if (field.name === "amount") {
                            exist = true;
                        }
                    });
                    !exist && method.withdrawFormFields.push(amountField);
                } else {
                    method.withdrawFormFields = [amountField];
                }
                return method;
            }).sort((a, b) => {
                return a.order - b.order;
            });

        return {
            ...payments,
            availableMethods
        };
    }
);

const getBetHistoryBetIdsList = createSelector(
    [
        state => state.routing.locationBeforeTransitions.pathname.indexOf('open-bets') !== -1 ? 'betHistory_unsettled' : 'betHistory_settled',
        state => state.swarmData
    ],
    (key, swarmData) => {
        let data = swarmData.data, betsList = data[key] && data[key].bets && data[key].bets.map(b => b.id),
            cashOutAbleBetIds = [];

        betsList && (cashOutAbleBetIds = data[key].bets.filter((b) => b.hasOwnProperty('cash_out')).reduce((events, bet) => {
            let eventIds = bet.events.map(evt => evt.selection_id);
            events = events.concat(eventIds);
            return events;
        }, []));

        return {
            betsList: betsList || [],
            cashOutAbleBetIds
        };
    }
);

export const GetBetHistoryDataSelector = createSelector([
    getBetHistoryBetIdsList,
    state => state.swarmData.loaded[state.routing.locationBeforeTransitions.pathname.indexOf('open-bets') !== -1 ? 'betHistory_unsettled' : 'betHistory_settled'],
    state => state.preferences,
    state => state.user,
    state => state.swarmData.data.cashOut,
    state => state.betHistoryFilters,
    state => state.routing.locationBeforeTransitions.pathname
], (bets, loaded, preferences, user, cashoutData, filters, pathName) => {
    return {
        swarmData: {
            bets: bets.betsList,
            loaded
        },
        cashOutAbleBetIds: bets.cashOutAbleBetIds,
        preferences,
        user,
        cashoutData,
        filters,
        pathName
    };
});

export const betHistoryItemSelector = (state, props) => {
    return {
        bet: state.swarmData.data[props.dataSelectorKey].bets[props.index],
        preferences: state.preferences
    };
};

export const GetOddsFormat = state => state.preferences.oddsFormat;

export const GetLoyaltyLevels = state => state.swarmData.data.loyalty_levels &&
state.swarmData.data.loyalty_levels.details &&
state.swarmData.data.loyalty_levels.details.sort((a, b) => (a.Id - b.Id));

export const GetLoyaltyRates = state => state.swarmData.data.loyalty_rates &&
state.swarmData.data.loyalty_rates.details &&
state.swarmData.data.loyalty_rates.details.reduce((acc, curr) => {
    acc[curr.CurrencyId] = curr;
    return acc;
}, {});

export const GetWithdrawsData = createSelector(
    [
        state => state.payments.withdrawals
    ],
    (withdrawals) => ({withdrawals})
);

export const _GetFreeQuizData = createSelector(
    [
        state => state.freeQuiz,
        state => state.user.reallyLoggedIn
    ],
    (freeQuiz, loggedIn) => {
        let {data, selected, day, loadedState} = Helpers.cloneDeep(freeQuiz), filtersData = [];
        let {loading, loaded, failed} = (loadedState[day] || {});
        if (loaded && data[day] && data[day].victorinas) {
            data[day].victorinas = Object.keys(data[day].victorinas);
        }
        loggedIn && data && Object.keys(data).map((index) => {
            if (loaded && data[index] && data[index].victorinas) {
                filtersData.push({day: index, text: moment().subtract(index, 'days').format(Config.main.dateFormat)});
            }
        });

        return {
            loading,
            loaded,
            failed,
            data: data[day],
            selected,
            day,
            filtersData
        };
    }
);

export const MakeQuizListItemSelector = (quizId) => {
    return createSelector(
        [
            state => state.freeQuiz.data[state.freeQuiz.day] && state.freeQuiz.data[state.freeQuiz.day].victorinas[quizId]
        ],
        (data) => {
            if (data) {
                return Helpers.objectToArray(data, "gameId").sort(Helpers.byOrderSortingFunc);
            }
            return [];
        }
    );
};