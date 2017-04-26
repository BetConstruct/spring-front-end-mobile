/* global require, __SKIN__*/
const skinConfig = require("../../skins/" + __SKIN__ + "/config.js");
import Helpers from "../helpers/helperFunctions";

const Config = {
    main: {
        terminalId: 1,
        site_id: 1, // partner id
        slug: 1,
        GmsPlatform: true,
        useBrowserHistory: true, //use browser history instead of hash history (in IE8, IE9 and older browsers page will be reloaded on navigation)
        authSessionLifeTime: 36000, // time to store login (in seconds)
        authSessionLessLifeTime: 1800, // time to store login (in seconds)
        availableLanguages: {
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
        liveChat: null,
        enableLoyaltyPoints: false,
        loyaltyPointsShowAlwaysNextLevel: false,
        languageSelectorMode: "select", // "select" or "list"
        availableCurrencies: ['USD', 'EUR', 'RUB', 'UAH', 'CNY', 'KZT', 'PLN', 'SEK', 'MXN'],
        defaultCurrencyRounding: 2, //number of decimal places to round displayed amounts (used if cannot be found in config loaded from swarm)
        availableOddFormats: ['decimal', 'fractional', 'american', 'hongkong', 'malay', 'indo'],
        useLadderForFractionalFormat: true, // use "ladder" when displaying odds in fractional format
        roundDecimalCoefficients: 3, // rounding of coefficients, number of significant digits
        mainMenuItemsOrder: ["prematch", "live", "casino", "live-casino"],
        mainMenuItems: null,
        rightMenuContentLinks: [{
            link: "contact-support",
            title: "Contact Support",
            type: "support"
        }],
        "rightMenuVisibleCMSContentLinksSlugs": ["general-terms-and-conditions", "privacy-policy", "cookie-policy", "affiliate-program", "about-us", "contact-us", "responsible-gaming", "help"], //Temporary solution until specific field will be added into cms
        statsHostname: {
            prefixUrl: 'http://statistics.betconstruct.com/#/',
            defaultLang: 'en',
            subUrl: '/external/page/'
        },
        personalDetails: {
            readOnlyFields: ['id', 'username', 'first_name', 'last_name', 'birth_date', 'gender', 'email', 'doc_number'],
            editableFields: ['country_code', 'city', 'phone', 'bank_info', 'password', 'address'],
            requiredFields: ['country_code', 'city', 'phone', 'password'],
            bankInfoMask: '99999999999'
        },
        video: {
            enableLiveGamesFilter: true,
            //availableVideoProviderIds: [1, 3, 5, 6, 16, 19, 25], //list of available providers
            enabled: true,
            autoPlay: true,
            useHlsUrlFromResponse: false, //only for topSport skin
            evenIfNotLoggedIn: false
        },
        bonus: {
            disableBonusCanceling: false
        },
        androidAppSettings: {
            showAndroidAppDownloadPopup: false,
            downloadLink: ""
        },
        esportsGames: ['Dota', 'Dota2', 'CounterStrike', 'LeagueOfLegends', 'StarCraft', 'StarCraft2', 'Hearthstone', 'CallofDuty', 'Overwatch', 'HeroesOfTheStorm'],
        teamLogosPath: 'http://statistics.betconstruct.com/images/',
        minimalPasswordLength: 6,
        selfExclusionByExcType: 2, // config values are   false, "1", "2"
        dateFormat: "ddd, D MMM YYYY", // momentJS display format string
        timeFormat: "HH:mm", // momentJS display format string
        dateTimeFormat: "ddd, D MMM YYYY HH:mm", // momentJS display format string
        shortDateTimeFormat: "ddd HH:mm", // momentJS display format string
        prematchTimeFilterValues: [3, 6, 12, 24, 48, 72], // hours (above sports list in prematch)
        prematchWidgetTimeFilterValues: [5, 10, 15, 30], // mins (dashboard)
        animationDisplayTime: 180, // seconds since event start to display animation
        regConfig: {
            "fields": {
                "firstName": {
                    "order": 1,
                    "title": "First Name",
                    "name": "first_name",
                    "placeholder": "Enter here",
                    "type": "text",
                    "classes": "single-form-item",
                    "customAttrs": {
                        "minlength": "2",
                        "maxlength": "50",
                        "regex": "^[^0-9\\[\\]\\\\`~!@#$%^&*()_+={};:<>|./?,\"']+$",
                        "required": true
                    },
                    "validationMessages": {
                        "required": "This field is required",
                        "minlength": "Too short",
                        "maxlength": "Too long",
                        "regex": "Please enter a valid name: only letters - no digits and/or symbols"
                    }
                },
                "lastName": {
                    "order": 2,
                    "title": "Last Name",
                    "name": "last_name",
                    "placeholder": "Enter here",
                    "type": "text",
                    "classes": "single-form-item",
                    "customAttrs": {
                        "minlength": "2",
                        "maxlength": "50",
                        "regex": "^[^0-9\\[\\]\\\\`~!@#$%^&*()_+={};:<>|./?,\"']+$",
                        "required": true
                    },
                    "validationMessages": {
                        "required": "This field is required",
                        "minlength": "Too short",
                        "maxlength": "Too long",
                        "regex": "Please enter a valid name: only letters - no digits and/or symbols"
                    }
                },
                "promoCode": {
                    "order": 3,
                    "title": "Promo code",
                    "name": "promo_code",
                    "placeholder": "Enter here",
                    "type": "text",
                    "classes": "single-form-item",
                    "customAttrs": {
                        "maxlength": "50",
                        "required": false
                    },
                    "validationMessages": {
                        "maxlength": "Too long",
                        "required": "This field is required"
                    }
                },
                "username": {
                    "order": 4,
                    "title": "Username",
                    "name": "username",
                    "type": "text",
                    "placeholder": "Enter here",
                    "classes": "single-form-item",
                    "customAttrs": {
                        "minlength": "5",
                        "maxlength": "50",
                        "regex": "^[^0-9\\[\\]\\\\`~!@#$%^&*()_+={};:<>|./?,\"'-\\s]+$",
                        "required": true
                    },
                    "validationMessages": {
                        "required": "This field is required",
                        "regex": "This is not a valid username",
                        "minlength": "Too short",
                        "maxlength": "Too long"
                    }
                },
                "doc_number": {
                    "order": 5,
                    "title": "Passport Number",
                    "name": "doc_number",
                    "type": "text",
                    "placeholder": "Enter here",
                    "classes": "single-form-item",
                    "customAttrs": {
                        "minlength": "2",
                        "maxlength": "50",
                        "required": true
                    },
                    "validationMessages": {
                        "required": "This field is required",
                        "regex": "This is not a valid Passport Number",
                        "minlength": "Too short",
                        "maxlength": "Too long"
                    }
                },
                "address": {
                    "order": 6,
                    "title": "Address",
                    "name": "address",
                    "type": "text",
                    "placeholder": "Enter here",
                    "classes": "single-form-item",
                    "customAttrs": {
                        "maxlength": "200",
                        "required": false
                    },
                    "validationMessages": {
                        "required": "This field is required",
                        "regex": "This is not a valid Address",
                        "minlength": "Too short",
                        "maxlength": "Too long"
                    }
                },
                "password": {
                    "order": 7,
                    "title": "Password",
                    "name": "password",
                    "placeholder": "Enter here",
                    "type": "password",
                    "classes": "single-form-item",
                    "customAttrs": {
                        "minlength": "8",
                        "maxlength": "50",
                        "regex": "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d\\[\\]\\\\`~!@#$%^&*()_+={};:<>|./?,\"'-]+$",
                        "required": true
                    },
                    "validationMessages": {
                        "required": "This field is required",
                        "minlength": "Password should contain at least 8 characters",
                        "maxlength": "Too long",
                        "tooShort": "Password is too short",
                        "regex": "Password should contain upper and lower-case English letters, at least one digit and no spaces.",
                        "sameAsLogin": "Password can't be same as login."
                    }
                },
                "confirmPassword": {
                    "order": 8,
                    "title": "Confirm Password",
                    "name": "password2",
                    "type": "password",
                    "placeholder": "Enter here",
                    "classes": "single-form-item",
                    "customAttrs": {
                        "required": true
                    },
                    "validationMessages": {
                        "required": "This field is required",
                        "match": "Passwords don't match"
                    },
                    specifications: [{
                        "matchToPassword": true,
                        "compareWith": "password",
                        "validationKey": "match"
                    }]
                },
                "email": {
                    "order": 9,
                    "title": "Email Address",
                    "name": "email",
                    "type": "email",
                    "placeholder": "Enter here",
                    "classes": "single-form-item",
                    "customAttrs": {
                        "minlength": "5",
                        "maxlength": "50",
                        "regex": "^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+([.])[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$",
                        "required": true
                    },
                    "validationMessages": {
                        "required": "This field is required",
                        "regex": "Invalid email address",
                        "exists": "This email already exists in our database, please enter another",
                        "minlength": "Too short",
                        "maxlength": "Too long"
                    }
                },
                "birthDate": {
                    "order": 10,
                    "title": "Date of Birth",
                    "name": "birth_date",
                    "labelText": "Date of Birth",
                    "type": "datePicker",
                    "placeholder": "Enter here",
                    "classes": "date-picker-wrapper",
                    "customAttrs": {
                        "required": true
                    },
                    "validationMessages": {
                        "required": "This field is required"
                    }
                },
                "gender": {
                    "order": 11,
                    "title": "Gender",
                    "name": "gender",
                    "type": "select",
                    "labelText": "Gender",
                    "placeholder": "Enter here",
                    "classes": "form-p-i-m",
                    "customAttrs": {
                        "required": true
                    },
                    "validationMessages": {
                        "required": "This field is required"
                    },
                    options: [{
                        value: "M",
                        translationKey: "Male"
                    }, {
                        value: "F",
                        translationKey: "Female"
                    }]
                },
                "captcha": {
                    "order": 12,
                    "title": "Captcha",
                    "name": "captcha",
                    "placeholder": "Enter here",
                    "type": "captcha",
                    "classes": "single-form-item",
                    "customAttrs": {
                        "required": true
                    },
                    "validationMessages": {
                        "required": "This field is required"
                    }
                },
                "countryCode": {
                    "order": 13,
                    "title": "Country code",
                    "name": "country_code",
                    "labelText": "Country of Residence",
                    "placeholder": "Enter here",
                    "type": "country_code",
                    "classes": "form-p-i-m",
                    "customAttrs": {
                        "required": true
                    },
                    "validationMessages": {
                        "required": "This field is required"
                    }
                },
                "securityQuestion": {
                    "order": 14,
                    "title": "Security question",
                    "name": "security_question",
                    "placeholder": "Enter here",
                    "type": "select",
                    "labelText": "Security question",
                    "classes": "form-p-i-m",
                    "customAttrs": {
                        "required": true
                    },
                    "validationMessages": {
                        "required": "This field is required"
                    },
                    options: [{
                        translationKey: "What was the name of your first pet?"
                    }, {
                        translationKey: "What age were you when you went to school?"
                    }, {
                        translationKey: "What was the name of the city you were born in?"
                    }, {
                        translationKey: "What was the number of your school?"
                    }, {
                        translationKey: "What was the name of your first love?"
                    }, {
                        translationKey: "What was the make and model of your first car?"
                    }]
                },
                "securityAnswer": {
                    "order": 15,
                    "title": "Security answer",
                    "name": "security_answer",
                    "placeholder": "Enter here",
                    "type": "text",
                    "classes": "single-form-item",
                    "customAttrs": {
                        "required": false,
                        "maxlength": "50"
                    },
                    "validationMessages": {
                        "required": "This field is required"
                    }
                },
                "city": {
                    "order": 16,
                    "title": "City of Residence",
                    "name": "city",
                    "placeholder": "Enter here",
                    "type": "text",
                    "classes": "single-form-item",
                    "customAttrs": {
                        "minlength": "2",
                        "maxlength": "50",
                        "required": true
                    },
                    "validationMessages": {
                        "required": "This field is required",
                        "minlength": "Too short",
                        "maxlength": "Too long"
                    }
                },
                "currencyName": {
                    "order": 17,
                    "title": "Currency code",
                    "name": "currency_name",
                    "placeholder": "Enter here",
                    "labelText": "Currency",
                    "type": "currency_name",
                    "classes": "form-p-i-m",
                    "customAttrs": {
                        "required": true
                    },
                    "validationMessages": {
                        "required": "This field is required"
                    }
                },
                "phone": {
                    "order": 18,
                    "title": "Phone number",
                    "labelText": "Phone number",
                    "name": "phone",
                    "placeholder": "Enter here",
                    "type": "phone",
                    "classes": "single-form-item",
                    "customAttrs": {
                        "minlength": "5",
                        "maxlength": "50",
                        "required": true
                    },
                    "validationMessages": {
                        "minlength": "Too short",
                        "maxlength": "Too long",
                        "required": "This field is required",
                        "regex": "This is not a valid phone number"
                    }
                },
                "agree": {
                    "order": 19,
                    "title": "I agree with all terms and conditions.",
                    "name": "agree",
                    "placeholder": "Enter here",
                    "type": "agree",
                    "classes": "single-form-item",
                    "customAttrs": {
                        "required": true
                    },
                    "validationMessages": {
                        "required": "You must accept all terms and conditions to be able to register."
                    }
                }
            },
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
        balanceHistoryMainSelectableTypes: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "302", "10", "12", "13", "14", "15", "16", "17", "18", "23", "24", "29", "30", "31", "32", "37", "39", "19", "20", "21"],
        balanceHistoryCasinoSelectableTypes: [0, 1, 2, 3, 4, 5, 6],

        payments: [],
        buttonsDefaultValues: {
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
            "MXN": {
                "deposit": [500, 1000, 2000, 5000, 10000, 20000],
                "withdraw": [500, 1000, 2000, 5000, 10000, 20000]
            }
        }
    },
    betting: {
        bet_source: '2',
        maxWinLimit: false,
        disableMaxBet: false,
        enableExpressBonus: false,
        expressBonusVisibilityQty: 1,
        expressBonusType: 1, //1: regular bonus 2,3,4,5..% ; 2: 2-5,10,15,20,25,30,30..30 %; 3: (k > 2.5) ? 7% : 0;
        enableSuperBet: true,
        showSuperBetNotificationsViaPopup: false,
        enableHorseRacingBetSlip: true, // SP, new bet types, etc.
        enableEachWayBetting: false,
        enableShowBetSettings: false,
        allowManualSuperBet: false,
        // superBetCheckingIntervalTime: 5000,
        betAcceptedMessageTime: 5000,
        quickBetNotificationsTimeout: 4000,
        autoSuperBetLimit: {}, // {'GEL': 400, 'AMD': 50000, 'USD': 1000} //if not false then set limit for each currency if stake is greater then Limit superbet is enabling automaticaly
        resetAmountAfterBet: false,
        totalOddsMax: 1000,
        enableLimitExceededNotifications: false,
        allowSuperBetOnLive: false,
        enableBetterOddSelectingFunctyionality: false,
        rememberAutoAcceptPriceChangeSettings: false,
        enableBankerBet: false,
        quickBet: {
            hideQuickBet: false,
            enableQuickBetStakes: false,
            visibleForPaths: ['sport', 'overview'],
            quickBetStakeCoeffs: {
                'USD': 5,
                'AMD': 50,
                'EUR': 3
            },
            quickBetStakeBases: [1, 2, 5, 10],
            quickBetBaseMultipliers: [1, 10, 100]
        },
        disableClearAllInBetProgress: false,
        disableMaxButtonInBetProgress: false,
        allowBetWithoutLogin: true // allow to click "place bet" without logging in. will get corresponding error message from backend and open login form
    },
    partner: {},
    rfid: {},
    swarm: {
        debugging: false, //enable websocket debugging
        languageMap: {
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
        sendSourceInRequestSession: false,
        sendTerminalIdlInRequestSession: false,
        webSocketTimeout: 5000,
        //url: [{url: "https://192.168.250.189:8022"}],
        url: [{
            url: "https://swarm-spring-cloud.betconstruct.com"
        }],
        //websocket: [{url: "wss://192.168.250.189:8022"}],
        websocket: [{
            url: "wss://swarm-spring-cloud.betconstruct.com"
        }],
        // websocket: [{url: "ws://127.0.0.1:8080"}],
        useWebSocket: true,
        maxWebsocketRetries: 5, // maximum number of websocket reconnect attempts after which it will give up
        webSocketRetryInterval: 2000 // retry interval, in milliseconds (will be increased after each unsuccessful retry by itself)
    },
    cms: {
        url: "https://cmsbetconstruct.com/",
        baseHost: "vbet",
        mostPopularGame: {
            json: "widgets/get_sidebar",
            sidebarId: "banner-most-popular-game-app-"
        }
    },
    casino: {
        providersThatWorkWithSwarm: [],
        // providersThatWorkWithCasinoBackend: {
        //     providers: ['GDR'],
        //     url: "https://launchgames.vivaro.am/global/play.php"
        // },
        urlPrefix: false,
        gamesUrl: '/global/mplay1.php',
        url: "https://www.cmsbetconstruct.com/casino/",
        allProviders: {
            showAll: true
        },
        allCategories: {
            showAll: true
        },
        games: {
            loaderStep: 12
        }
    },
    liveCasino: {
        helpUrl: "https://websitelivegames-am.betconstruct.com/Home/HelpInfo",
        clv: false,
        drg: false
    },
    // default values, that can be changed by user
    env: {
        lang: "eng",
        oddFormat: "decimal",
        os: Helpers.getMobileOperatingSystem()
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

console.log("Config:", Config);

export default Config;