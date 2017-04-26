import Config from "../../config/main";
export const GAME_EVENTS_MAP = {
    //    soccer
    1: 'Goal',
    2: 'RedCard',
    3: 'YellowCard',
    4: 'Corner',
    5: 'Penalty',
    6: 'Substitution',
    10: 'Period',
    20: 'BallSafe',
    21: 'DangerousAttack',
    22: 'KickOff',
    23: 'GoalKick',
    24: 'FreeKick',
    25: 'ThrowIn',
    26: 'ShotOffTarget',
    27: 'ShotOnTarget',
    28: 'Offside',
    29: 'GoalkeeperSave',
    30: 'ShotBlocked',
    100: 'NotStarted',
    101: 'FirstHalf',
    102: 'HalfTime',
    103: 'SecondHalf',
    104: 'PreExtraHalf',
    105: 'ExtraTimeFirstHalf',
    106: 'ExtraTimeHalfTime',
    107: 'ExtraTimeSecondHalf',
    108: 'Finished',
    199: 'Timeout',
    //    tennis
    200: 'FirstSet',
    201: 'SecondSet',
    202: 'ThirdSet',
    203: 'FourthSet',
    204: 'FifthSet',
    205: 'Point',
    206: 'BallInPlay',
    207: 'ServiceFault',
    208: 'DoubleFault',
    209: 'Ace',
    210: 'InjuryBreak',
    211: 'RainDelay',
    212: 'Challenge',
    213: 'FinalSet',
    214: 'Let1stServe',
    215: 'Retired',
    216: 'Walkover',
    217: 'Game',
    218: 'Set',
    //    basketball
    300: 'FirstQuarter',
    301: 'FirstQuarterEnded',
    302: 'SecondQuarter',
    303: 'SecondQuarterEnded',
    304: 'ThirdQuarter',
    305: 'ThirdQuarterEnded',
    306: 'FourthQuarter',
    307: 'FourthQuarterEnded',
    308: 'OverTime',
    309: 'OverTimeEnded',
    320: 'Foul',
    321: 'FreeThrow',
    322: 'Free1Throw',
    323: 'Free2Throws',
    324: 'Free3Throws',
    325: 'MissedFreeThrow',
    326: 'Attack',
    327: 'OnePoint',
    328: 'TwoPoints',
    329: 'ThreePoints',
    //    icehockey
    400: 'FirstPeriod',
    401: 'FirstPeriodEnded',
    402: 'SecondPeriod',
    403: 'SecondPeriodEnded',
    404: 'ThirdPeriod',
    405: 'ThirdPeriodEnded',
    410: 'TimerStatus',
    420: 'Suspension',
    421: 'SuspensionOver',
    //    handball
    500: 'Throw_In',
    501: 'Throw_Out',
    502: 'GoalKeeper_Throw',
    503: 'Free_Throw',
    504: 'SevenMeter_Throw',
    505: 'PenaltyScored',
    506: 'PenaltyMissed'
};

/**
 * Calculates score frame counts for game
 * @param {Object} stats game stats object
 * @returns {Array}
 */
export function framesCount (stats) {
    var framesArray = [];
    var i = 0;
    for (var key in stats) {
        if (stats.hasOwnProperty(key) && key.indexOf('score_set') === 0) {
            framesArray.push(++i);
        }
    }
    return framesArray;
}

/**
 * Returns current time position on timeline
 * @param {Object} game game info object
 * @returns {*}
 */
export function getTLCurrentMinutePosition (game) {
    var currentMinute;
    var currentMinutePosition = '';
    if (!game.info || !game.info.current_game_time) {
        return;
    }
    currentMinute = parseInt(game.info.current_game_time, 10);

    if (currentMinute < 0) {
        return '0%';
    }
    if (checkExtraTime(game.info)) {
        currentMinutePosition = (currentMinute - 90) <= 30 ? ((currentMinute - 90) * 10 / 3) + '%' : '100%';
    } else if ((game.last_event && game.last_event.match_length === '80') || (game && game.match_length === '80')) {
        currentMinutePosition = currentMinute <= 80 ? (currentMinute * 10 / 8) + '%' : '100%';
    } else {
        currentMinutePosition = currentMinute <= 90 ? (currentMinute * 10 / 9) + '%' : '100%';
    }

    return currentMinutePosition;
}

/**
 * Returns css style object with position of timeline event
 * @param {Object} timelineEvent
 * @returns {*}
 */
export function getTimelinePosition (timelineEvent) {
    var theMinute = parseInt(timelineEvent.minute, 10);
    var multiplier = 9;

    if (timelineEvent.extraTime) {
        return;
    }

    if (timelineEvent.matchLength === "80") {
        multiplier = 8;
    }

    if (theMinute > (multiplier - 5) && theMinute < multiplier * 10) {
        return {position: 'absolute', right: parseInt(102 - theMinute * 10 / multiplier, 10) + '%'};
    }

    if (theMinute >= multiplier * 10) {
        return {position: 'absolute', right: 0 + '%'};
    }

    return {position: 'absolute', left: parseInt(theMinute * 10 / multiplier, 10) + '%'};
}

/**
 * Retuns game single timeline event data
 * @param event
 * @param game
 * @returns {Object}
 */
export function getTimeLineEventData (event, game) {
    var eventName = GAME_EVENTS_MAP[event.type_id];
    if (!eventName) {
        return;
    }
    var currentEvent = {};
    currentEvent.minute = parseInt(event.current_minute, 10);
    currentEvent.type = 'tl-' + eventName.split(' ').join('_').toLowerCase();
    currentEvent.shirtColor = event.team === 'team1' ? game.info.shirt1_color : game.info.shirt2_color;
    currentEvent.team = event.side === 0 ? '' : ('team' + event.side);
    currentEvent.matchLength = game.last_event ? (game.last_event.match_length || game.match_length || 0) : "90";

    currentEvent.details = {};
    currentEvent.details.type = eventName.split('_').join(' ');
    currentEvent.details.add_info = event.current_minute + " " + game[currentEvent.team + '_name'];
    currentEvent.timeline_position = getTimelinePosition(currentEvent);
    currentEvent.extraTime = false;
    return currentEvent;
}

/**
 * @ngdoc method
 * @name generateTimeLineEvents
 * @methodOf vbet5.service:GameInfo
 * @param {object} game object contains timeline and game events
 * @description generates timeline events for soccer animation control
 */
export function generateTimeLineEvents (game) {
    let tlEvents = [];
    if (game.live_events && game.live_events.length) {
        tlEvents = game.live_events.reduce((acc, tlEvent) => {
            let evt = getTimeLineEventData(tlEvent, game);
            evt && acc.push(evt);
            return acc;
        }, []);
    }
    let currentMinuteStyle = getTLCurrentMinutePosition(game);
    let tlCurrentMinute = {width: currentMinuteStyle};
    let tlCurrentPosition = {left: currentMinuteStyle};
    return {tlEvents, tlCurrentMinute, tlCurrentPosition};
}
/**
 * Checks if game has extra time
 * @param gameInfo
 * @returns {*|boolean}
 */
export function checkExtraTime (gameInfo) {
    return (
        gameInfo && (
            gameInfo.current_game_state === 'additional_time1' ||
            gameInfo.current_game_state === 'additional_time2' ||
            gameInfo.current_game_state === 'set3' ||
            gameInfo.current_game_state === 'set4' ||
            (gameInfo.current_game_state === 'timeout' && gameInfo.currMinute > 100)
        )
    );
}