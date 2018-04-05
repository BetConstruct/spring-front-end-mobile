/* global require, __SKIN__*/
const skinConfig = require("../../skins/" + __SKIN__ + "/config.js");
import Helpers from "../helpers/helperFunctions";

const Config = {
    main: {
        "source": 4,
        "terminalId": 1,
        "site_id": 1, // partner id
        "slug": 1,
        /*"betslipAdditionalMessages": {
            "insufficientBalance": {
                "link": "https://www.paston.es/?mpu=/members/deposit-popup.html",
                "message": "You do not have enough funds to place the bet. To deposit, click on",
                "postFix": "Link."
            }
        },*/
        "GmsPlatform": true,
        "useBrowserHistory": true, //use browser history instead of hash history (in IE8, IE9 and older browsers page will be reloaded on navigation)
        "authSessionLifeTime": 36000, // time to store login (in seconds)
        "authSessionLessLifeTime": 1800, // time to store login (in seconds)
        "disableFreeBet": false,
        "legacyActions": ["register", "login", "reset_password", "verify"],
        "euroPaymentIdes": [87], // time to store login (in seconds)
        "availableLanguages": {
            'eng': {
                'short': 'EN',
                'full': "English",
                order: 1
            },
            'spa': {
                'short': 'ES',
                'full': "Español",
                order: 2
            },
            'arm': {
                'short': 'HY',
                'full': "Հայերեն",
                order: 4
            },
            'rus': {
                'short': 'RU',
                'full': "Русский",
                order: 3
            },
            'por': {
                'short': 'PT',
                'full': "Português",
                order: 5
            },
            'tur': {
                'short': 'TR',
                'full': "Türkçe",
                order: 6
            },
            'kor': {
                'short': 'KO',
                'full': "한국어",
                order: 7
            },
            'jpn': {
                'short': 'JP',
                'full': "日本語",
                order: 8
            },
            'chi': {
                'short': 'CH',
                'full': "繁体中文",
                order: 9
            },
            'geo': {
                'short': 'KA',
                'full': "ქართული",
                order: 10
            },
            'swe': {
                'short': 'SE',
                'full': "Swedish",
                order: 11
            },
            'ger': {
                'short': 'DE',
                'full': "Deutsch",
                order: 12
            },
            'nor': {
                'short': 'NO',
                'full': "Norwegian",
                order: 13
            }
        },
        "mapLanguages": {
            "uae": "AE",
            "heb": "HE"
        },
        "liveChat": null,
        "enableLoyaltyPoints": false,
        "customTags": [], //generate additional tags for skins use this format [{tag: "tagName", [prop1: 'prop1', prop2: 'prop2'...]}],
        "loyaltyPointsShowAlwaysNextLevel": false,
        "languageSelectorMode": "select", // "select" or "list"
        "availableCurrencies": ['USD', 'EUR', 'RUB', 'UAH', 'CNY', 'KZT', 'PLN', 'SEK', 'MXN'],
        "defaultCurrencyRounding": 2, //number of decimal places to round displayed amounts (used if cannot be found in config loaded from swarm)
        "availableOddFormats": ['decimal', 'fractional', 'american', 'hongkong', 'malay', 'indo'],
        "useLadderForFractionalFormat": true, // use "ladder" when displaying odds in fractional format
        "roundDecimalCoefficients": 3, // rounding of coefficients, number of significant digits
        "showPointsInsteadCurrencyName": false, //replace all currency names with "PTS"
        "mainMenuItemsOrder": ["prematch", "live", "casino", "live-casino"],
        "mainMenuItems": null,
        "rightMenuContentLinks": [{
            link: "contact-support",
            title: "Contact Support",
            type: "support"
        }],
        "rightMenuVisibleCMSContentLinksSlugs": ["general-terms-and-conditions", "privacy-policy", "cookie-policy", "affiliate-program", "about-us", "contact-us", "responsible-gaming", "help"], //Temporary solution until specific field will be added into cms
        "showGameStatistics": false,
        "statsHostname": {
            "prefixUrl": 'http://statistics.betconstruct.com/#/',
            "defaultLang": 'en',
            "subUrl": '/external/page/'
        },
        "personalDetails": {
            "readOnlyFields": ['id', 'username', 'first_name', 'last_name', 'birth_date', 'gender', 'email', 'doc_number'],
            "editableFields": ['country_code', 'city', 'phone', 'bank_info', 'password', 'address'],
            "requiredFields": ['country_code', 'city', 'phone', 'password'],
            "bankInfoMask": '99999999999'
        },
        "video": {
            "enableLiveGamesFilter": true,
            //availableVideoProviderIds: [1, 3, 5, 6, 16, 19, 25], //list of available providers
            "enabled": true,
            "autoPlay": true,
            "useHlsUrlFromResponse": false, //only for topSport skin
            "evenIfNotLoggedIn": false
        },
        "bonus": {
            "disableBonusCanceling": false
        },
        "androidAppSettings": {
            "showAndroidAppDownloadPopup": false,
            "downloadLink": ""
        },
        "esportsGames": ['Dota', 'Dota2', 'CounterStrike', 'LeagueOfLegends', 'StarCraft', 'StarCraft2', 'Hearthstone', 'CallofDuty', 'Overwatch', 'HeroesOfTheStorm'],
        "teamLogosPath": 'http://statistics.betconstruct.com/images/',
        "geoipLink": "https://geoapi.betcoapps.com/",
        "minimalPasswordLength": 6,
        "selfExclusionByExcType": 2, // config values are   false, "1", "2"
        "userSelfExclusion": { // user selfExclusion settings
            "enabled": true,
            "options": [{
                "name": "6-month",
                "limit": {
                    "value": '6-month'
                }
            }, {
                "name": "1-year",
                "limit": {
                    "value": '1-year'
                }
            }, {
                "name": "2-year",
                "limit": {
                    "value": '2-year'
                }
            }, {
                "name": "5-year",
                "limit": {
                    "value": '5-year'
                }
            }]
        },
        "realityChecks": {
            "enabled": false,
            "options": [{
                "name": "no limit",
                "value": "0"
            }, {
                "name": "10 mins",
                "value": "600"
            }, {
                "name": "20 mins",
                "value": "1200"
            }, {
                "name": "30 mins",
                "value": "1800"
            }, {
                "name": "1 hour",
                "value": "3600"
            }, {
                "name": "2 hour",
                "value": "7200"
            }, {
                "name": "4 hour",
                "value": "14400"
            }, {
                "name": "6 hour",
                "value": "21600"
            }, {
                "name": "8 hour",
                "value": "28800"
            }]
        },
        "dateFormat": "ddd, D MMM YYYY", // momentJS display format string
        "timeFormat": "HH:mm", // momentJS display format string
        "dateTimeFormat": "ddd, D MMM YYYY HH:mm", // momentJS display format string
        "shortDateTimeFormat": "ddd HH:mm", // momentJS display format string
        "prematchTimeFilterValues": [3, 6, 12, 24, 48, 72], // hours (above sports list in prematch)
        "prematchWidgetTimeFilterValues": [5, 10, 15, 30], // mins (dashboard)
        "animationDisplayTime": 180, // seconds since event start to display animation
        "regConfig": {
            "settings": {
                "minYearOld": 18,
                "maxYearOld": 100,
                "defaultCountry": "AM", //iso standard
                "loginAfterRegistration": true,
                "sendEmailAsUsername": false,
                "dateFormat": "YYYY-MM-DD",
                "restrictedCountries": []//["AU"] iso standard
            }
        },
        "balanceHistoryMainSelectableTypes": ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "302", "10", "12", "13", "14", "15", "16", "17", "18", "23", "24", "29", "30", "31", "32", "37", "39", "19", "20", "21"],
        "balanceHistoryCasinoSelectableTypes": [0, 1, 2, 3, 4, 5, 6],

        "payments": [],
        "paymentByCurrency": false,
        "buttonsDefaultValues": {
            "AMD": {
                "deposit": [5000, 10000, 15000, 50000, 100000, 150000],
                "withdraw": [5000, 10000, 15000, 50000, 100000, 150000]
            },
            "USD": {
                "deposit": [20, 50, 100, 200, 500, 1000],
                "withdraw": [20, 50, 100, 200, 500, 1000]
            },
            "EUR": {
                "deposit": [20, 50, 100, 200, 500, 1000],
                "withdraw": [20, 50, 100, 200, 500, 1000]
            },
            "PLN": {
                "deposit": [50, 100, 200, 500, 1000, 2000],
                "withdraw": [50, 100, 200, 500, 1000, 2000]
            },
            "SEK": {
                "deposit": [100, 300, 500, 1000, 3000, 5000],
                "withdraw": [100, 300, 500, 1000, 3000, 5000]
            },
            "RUB": {
                "deposit": [1000, 2000, 5000, 10000, 20000, 50000],
                "withdraw": [1000, 2000, 5000, 10000, 20000, 50000]
            },
            "UAH": {
                "deposit": [500, 1000, 2000, 5000, 10000, 20000],
                "withdraw": [500, 1000, 2000, 5000, 10000, 20000]
            },
            "CNY": {
                "deposit": [100, 300, 500, 1000, 3000, 5000],
                "withdraw": [100, 300, 500, 1000, 3000, 5000]
            },
            "GBP": {
                "deposit": [20, 50, 100, 200, 500, 1000],
                "withdraw": [20, 50, 100, 200, 500, 1000]
            },
            "KZT": {
                "deposit": [5000, 15000, 30000, 50000, 150000, 300000],
                "withdraw": [5000, 15000, 30000, 50000, 150000, 300000]
            },
            "KRW": {
                "deposit": [10000, 50000, 100000, 500000],
                "withdraw": [10000, 50000, 100000, 500000]
            },
            "MXN": {
                "deposit": [500, 1000, 2000, 5000, 10000, 20000],
                "withdraw": [500, 1000, 2000, 5000, 10000, 20000]
            }
        }
    },
    "betting": {
        "bet_source": '2',
        "maxWinLimit": false,
        "disableMaxBet": false,
        "enableExpressBonus": false,
        "expressBonusVisibilityQty": 1,
        "expressBonusType": 1, //1: regular bonus 2,3,4,5..% ; 2: 2-5,10,15,20,25,30,30..30 %; 3: (k > 2.5) ? 7% : 0;
        "enableSuperBet": true,
        "showSuperBetNotificationsViaPopup": false,
        "enableHorseRacingBetSlip": true, // SP, new bet types, etc.
        "enableEachWayBetting": false,
        "enableShowBetSettings": false,
        "allowManualSuperBet": false,
        // superBetCheckingIntervalTime: 5000,
        "betAcceptedMessageTime": 5000,
        "quickBetNotificationsTimeout": 4000,
        "autoSuperBetLimit": {}, // {'GEL': 400, 'AMD': 50000, 'USD': 1000} //if not false then set limit for each currency if stake is greater then Limit superbet is enabling automaticaly
        "resetAmountAfterBet": false,
        "totalOddsMax": 1000,
        "enableLimitExceededNotifications": false,
        "allowSuperBetOnLive": false,
        "enableBetterOddSelectingFunctyionality": false,
        "rememberAutoAcceptPriceChangeSettings": false,
        "enableBankerBet": false,
        "enableBookingBet": false,
        "quickBet": {
            "hideQuickBet": false,
            "enableQuickBetStakes": false,
            "visibleForPaths": ['sport', 'overview'],
            "quickBetStakeCoeffs": {
                'USD': 5,
                'AMD': 50,
                'EUR': 3
            },
            "quickBetStakeBases": [1, 2, 5, 10],
            "quickBetBaseMultipliers": [1, 10, 100]
        },
        "disableClearAllInBetProgress": false,
        "disableMaxButtonInBetProgress": false,
        "allowBetWithoutLogin": true, // allow to click "place bet" without logging in. will get corresponding error message from backend and open login form
        "enablePartialCashOut": false
    },
    "partner": {},
    "rfid": {},
    "swarm": {
        "debugging": false, //enable websocket debugging
        "languageMap": {
            "pol": "eng",
            "por": "por_2",
            "pt-br": "por",
            "fre": "fra",
            "chi": "zho",
            "mac": "mkd",
            "bgr": "bul",
            "lat": "lav",
            "fas": "far",
            "rum": "ron"
        },
        "sendSourceInRequestSession": true,
        "sendTerminalIdlInRequestSession": false,
        "webSocketTimeout": 5000,
        //url: [{url: "https://192.168.250.189:8022"}],
        "url": [{
            "url": "https://eu-swarm-ws.betconstruct.com"
        }],
        //websocket: [{url: "wss://192.168.250.189:8022"}],
        "websocket": [{
            "url": "wss://eu-swarm-ws.betconstruct.com"
        }],
        // websocket: [{url: "ws://127.0.0.1:8080"}],
        "useWebSocket": true,
        "maxWebsocketRetries": 5, // maximum number of websocket reconnect attempts after which it will give up
        "webSocketRetryInterval": 2000 // retry interval, in milliseconds (will be increased after each unsuccessful retry by itself)
    },
    "cms": {
        "url": "https://cmsbetconstruct.com/",
        "baseHost": "vbet",
        "mostPopularGame": {
            "json": "widgets/get_sidebar",
            "sidebarId": "banner-most-popular-game-app-"
        }
    },
    "casino": {
        "providersThatWorkWithSwarm": [],
        // providersThatWorkWithCasinoBackend: {
        //     providers: ['GDR'],
        //     url: "https://launchgames.vivaro.am/global/play.php"
        // },
        "urlPrefix": false,
        "gamesUrl": '/global/mplay1.php',
        "url": "https://www.cmsbetconstruct.com/casino/",
        "disableCasinoPlayForFunMode": false,
        "allProviders": {
            "showAll": true
        },
        "allCategories": {
            "showAll": true
        },
        "games": {
            "loaderStep": 12
        }
    },
    "liveCasino": {
        "helpUrl": "https://websitelivegames-am.betconstruct.com/Home/HelpInfo",
        "clv": false,
        "drg": false
    },
    // default values, that can be changed by user
    "env": {
        "lang": "eng",
        "oddFormat": "decimal",
        "os": Helpers.getMobileOperatingSystem()
    },
    "disableCasinoAndSportsBonusesToShow": false,
    "disableNavMenuFromLeftMenu": false,
    "everCookie": {
        "enabled": false,
        "afecUrl": "https://afec.betconstruct.com/topics/client-activity-v2",
        "options": {
            history: false,
            baseurl: 'https://init-ec.betconstruct.com',
            asseturi: "/assets",
            swfFileName: '/ec.swf',
            xapFileName: '/ec.xap',
            jnlpFileName: '/ec.jnlp',
            pngCookieName: 'ec_png',
            pngPath: 'ec_png.php',
            etagCookieName: 'ec_etag',
            etagPath: 'ec_etag.php',
            cacheCookieName: 'ec_cache',
            cachePath: 'ec_cache.php',
            phpuri: "/",
            java: false,
            silverlight: false
        }
    }
    /*isPartnerIntegration: {
        "mode": {
            "iframe": false,
            "externalLinks": false
        },
        "externalLinks": {
            "links": {
                "registration": "",
                "login": "",
                "payments": "",
                "casinoLinks": ""
            }
        },
        "iframe": {

        }
    }*/
};

Helpers.mergeRecursive(Config, skinConfig);

export default Config;