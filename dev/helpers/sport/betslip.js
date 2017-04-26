import React from "react";
import Config from "../../config/main";
import {t} from "../translator";
import {niceEventName} from "./eventNames";
import {BetslipSetSystemOpt, GetSuperBetInfo} from "../../actions/betslip";
import {OpenPopup} from "../../actions/ui";

export const BETSLIP_TYPE_SINGLE = 1;
export const BETSLIP_TYPE_EXPRESS = 2;
export const BETSLIP_TYPE_SYSTEM = 3;
export const BETSLIP_TYPE_CHAIN = 4;

export const BetslipTypes = {
    [BETSLIP_TYPE_SINGLE]: "Single",
    [BETSLIP_TYPE_EXPRESS]: "Express",
    [BETSLIP_TYPE_SYSTEM]: "System",
    [BETSLIP_TYPE_CHAIN]: "Chain"
};
if (Config.betting && Config.betting.disableBetslipTypes) {
    for (let i in Config.betting.disableBetslipTypes) {
        delete BetslipTypes[Config.betting.disableBetslipTypes[i]];
    }
}
/**
 * Returns single bet object to be put in store
 * @param {Object} game game object
 * @param {Object} market market object
 * @param {Object} event event object
 * @param {String} oddType odd type, "odd" or "sp"
 * @returns {Object}
 */
export const createBetslipEventObject = (game, market, event, oddType = "odd") => {
    return {
        oddType: oddType,
        gameId: game.id,
        blocked: game.is_blocked || event.price === 1,
        marketName: market.name,
        marketType: market.type,
        expressId: market.express_id,
        excludeIds: game.exclude_ids,
        eventId: event.id,
        eventType: event.type,
        ewAllowed: !!event.ew_allowed, //each way
        expMinLen: game.express_min_len,
        isLive: !!game.is_live || (game.type === 1),
        eachWay: false,
        incInSysCalc: true,
        singleStake: '',
        singleUnitStake: '', // each way
        initialPrice: event.price,
        initialBase: event.base || market.base,
        eventBases: (event.base1 !== undefined && event.base2 !== undefined) ? [event.base1, event.base2] : undefined,
        title: game.team1_name + " " + (game.team2_name || ""),
        pick: niceEventName(event.name, game),
        processing: false
    };
};

/**
 * Checks if  "bet" has conflict with one of bets "allBets" (has same express_id in same game or exists in exclude_ids)
 * @param {Object} allBets betslip bets
 * @param {Object} bet single bet
 * @returns {Array} conflicts
 */
export function geBetConflicts (allBets, bet) {
    var conflicts = [];

    Object.keys(allBets).map(id => {
        let b = allBets[id];
        if (parseInt(id, 10) === bet.eventId) { // can't have conflict with itself
            return;
        }
        if (
            (b.gameId === bet.gameId && (bet.expressId === undefined || b.expressId === bet.expressId)) || b.gameId === bet.excludeIds || b.excludeIds === bet.gameId

        ) {
            conflicts.push(b.eventId);
        }
    });
    return conflicts;
}

/**
 * Checks if bets in a list are conflicting with each other and sets "conflicts" field of corresponding bets
 * @param {Object} allBets
 */
export function detectConflicts (allBets) {
    Object.keys(allBets).map(id => {
        allBets[id].conflicts = geBetConflicts(allBets, allBets[id]);
    });
}

/**
 * Calculates factorial
 * @param {Number} x
 * @returns {number}
 */
function factorial (x) {
    if (x !== undefined && !isNaN(x) && x >= 0) {
        return x === 0 ? 1 : (x * factorial(x - 1));
    }
}

/**
 * Merges data from swarm with data from store and returns betslip events and info
 * @param swarmEventData data from swarm
 * @param storeBetSlipData data from store
 * @returns {{events: Array, info: {}}}
 */
export function getBetslipData (swarmEventData, storeBetSlipData) {
    let events = [], info = {}, sameGameIds = {}, totalStake = 0;
    if (swarmEventData && storeBetSlipData) {
        Object.keys(storeBetSlipData.events).map(eventId => {
            var bet = storeBetSlipData.events[eventId];
            // var bet = Object.assign({}, storeBetSlipData.events[eventId]);
            if (bet.singleStake) {
                totalStake += 1 * bet.singleStake;
            }
            if (swarmEventData.event[eventId]) {
                bet.available = true;
                bet.price = swarmEventData.event[eventId].price;
                bet.base = swarmEventData.event[eventId].base;
                bet.betterOdd = calcBetterOdd(bet.price);
                info.priceChange = info.priceChange || (bet.initialPrice !== swarmEventData.event[eventId].price);
                info.priceWentDown = info.priceWentDown || (bet.initialPrice < swarmEventData.event[eventId].price);
                info.baseChange = info.baseChange || (bet.initialBase !== swarmEventData.event[eventId].base);
                info.hasEventsFromSameGame = sameGameIds[bet.gameId] ? true : info.hasEventsFromSameGame;
                sameGameIds[bet.gameId] = true;
                info.hasEachWayReadyEvents = bet.ewAllowed ? true : info.hasEachWayReadyEvents;
                info.hasSingleOnlyEvents = bet.expMinLen === 1 ? true : info.hasSingleOnlyEvents;
                info.hasLiveEvents = bet.isLive ? true : info.hasLiveEvents;
                info.hasConflicts = info.hasConflicts || bet.conflicts.length > 0;
                info.hasLockedEvents = bet.blocked ? true : info.hasLockedEvents;
                info.hasSpOddTypes = bet.oddType !== "odd" ? true : info.hasSpOddTypes;
                info.hasWrongStakes = info.hasWrongStakes || (isNaN(parseFloat(bet.singleStake)) && bet.singleStake !== "") || parseFloat(bet.singleStake) < 0;
                info.hasEmptyStakes = storeBetSlipData.type === BETSLIP_TYPE_SINGLE && (info.hasEmptyStakes || isNaN(parseFloat(bet.singleStake)) || parseFloat(bet.singleStake) === 0);
            } else {
                bet.available = false;
                info.hasDeletedEvents = true;
            }
            events.push(bet);
        });
    }
    return {events, info, totalStake};
}

/**
 * Returns <select> element with available system options based on number of bets in betslip
 * @param {Object} betslip
 * @param {Function} dispatch
 * @returns {*}
 */
export function SystemOptionsSelect (betslip, dispatch) {
    var i, options = [];
    let numberOfBets = (Object.keys(betslip.events) || []).length;
    for (i = 0; i < numberOfBets; i++) {
        if (options.length < (numberOfBets - 2 - betslip.bankerBetsCount) && i > 1) {
            options.push(<option key={i} value={i}>{`${i}/${numberOfBets - betslip.bankerBetsCount}`}
                ({calculateSystemOptionsCount(i, numberOfBets)} {t("opt.")})</option>);
        }
    }
    return options.length
        ? <select
            onChange={(e) => dispatch(BetslipSetSystemOpt(e.target.value))}
            value={betslip.sysOptionValue}
            >{options}</select>
        : null;
}

/**
 * @name calculateSystemOptionsCount
 * @methodOf betting.controller:betSlipController
 * @param {Number} k of selected events
 * @param {Number} numberOfBets number of bets in betslip
 * @param {Number} bankerBetsCount bankers bet count
 * @description calculate system options count
 */
export function calculateSystemOptionsCount (k, numberOfBets, bankerBetsCount = 0) {
    return Math.round(factorial(numberOfBets - bankerBetsCount) / (factorial(k) * factorial(numberOfBets - k - bankerBetsCount)));
}

/**
 * @ngdoc method
 * @name calculateSystemPossibleWin
 * @methodOf betting.controller:betSlipController
 * @returns {Object} possible win and options count
 * @description calculate system possible winning sets system selected value
 */
export function calculateSystemPossibleWin (allBets, sysBetSelectedValue, stake, bankerBetsCount, eachWayMode) {
    var tempPosWin = 0;
    var tempPosEwWin = 0;
    var indexArray = [];
    var indexMaxArray = [];
    var tempOdd;
    var tempEwOdd;
    var tempIterator;
    var numOfSysOptions;
    var sysPerBetStake;
    var k = sysBetSelectedValue;
    var i;
    for (i = 0; i < k; i++) {
        indexArray[i] = i;
        indexMaxArray[i] = allBets.length - i;
    }
    indexMaxArray = indexMaxArray.reverse();
    tempIterator = k - 1;
    var m, j;
    while (indexArray[0] <= indexMaxArray[0]) {
        if (indexArray[tempIterator] < indexMaxArray[tempIterator]) {
            if (tempIterator !== k - 1) {
                tempIterator = k - 1;
                continue;
            }
            tempOdd = 1;
            tempEwOdd = 1;
            for (m = 0; m < k; m++) {
                if (allBets[indexArray[m]].incInSysCalc && !allBets[indexArray[m]].banker) {
                    tempOdd *= allBets[indexArray[m]].price;
                    tempEwOdd *= allBets[indexArray[m]].ewAllowed && allBets[indexArray[m]].ewCoeff ? Math.round(((allBets[indexArray[m]].price - 1) / allBets[indexArray[m]].ewCoeff + 1) * 100) / 100 : allBets[indexArray[m]].price;
                } else {
                    tempOdd = 0;
                    tempEwOdd = 0;
                }
            }
            tempPosWin += tempOdd;
            tempPosEwWin += tempEwOdd;
            indexArray[tempIterator]++;
        } else {
            tempIterator--;

            indexArray[tempIterator]++;

            for (j = tempIterator; j < k - 1; j++) {
                indexArray[j + 1] = indexArray[j] + 1;
            }
        }
    }
    numOfSysOptions = calculateSystemOptionsCount(k, allBets.length, bankerBetsCount);
    sysPerBetStake = stake / numOfSysOptions;
    if (eachWayMode) {
        sysPerBetStake /= 2;
    }

    return {win: tempPosWin * sysPerBetStake, ewWin: tempPosEwWin * sysPerBetStake, options: numOfSysOptions};
}
/**
 * @name calcBetterOdd
 * @description calculates the better price
 * @param {Number} price
 * @returns Number
 */
export function calcBetterOdd (price) {
    price = parseFloat(price);
    if (price < 1.06) {
        return price;
    }
    price = (price - 1) * 0.1 + price;
    price = price > 10 ? Math.ceil(price) : +price.toFixed(2);
    return price;
}

export function calculatePossibleWin (allBets, unitStake, loggedIn, currency, betslip) {

    var totalOdd = 1;
    var ewOdd = 1;
    var possibleWin = 0;
    var bankerTotalPrice = 1;
    // var tmpBankerBetsCount = 0;
    var oddLimitExceededFlag = false;
    let expBonus;

    let posWin = 0;

    function setMaxWinLimit (value) {
        if (loggedIn && !isNaN(currency.rounding)) {
            if (Config.betting.maxWinLimit && currency.rate && value * currency.rate > Config.betting.maxWinLimit) {
                return parseFloat((Config.betting.maxWinLimit / currency.rate).toFixed(Math.abs(currency.rounding)));
            }
            return parseFloat(value.toFixed(Math.abs(currency.rounding)));
        }
        return parseFloat(value);
    }
    allBets.map(function (bet) {
        switch (betslip.type) {
            case BETSLIP_TYPE_SINGLE:
                if (allBets.length === 1 && !Config.betting.alternativeBetSlip) {
                    bet.singleUnitStake = unitStake;
                    bet.eachWay = betslip.eachWayMode;
                }
                if (!isNaN(parseFloat(bet.singleStake)) && parseFloat(bet.singleStake) > 0 && !bet.deleted && bet.oddType !== 'sp' && !bet.blocked) {
                    var realPrice = betslip.betterOddSelectionMode ? bet.betterPrice : bet.price;
                    if (bet.eachWay && bet.ewAllowed && bet.ewCoeff) {
                        bet.singlePosWin = setMaxWinLimit(Math.round(((((realPrice - 1) / bet.ewCoeff + 1) + realPrice) * bet.singleUnitStake) * 100 || 0) / 100);
                    } else {
                        bet.singlePosWin = setMaxWinLimit(Math.round((realPrice * bet.singleStake) * 100 || 0) / 100);
                    }
                    possibleWin += bet.singlePosWin;
                } else {
                    bet.singlePosWin = 0;
                }
                break;
            case BETSLIP_TYPE_EXPRESS: //express
                totalOdd *= bet.price;
                ewOdd *= bet.ewAllowed && bet.ewCoeff ? Math.round(((bet.price - 1) / bet.ewCoeff + 1) * 100) / 100 : bet.price;
                break;

        }

        // if (bet.banker && bet.price) {
        //     bankerTotalPrice *= bet.price;
        //     tmpBankerBetsCount++;
        // }
    });

    // if ($scope.betSlip.bankerBetsCount !== tmpBankerBetsCount) {
    //     $scope.betSlip.bankerBetsCount = tmpBankerBetsCount;
    //     $scope.betslip.sysOptionValue = 2;
    // }

    switch (betslip.type) {
        case BETSLIP_TYPE_SINGLE:
            if (allBets.length === 1 && !Config.betting.alternativeBetSlip && betslip.stake && (betslip.freeBet || betslip.bonusBet)) {
                possibleWin -= betslip.stake;
            }
            posWin = setMaxWinLimit(Math.round(possibleWin * 100 || 0) / 100);
            break;
        case BETSLIP_TYPE_EXPRESS:
            if (totalOdd > Config.betting.totalOddsMax) {
                totalOdd = Config.betting.totalOddsMax;
                if (Config.betting.enableLimitExceededNotifications && !oddLimitExceededFlag) {
                    oddLimitExceededFlag = true;
                }
            } else {
                oddLimitExceededFlag = false;
            }
            var expOdds = Math.round(totalOdd * 100) / 100;
            expBonus = calculateExpressBonus(allBets.length, expOdds, betslip.stake);
            if (betslip.eachWayMode && ewOdd > 1 && unitStake) {
                posWin = setMaxWinLimit(Math.round(((totalOdd + ewOdd) * unitStake) * 100 || 0) / 100);
                break;
            }
            if (betslip.stake && (betslip.freeBet || betslip.bonusBet)) {
                posWin = setMaxWinLimit(Math.round((totalOdd * betslip.stake - betslip.stake) * 100 || 0) / 100);
                break;
            }
            posWin = setMaxWinLimit(Math.round((totalOdd * betslip.stake) * 100 || 0) / 100);
            break;
        case BETSLIP_TYPE_SYSTEM:
            if (allBets.length > 2) {
                var tempResult = calculateSystemPossibleWin(allBets, betslip.sysOptionValue, betslip.stake, betslip.bankersBetsCount, betslip.eachWayMode);
                if (betslip.eachWayMode) {
                    posWin = setMaxWinLimit(Math.round((tempResult.win + tempResult.ewWin) * 1000 || 0) / 1000);
                    break;
                }
                if (betslip.stake && betslip.bonusBet) {
                    posWin = setMaxWinLimit(Math.round((bankerTotalPrice * tempResult.win - betslip.stake) * 1000 || 0) / 1000);
                    break;
                }
                posWin = setMaxWinLimit(Math.round((bankerTotalPrice * tempResult.win) * 1000 || 0) / 1000);
                break;
            }
            break;
        default:
            break;
    }
    return {posWin, expOdds, expBonus, oddLimitExceededFlag};
}

function calculateExpressBonus (numberOfBets, expOdds, stake) {
    if (!Config.betting.enableExpressBonus) {
        return;
    }
    let calculatorFunc = Config.env.skinExports.expressBonusCalculator || expressBonusCalculator;
    return Math.round(calculatorFunc(Config.betting.expressBonusType, numberOfBets, expOdds, stake) * 100 || 0) / 100;
}

/**
 * @param {Number} type bonus type,
 * @param {Number} n number of events,
 * @param {Number} k odd,
 * @param {Number} s stake,
 * @description calculate express bonus
 */
function expressBonusCalculator (type, n, k, s) {
    switch (type) {
        case 1:
            return (k * s - s) * n / 100;
        case 2:
            switch (n) {
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                    return (k * s - s) * n / 100;
                case 6:
                    return (k * s - s) * 0.1;
                case 7:
                    return (k * s - s) * 0.15;
                case 8:
                    return (k * s - s) * 0.2;
                case 9:
                    return (k * s - s) * 0.25;
                default:
                    return (k * s - s) * 0.3;
            }
        case 3:
            if (k > 2.5) {
                return (k * s - s) * 0.07;
            }
            break;
        case 4:
            switch (n) {
                case 0:
                case 1:
                case 2:
                case 3:
                    return 0;
                case 4:
                    return (k * s - s) * 0.04;
                case 5:
                    return (k * s - s) * 0.05;
                case 6:
                    return (k * s - s) * 0.1;
                case 7:
                    return (k * s - s) * 0.15;
                case 8:
                    return (k * s - s) * 0.2;
                case 9:
                    return (k * s - s) * 0.25;
                default:
                    return (k * s - s) * 0.3;
            }
        case 5:
            switch (n) {
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                    return (k * s - s) * n / 100;
                case 6:
                    return (k * s - s) * 0.1;
                case 7:
                    return (k * s - s) * 0.15;
                case 8:
                    return (k * s - s) * 0.2;
                case 9:
                    return (k * s - s) * 0.25;
                case 10:
                case 11:
                case 12:
                case 13:
                case 14:
                    return (k * s - s) * 0.3;
                default:
                    return (k * s - s) * 0.4;
            }
        case 6:
            switch (n) {
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                case 8:
                case 9:
                    return (k * s - s) * n / 100;
                default:
                    return (k * s - s) * 0.1;
            }
    }
}

/**
 * Creates the do_bet requests based on betslip state
 * @param {Object} betSlipData betslip state
 * @param {Object} currency  currency object
 * @param {bool} forFreeBet is request is being created for getting free bet data
 * @returns {Array}
 */
export const createBetRequests = (betSlipData, currency, forFreeBet = false) => {

    var requests = [], data;
    var currentBets;
    let hasLiveEvents = Object.keys(betSlipData.events).reduce((acc, id) => { return acc || betSlipData.events[id].isLive; }, false);

    let autoSuperBet = (hasLiveEvents && Config.betting.autoSuperBetLimit &&
                        currency && currency.name && Config.betting.autoSuperBetLimit[currency.name] &&
                        betSlipData.stake >= Config.betting.autoSuperBetLimit[currency.name]);

    let setCommonFields = data => {
        data.type = betSlipData.type;
        data.source = Config.betting.bet_source;
        data.mode = (betSlipData.superBet || autoSuperBet) ? -1 : parseInt(betSlipData.acceptPriceChanges, 10);
        data.each_way = betSlipData.eachWayMode;
        if (!forFreeBet) {
            data.amount = parseFloat(betSlipData.stake);
        } else {
            data.is_live = hasLiveEvents;
        }
        if (betSlipData.freeBet && betSlipData.selectedFreeBetId) {
            data.bonus_id = betSlipData.selectedFreeBetId;
            data.amount = betSlipData.selectedFreeBetAmount;
        }
        return data;
    };

    switch (betSlipData.type) {
        case BETSLIP_TYPE_SINGLE:
            Object.keys(betSlipData.events).map(id => {
                let bet = betSlipData.events[id];
                data = {
                    'is_offer': betSlipData.betterOddSelectionMode ? 1 : 0,
                    'bets': [{
                        'event_id': bet.eventId,
                        'price': bet.oddType === 'sp' ? -1 : (betSlipData.betterOddSelectionMode ? calcBetterOdd(bet.price || bet.initialPrice) : (bet.price || bet.initialPrice))
                    }]
                };
                setCommonFields(data);
                data.amount = forFreeBet ? undefined : parseFloat(bet.singleStake);
                requests.push(data);
            });
            break;
        case BETSLIP_TYPE_EXPRESS:
            currentBets = [];
            Object.keys(betSlipData.events).map(id => {
                let bet = betSlipData.events[id];
                currentBets.push({'event_id': bet.eventId, 'price': bet.oddType === 'sp' ? -1 : bet.price});
            });
            data = {'bets': currentBets};
            setCommonFields(data);
            requests.push(data);
            break;
        case BETSLIP_TYPE_SYSTEM:
            currentBets = [];
            Object.keys(betSlipData.events).map(id => {
                let bet = betSlipData.events[id];
                currentBets.push({
                    'event_id': bet.eventId,
                    'price': bet.oddType === 'sp' ? -1 : bet.price,
                    'banker': bet.banker ? 1 : 0
                });
            });
            data = {
                'bets': currentBets,
                'sys_bet': parseInt(betSlipData.sysOptionValue, 10) + (betSlipData.bankerBetsCount ? betSlipData.bankerBetsCount : 0)
            };
            setCommonFields(data);
            requests.push(data);
            break;
        case BETSLIP_TYPE_CHAIN:
            currentBets = [];
            Object.keys(betSlipData.events).map(id => {
                let bet = betSlipData.events[id];
                currentBets.push({'event_id': bet.eventId, 'price': bet.oddType === 'sp' ? -1 : bet.price});
            });
            data = {'bets': currentBets};
            setCommonFields(data);
            requests.push(data);
            break;

        default:
            break;
    }
    return requests;
};

/**
 * Does some calculations for betslip template
 * @param {Object} betSlip betslip data from store
 * @param {Object} data betslip events data from swarm
 * @param {Object} user user data from store
 * @param {Object} currency currency data from store
 * @param {Function} dispatch store's dispatch function
 * @returns {{events: Array, info: {}, posWin: *, expOdds: number, expBonus: *, freeBetAvailable: (*|Array|Number), priceChangeNeeds2bConfirmed: (*|boolean), betsCannotBePlaced: (boolean|*), displayInfo: {warning: Array, error: Array, info: Array}, systemOptions: *}}
 */
export function doBetSlipViewCalculations (betSlip, data, user, currency, dispatch) {
    let loggedIn = user.loggedIn,
        {events, info, totalStake} = getBetslipData(data, betSlip),
        {posWin, expOdds, expBonus, oddLimitExceededFlag} = calculatePossibleWin(events, 0, loggedIn, currency, betSlip); // modifies events!

    if (betSlip.type !== BETSLIP_TYPE_SINGLE || betSlip.quickBet) {
        totalStake = parseFloat(betSlip.stake);
    }
    let systemOptions;
    if (betSlip.type === BETSLIP_TYPE_SYSTEM) {
        systemOptions = SystemOptionsSelect(betSlip, dispatch);
    }
    let totalBonus = user.profile ? (user.profile.bonus_balance || 0) + (user.profile.bonus_win_balance || 0) + (user.profile.frozen_balance || 0) : 0,
        insufficientBalance = user.profile && (totalStake > user.profile.balance && totalStake > totalBonus),
        freeBetAvailable = user.profile && user.profile.has_free_bets && betSlip.freeBetsList && betSlip.freeBetsList.length && !betSlip.freeBetLoading && !!Object.keys(betSlip.events).length,
        priceChangeNeeds2bConfirmed = (info.priceWentDown && betSlip.acceptPriceChanges !== 2) ||     // price went down and user is not accepting "any" changes
        (info.priceChange && betSlip.acceptPriceChanges === 0),
        betsCannotBePlaced =
        (betSlip.type !== BETSLIP_TYPE_SINGLE && (events.length < 2 || info.hasSingleOnlyEvents)) ||
        (betSlip.type === BETSLIP_TYPE_SYSTEM && events.length < 3) ||
        (betSlip.type !== BETSLIP_TYPE_SINGLE && !betSlip.stake && !(freeBetAvailable && betSlip.freeBet && betSlip.selectedFreeBetId)) ||
        priceChangeNeeds2bConfirmed ||
        info.hasDeletedEvents || (info.hasConflicts && betSlip.type !== BETSLIP_TYPE_SINGLE) || info.hasEmptyStakes || info.hasLockedEvents || info.hasWrongStakes ||
        info.baseChange || oddLimitExceededFlag ||
        (Config.betting.enableBankerBet && (events.length - betSlip.bankerBetsCount < 2)) ||
        (betSlip.type === BETSLIP_TYPE_SINGLE && info.hasEventsFromSameGame && Config.betting.blockSingleGameBets) ||
        (!loggedIn && !Config.betting.allowBetWithoutLogin) || insufficientBalance || !events.length ||
        (info.hasSingleOnlyEvents && events.length > 1 && betSlip.type !== BETSLIP_TYPE_SINGLE), // betslip contains events that cannot be combined with others
        displayInfo = {warning: [], error: [], info: []};

    !events.length && displayInfo.info.push(t("Betslip is empty.To select a bet, please click on any odd."));
    info.hasDeletedEvents && displayInfo.warning.push(t("Some events in betslip are not available at the moment."));
    priceChangeNeeds2bConfirmed && displayInfo.warning.push(t("Some events in betslip have changed price."));
    info.baseChange && displayInfo.warning.push(t("Some events in betslip have changed base."));
    info.hasConflicts && betSlip.type !== BETSLIP_TYPE_SINGLE && displayInfo.warning.push(t("Some events in betslip conflict with others."));
    (info.hasEmptyStakes || info.hasWrongStakes || (!betSlip.stake && betSlip.type !== BETSLIP_TYPE_SINGLE)) && !(freeBetAvailable && betSlip.freeBet && betSlip.selectedFreeBetId) &&
    displayInfo.info.push(t("Set stake to place a bet."));
    insufficientBalance && displayInfo.warning.push(t("Insufficient balance."));
    oddLimitExceededFlag && displayInfo.warning.push(t("Odds limit exceeded."));
    !loggedIn && displayInfo.warning.push(t("You need to login to be able to place a bet."));
    ((betSlip.type === BETSLIP_TYPE_SYSTEM && events.length && events.length < 3) ||
    (betSlip.type === BETSLIP_TYPE_EXPRESS && events.length && events.length < 2) ||
    (betSlip.type === BETSLIP_TYPE_CHAIN && events.length && events.length < 2)) &&
    displayInfo.info.push(t("Add more events to place a bet."));
    return {events, info, posWin, expOdds, expBonus, freeBetAvailable, priceChangeNeeds2bConfirmed, betsCannotBePlaced, displayInfo, systemOptions};
}

/**
 * Calculates stake/unit stake division coefficient
 * @param {Object} betslip store betslip data
 * @returns {number}
 */
export function getDivisionCoefficient (betslip) {
    let divisionCoefficient = 1;
    let betslipEventsCount = Object.keys(betslip.events).length;
    if (betslipEventsCount > 0) {
        var systemOptionsCount = calculateSystemOptionsCount(betslip.sysOptionValue, betslipEventsCount, betslip.bankersBetsCount);
        divisionCoefficient = (betslip.eachWayMode ? 2 : 1) * (betslip.type === BETSLIP_TYPE_SYSTEM && systemOptionsCount > 0 ? systemOptionsCount : 1);
    }
    return divisionCoefficient;
}

/**
 * Super Bet Processing
 * @param {Array} superBets Active Super bets
 * @param {Array} processedSuperBetIds super bet ids which already processed
 * @param {Function} dispatch
 * @returns {number}
 */
export function superBetWatcher (superBets, processedSuperBetIds, dispatch) {
    superBets.forEach((superBetInfo) => {
        if (superBetInfo.super_bet_status !== undefined && superBetInfo.super_bet_id && !processedSuperBetIds[superBetInfo.super_bet_id]) {
            console.log("superbet response received!");
            let id = superBetInfo.super_bet_id;
            if (superBetInfo.super_bet_status === 1) {
                dispatch(OpenPopup("message", {title: t("Super Bet"), type: "info", body: t("Your Super Bet request {1} is accepted.", id)}));
                processedSuperBetIds[id] = true;
            } else if (superBetInfo.super_bet_status === -1) {
                dispatch(OpenPopup("message", {title: t("Super Bet"), type: "warning", body: t("Your Super Bet request {1} is declined.", id)}));
                processedSuperBetIds[id] = true;
            } else if (superBetInfo.super_bet_status === 0) {
                dispatch(GetSuperBetInfo(id));
                processedSuperBetIds[id] = true;
            }
        }
    });
}
