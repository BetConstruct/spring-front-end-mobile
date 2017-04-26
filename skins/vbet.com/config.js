module.exports = {
    main: {
        "site_id": 4,
        "title": "Vbet.com mobile",
        "availableLanguages": {
            'eng': {
                'short': 'EN',
                'full': "English",
                "order": 1
            },
            'spa': {
                'short': 'ES',
                'full': "Español",
                "order": 2
            },
            'arm': {
                'short': 'HY',
                'full': "Հայերեն",
                "order": 4
            },
            'rus': {
                'short': 'RU',
                'full': "Русский",
                "order": 3
            },
            'por': {
                'short': 'PT',
                'full': "Português",
                "order": 5
            },
            'tur': {
                'short': 'TR',
                'full': "Türkçe",
                "order": 6
            },
            'kor': {
                'short': 'KO',
                'full': "한국어",
                "order": 7
            },
            'jpn': {
                'short': 'JP',
                'full': "日本語",
                "order": 8
            },
            'chi': {
                'short': 'CH',
                'full': "繁体中文",
                "order": 9
            },
            'geo': {
                'short': 'KA',
                'full': "ქართული",
                "order": 10
            },
            'swe': {
                'short': 'SE',
                'full': "Swedish",
                "order": 11
            },
            'ger': {
                'short': 'DE',
                'full': "Deutsch",
                "order": 12
            },
            'nor': {
                'short': 'NO',
                'full': "Norwegian",
                "order": 13
            }
        },
        "mainMenuItemsOrder": ["prematch", "live", "casino", "live-casino", "news", "statistics", "backgammon(fromUrl)", "belote(fromUrl)", "matchCenter(fromUrl)", "colossusBets"],
        "mainMenuItems": { // main menu items that are not in routes
            "news": {
                "title": "News",
                "link": "http://news.vbet.com",
                "target": "_blank"
                //"hideBeforeLogin": false hiding navigation link from menu
            },
            "statistics": {
                "title": "Statistics",
                "link": "https://statistics.vbet.com",
                "target": "_blank"
            }
        },
        "rightMenuContentLinks": [{
            "link": "contact-support",
            "title": "Contact Support",
            "type": "support"
        }, {
            "title": "Download App",
            "type": "checkDevice"
        }],
        "rightMenuVisibleCMSContentLinksSlugs": ["general-terms-and-conditions", "privacy-policy", "cookie-policy", "affiliate-program", "about-us", "contact-us", "responsible-gaming", "help"], //Temporary solution until specific field will be added into cms
        "video": {
            "availableVideoProviderIds": [1, 3, 5, 16, 19]
        },
        "androidAppSettings": {
            "showAndroidAppDownloadPopup": true,
            "downloadLink": "http://apps.betcoapps.com/android/sportsbook/sportsbook-vbet.apk"
        },
        "iosAppSettings": {
            "showIOSAppDownloadPopup": true,
            "appStoreLink": "https://itunes.apple.com/am/app/sportsbook-by-vbet-sports/id1071205599?mt=8",
            "iosAppMetaContent": "app-id=1071205599"
        },
        "authSessionSmallLifeTime": 1800,
        "liveChat": {
            "isLiveAgent": true,
            "liveAgentID": 'b0170f5a'
        },
        'regConfig': {
            'settings': {
                "restrictedCountries": ["HU", "DE", "CZ", "BE", "BG", "IE", "IT", "NL", "PL", "PT", "ES", "GB"]//["AU"] iso standard
            }
        },
        "payments": [
            {
                "name": "skrill",
                "displayName": "Skrill",
                "canDeposit": true,
                "canWithdraw": true,
                "order": 1,
                "depositInfoTextKey": "deposit_info_skrill",
                "withdrawInfoTextKey": "withdraw_info_skrill",
                "depositFormFields": [{"name": "email", "type": "email", "label": "Email"}],
                "withdrawFormFields": [{
                    "name": "email",
                    "type": "email",
                    "label": "Email",
                    "required": true
                }, {"name": "name", "type": "text", "label": "Name"}],
                "paymentID": 1,
                "info": {
                    "USD": {
                        "depositFee": 0,
                        "depositProcessTime": 0,
                        "minDeposit": 5,
                        "maxDeposit": 10000,
                        "withdrawFee": 0,
                        "withdrawProcessTime": 24,
                        "minWithdraw": 1,
                        "maxWithdraw": 10000
                    },
                    "EUR": {
                        "depositFee": 0,
                        "depositProcessTime": 0,
                        "minDeposit": 5,
                        "maxDeposit": 10000,
                        "withdrawFee": 0,
                        "withdrawProcessTime": 24,
                        "minWithdraw": 1,
                        "maxWithdraw": 10000
                    },
                    "PLN": {
                        "depositFee": 0,
                        "depositProcessTime": 0,
                        "minDeposit": 1,
                        "maxDeposit": 10000,
                        "withdrawFee": 0,
                        "withdrawProcessTime": 24,
                        "minWithdraw": 1,
                        "maxWithdraw": 10000
                    },
                    "SEK": {
                        "depositFee": 0,
                        "depositProcessTime": 0,
                        "minDeposit": 1,
                        "maxDeposit": 10000,
                        "withdrawFee": 0,
                        "withdrawProcessTime": 24,
                        "minWithdraw": 1,
                        "maxWithdraw": 10000
                    }
                },
                "image": "https://cmsbetconstruct.com/content/images/payments/default/1.png"
            },
            {
                "name": "netellernew",
                "displayName": "Neteller",
                "canDeposit": true,
                "canWithdraw": true,
                "order": 5,
                "depositInfoTextKey": "deposit_info_neteller",
                "withdrawInfoTextKey": "withdraw_info_neteller",
                "depositFormFields": [{"name": "email", "type": "text", "label": "Email/Account Id "}, {
                    "name": "secure_id",
                    "type": "text",
                    "label": "Secure Id/Authentication code"
                }],
                "withdrawFormFields": [{"name": "email", "type": "text", "label": "Email"}],
                "paymentID": 27,
                "info": {
                    "USD": {
                        "depositFee": 0,
                        "depositProcessTime": 0,
                        "minDeposit": 15,
                        "maxDeposit": 500000,
                        "withdrawFee": 0,
                        "withdrawProcessTime": 24,
                        "minWithdraw": 1,
                        "maxWithdraw": 500000
                    },
                    "EUR": {
                        "depositFee": 0,
                        "depositProcessTime": 0,
                        "minDeposit": 12,
                        "maxDeposit": 500000,
                        "withdrawFee": 0,
                        "withdrawProcessTime": 24,
                        "minWithdraw": 1,
                        "maxWithdraw": 500000
                    },
                    "PLN": {
                        "depositFee": 0,
                        "depositProcessTime": 0,
                        "minDeposit": 61.14,
                        "maxDeposit": 10000,
                        "withdrawFee": 0,
                        "withdrawProcessTime": 24,
                        "minWithdraw": 1,
                        "maxWithdraw": 10000
                    }
                },
                "image": "https://cmsbetconstruct.com/content/images/payments/default/27.png"
            },
            {
                "name": "trustpay",
                "order": 3,
                "depositFormFields": [],
                "withdrawFormFields": [],
                "displayName": "Trustpay",
                "paymentID": 8,
                "canDeposit": true,
                "canWithdraw": false,
                "info": {"EUR": {"depositFee": 0, "depositProcessTime": 0, "minDeposit": 0.01, "maxDeposit": 500000}},
                "image": "https://cmsbetconstruct.com/content/images/payments/default/8.png"
            },
            {
                "name": "yandex",
                "displayName": "Yandex",
                "canDeposit": true,
                "canWithdraw": true,
                "order": 10,
                "depositInfoTextKey": "deposit_info_yandex",
                "withdrawInfoTextKey": "withdraw_info_yandex",
                "withdrawFormFields": [],
                "depositFormFields": [],
                "paymentID": 65,
                "info": {
                    "USD": {"depositFee": 0, "depositProcessTime": 0, "minDeposit": 5, "maxDeposit": 5000},
                    "EUR": {"depositFee": 0, "depositProcessTime": 0, "minDeposit": 5, "maxDeposit": 5000},
                    "RUB": {
                        "depositFee": 0,
                        "depositProcessTime": 0,
                        "minDeposit": 10,
                        "maxDeposit": 50000,
                        "withdrawFee": 0,
                        "withdrawProcessTime": 24,
                        "minWithdraw": 1,
                        "maxWithdraw": 15000
                    },
                    "UAH": {"depositFee": 0, "depositProcessTime": 0, "minDeposit": 10, "maxDeposit": 50000}
                },
                "image": "https://cmsbetconstruct.com/content/images/payments/default/65.png"
            },
            {
                "name": "webmoney",
                "displayName": "WebMoney",
                "canDeposit": false,
                "canWithdraw": false,
                "order": 3,
                "depositInfoTextKey": "deposit_info_webmoney",
                "withdrawInfoTextKey": "withdraw_info_webmoney",
                "withdrawFormFields": [],
                "depositFormFields": [],
                "paymentID": 76,
                "info": {
                    "USD": {
                        "depositFee": 0,
                        "depositProcessTime": 0,
                        "minDeposit": 0.1,
                        "maxDeposit": 500000,
                        "withdrawFee": 0,
                        "withdrawProcessTime": 24,
                        "minWithdraw": 1,
                        "maxWithdraw": 500000
                    },
                    "EUR": {
                        "depositFee": 0,
                        "depositProcessTime": 0,
                        "minDeposit": 0.1,
                        "maxDeposit": 500000,
                        "withdrawFee": 0,
                        "withdrawProcessTime": 24,
                        "minWithdraw": 1,
                        "maxWithdraw": 500000
                    },
                    "RUB": {
                        "depositFee": 0,
                        "depositProcessTime": 0,
                        "minDeposit": 0.1,
                        "maxDeposit": 500000,
                        "withdrawFee": 0,
                        "withdrawProcessTime": 24,
                        "minWithdraw": 1,
                        "maxWithdraw": 500000
                    }
                },
                "image": "https://cmsbetconstruct.com/content/images/payments/default/76.png"
            },
            {
                "name": "qiwi",
                "displayName": "Qiwi",
                "canDeposit": true,
                "canWithdraw": true,
                "order": 4,
                "depositInfoTextKey": "deposit_info_qiwi",
                "withdrawInfoTextKey": "withdraw_info_qiwi",
                "depositFormFields": [{"name": "wallet_id", "type": "text", "label": "Wallet id"}],
                "withdrawFormFields": [{"name": "wallet_id", "type": "text", "label": "Wallet id"}],
                "paymentID": 77,
                "info": {
                    "RUB": {
                        "depositFee": 0,
                        "depositProcessTime": 0,
                        "minDeposit": 5,
                        "maxDeposit": 500000,
                        "withdrawFee": 0,
                        "withdrawProcessTime": 24,
                        "minWithdraw": 10,
                        "maxWithdraw": 14500
                    }
                },
                "image": "https://cmsbetconstruct.com/content/images/payments/default/77.png"
            },
            {
                "name": "unionpay",
                "canDeposit": false,
                "canWithdraw": false,
                "displayName": "UnionPay",
                "order": 16,
                "depositFormFields": [],
                "withdrawFormFields": [],
                "paymentID": 79,
                "info": {"CNY": {"depositFee": 0, "depositProcessTime": 0, "minDeposit": 0.1, "maxDeposit": 500000}},
                "image": "https://cmsbetconstruct.com/content/images/payments/default/79.png"
            },
            {
                "name": "wirecardnew",
                "displayName": "WireCard",
                "canDeposit": true,
                "canWithdraw": true,
                "order": 9,
                "depositInfoTextKey": "deposit_info_wirecard",
                "withdrawInfoTextKey": "withdraw_info_wirecardnew",
                "withdrawFormFields": [],
                "depositFormFields": [],
                "paymentID": 29,
                "info": {
                    "USD": {
                        "depositFee": 0,
                        "depositProcessTime": 0,
                        "minDeposit": 5,
                        "maxDeposit": 500000,
                        "withdrawFee": 0,
                        "withdrawProcessTime": 24,
                        "minWithdraw": 10,
                        "maxWithdraw": 10000
                    },
                    "EUR": {
                        "depositFee": 0,
                        "depositProcessTime": 0,
                        "minDeposit": 5,
                        "maxDeposit": 500000,
                        "withdrawFee": 0,
                        "withdrawProcessTime": 24,
                        "minWithdraw": 10,
                        "maxWithdraw": 10000
                    },
                    "RUB": {
                        "depositFee": 0,
                        "depositProcessTime": 0,
                        "minDeposit": 100,
                        "maxDeposit": 500000,
                        "withdrawFee": 0,
                        "withdrawProcessTime": 24,
                        "minWithdraw": 50,
                        "maxWithdraw": 15000
                    },
                    "UAH": {
                        "depositFee": 0,
                        "depositProcessTime": 0,
                        "minDeposit": 100,
                        "maxDeposit": 500000,
                        "withdrawFee": 0,
                        "withdrawProcessTime": 24,
                        "minWithdraw": 50,
                        "maxWithdraw": 10000
                    },
                    "PLN": {
                        "depositFee": 0,
                        "depositProcessTime": 0,
                        "minDeposit": 1,
                        "maxDeposit": 10000,
                        "withdrawFee": 0,
                        "withdrawProcessTime": 24,
                        "minWithdraw": 1,
                        "maxWithdraw": 10000
                    }
                },
                "image": "https://cmsbetconstruct.com/content/images/payments/default/29.png"
            },
            {
                "name": "yandexinvois",
                "displayName": "YandexAlfa",
                "canDeposit": true,
                "canWithdraw": false,
                "order": 11,
                "depositInfoTextKey": "deposit_info_yandex",
                "withdrawInfoTextKey": "withdraw_info_yandex",
                "onlyInfoTextOnWithdraw": true,
                "depositFormFields": [],
                "withdrawFormFields": [],
                "paymentID": 72,
                "info": {
                    "USD": {"depositFee": 0, "depositProcessTime": 0, "minDeposit": 5, "maxDeposit": 5000},
                    "EUR": {"depositFee": 0, "depositProcessTime": 0, "minDeposit": 5, "maxDeposit": 5000},
                    "RUB": {"depositFee": 0, "depositProcessTime": 0, "minDeposit": 10, "maxDeposit": 50000},
                    "UAH": {"depositFee": 0, "depositProcessTime": 0, "minDeposit": 10, "maxDeposit": 50000}
                },
                "image": "https://cmsbetconstruct.com/content/images/payments/default/72.png"
            },
            {
                "name": "yandexcash",
                "displayName": "YandexTerminal",
                "canDeposit": true,
                "canWithdraw": false,
                "order": 13,
                "depositInfoTextKey": "deposit_info_yandex",
                "withdrawInfoTextKey": "withdraw_info_yandex",
                "onlyInfoTextOnWithdraw": true,
                "depositFormFields": [],
                "withdrawFormFields": [],
                "paymentID": 74,
                "info": {
                    "USD": {"depositFee": 0, "depositProcessTime": 0, "minDeposit": 5, "maxDeposit": 5000},
                    "EUR": {"depositFee": 0, "depositProcessTime": 0, "minDeposit": 5, "maxDeposit": 5000},
                    "RUB": {"depositFee": 0, "depositProcessTime": 0, "minDeposit": 10, "maxDeposit": 50000},
                    "UAH": {"depositFee": 0, "depositProcessTime": 0, "minDeposit": 10, "maxDeposit": 50000}
                },
                "image": "https://cmsbetconstruct.com/content/images/payments/default/74.png"
            },
            {
                "name": "yandexbank",
                "displayName": "YandexVisaMaster",
                "canDeposit": true,
                "canWithdraw": false,
                "order": 12,
                "depositInfoTextKey": "deposit_info_yandex",
                "withdrawInfoTextKey": "withdraw_info_yandex",
                "onlyInfoTextOnWithdraw": true,
                "depositFormFields": [],
                "withdrawFormFields": [],
                "paymentID": 73,
                "info": {
                    "USD": {"depositFee": 0, "depositProcessTime": 0, "minDeposit": 5, "maxDeposit": 5000},
                    "EUR": {"depositFee": 0, "depositProcessTime": 0, "minDeposit": 5, "maxDeposit": 5000},
                    "RUB": {"depositFee": 0, "depositProcessTime": 0, "minDeposit": 10, "maxDeposit": 50000},
                    "UAH": {"depositFee": 0, "depositProcessTime": 0, "minDeposit": 10, "maxDeposit": 50000}
                },
                "image": "https://cmsbetconstruct.com/content/images/payments/default/73.png"
            },
            {
                "name": "yandexprbank",
                "displayName": "YandexPrBank",
                "canDeposit": true,
                "canWithdraw": false,
                "order": 14,
                "depositInfoTextKey": "deposit_info_yandex",
                "withdrawInfoTextKey": "withdraw_info_yandex",
                "onlyInfoTextOnWithdraw": true,
                "depositFormFields": [],
                "withdrawFormFields": [],
                "paymentID": 81,
                "info": {
                    "USD": {"depositFee": 0, "depositProcessTime": 0, "minDeposit": 5, "maxDeposit": 5000},
                    "EUR": {"depositFee": 0, "depositProcessTime": 0, "minDeposit": 5, "maxDeposit": 5000},
                    "RUB": {"depositFee": 0, "depositProcessTime": 0, "minDeposit": 10, "maxDeposit": 50000},
                    "UAH": {"depositFee": 0, "depositProcessTime": 0, "minDeposit": 10, "maxDeposit": 50000}
                },
                "image": "https://cmsbetconstruct.com/content/images/payments/default/81.png"
            },
            {
                "name": "safecharge",
                "displayName": "SafeCharge",
                "canDeposit": false,
                "canWithdraw": false,
                "order": 6,
                "depositFormFields": [],
                "withdrawFormFields": [],
                "paymentID": 88,
                "info": {
                    "USD": {"depositFee": 0, "depositProcessTime": 0, "minDeposit": 1, "maxDeposit": 10000},
                    "EUR": {"depositFee": 0, "depositProcessTime": 0, "minDeposit": 1, "maxDeposit": 10000},
                    "GBP": {"depositFee": 0, "depositProcessTime": 0, "minDeposit": 1, "maxDeposit": 10000},
                    "UAH": {"depositFee": 0, "depositProcessTime": 0, "minDeposit": 1, "maxDeposit": 10000},
                    "CNY": {"depositFee": 0, "depositProcessTime": 0, "minDeposit": 1, "maxDeposit": 10000},
                    "PLN": {"depositFee": 0, "depositProcessTime": 0, "minDeposit": 1, "maxDeposit": 10000},
                    "KZT": {"depositFee": 0, "depositProcessTime": 0, "minDeposit": 1, "maxDeposit": 10000},
                    "SEK": {"depositFee": 0, "depositProcessTime": 0, "minDeposit": 1, "maxDeposit": 10000}
                },
                "image": "https://cmsbetconstruct.com/content/images/payments/default/88.png"
            },
            {
                "name": "moneta",
                "displayName": "Moneta",
                "canDeposit": true,
                "canWithdraw": true,
                "order": 7,
                "depositInfoTextKey": "deposit_info_moneta",
                "withdrawInfoTextKey": "withdraw_info_moneta",
                "depositFormFields": [],
                "withdrawFormFields": [{"name": "email", "type": "text", "label": "Email"}, {
                    "name": "name",
                    "type": "text",
                    "label": "Name"
                }, {"name": "id", "type": "text", "label": "Wallet id"}],
                "paymentID": 102,
                "info": {
                    "USD": {
                        "depositFee": 0,
                        "depositProcessTime": 0,
                        "minDeposit": 1,
                        "maxDeposit": 10000,
                        "withdrawFee": 0,
                        "withdrawProcessTime": 24,
                        "minWithdraw": 1,
                        "maxWithdraw": 10000
                    },
                    "EUR": {
                        "depositFee": 0,
                        "depositProcessTime": 0,
                        "minDeposit": 1,
                        "maxDeposit": 10000,
                        "withdrawFee": 0,
                        "withdrawProcessTime": 24,
                        "minWithdraw": 1,
                        "maxWithdraw": 10000
                    },
                    "RUB": {
                        "depositFee": 0,
                        "depositProcessTime": 0,
                        "minDeposit": 1,
                        "maxDeposit": 10000,
                        "withdrawFee": 0,
                        "withdrawProcessTime": 24,
                        "minWithdraw": 1,
                        "maxWithdraw": 10000
                    }
                },
                "image": "https://cmsbetconstruct.com/content/images/payments/default/102.png"
            },
            {
                "name": "dotpay",
                "canDeposit": true,
                "canWithdraw": false,
                "displayName": "DotPay",
                "depositInfoTextKey": "deposit_info_dotpay",
                "withdrawInfoTextKey": "withdraw_info_dotpay",
                "order": 18,
                "depositFormFields": [],
                "withdrawFormFields": [],
                "paymentID": 103,
                "info": {
                    "USD": {"depositFee": 0, "depositProcessTime": 0, "minDeposit": 1, "maxDeposit": 10000},
                    "EUR": {"depositFee": 0, "depositProcessTime": 0, "minDeposit": 1, "maxDeposit": 10000}
                },
                "image": "https://cmsbetconstruct.com/content/images/payments/default/103.png"
            },
            {
                "name": "ecocard",
                "displayName": "EcoPayz",
                "canDeposit": true,
                "canWithdraw": true,
                "order": 21,
                "depositInfoTextKey": "deposit_info_ecocard",
                "withdrawInfoTextKey": "withdraw_info_ecocard",
                "depositFormFields": [],
                "withdrawFormFields": [{"name": "account", "type": "text", "label": "Account Id"}],
                "paymentID": 48,
                "info": {
                    "USD": {
                        "depositFee": 0,
                        "depositProcessTime": 0,
                        "minDeposit": 1,
                        "maxDeposit": 10000,
                        "withdrawFee": 0,
                        "withdrawProcessTime": 24,
                        "minWithdraw": 1,
                        "maxWithdraw": 10000
                    },
                    "EUR": {
                        "depositFee": 0,
                        "depositProcessTime": 0,
                        "minDeposit": 1,
                        "maxDeposit": 10000,
                        "withdrawFee": 0,
                        "withdrawProcessTime": 24,
                        "minWithdraw": 1,
                        "maxWithdraw": 10000
                    },
                    "RUB": {
                        "depositFee": 0,
                        "depositProcessTime": 0,
                        "minDeposit": 1,
                        "maxDeposit": 10000,
                        "withdrawFee": 0,
                        "withdrawProcessTime": 24,
                        "minWithdraw": 1,
                        "maxWithdraw": 10000
                    }
                },
                "image": "https://cmsbetconstruct.com/content/images/payments/default/48.png"
            },
            {
                "name": "pugglepay",
                "canDeposit": true,
                "canWithdraw": false,
                "displayName": "PugglePay",
                "countryAllow": ["SZ", "FI"],
                "order": 17,
                "depositFormFields": [],
                "depositInfoText": [],
                "withdrawFormFields": [],
                "paymentID": 127,
                "info": {
                    "USD": {"depositFee": 0, "depositProcessTime": 0, "minDeposit": 1, "maxDeposit": 10000},
                    "EUR": {"depositFee": 0, "depositProcessTime": 0, "minDeposit": 1, "maxDeposit": 10000},
                    "SEK": {"depositFee": 0, "depositProcessTime": 0, "minDeposit": 1, "maxDeposit": 10000}
                },
                "image": "https://cmsbetconstruct.com/content/images/payments/default/127.png"
            },
            {
                "name": "DengiOnline_WebMoney",
                "order": 18,
                "depositFormFields": [],
                "withdrawFormFields": [],
                "displayName": "DengiOnline_WebMoney",
                "paymentID": 40,
                "canDeposit": false,
                "canWithdraw": false,
                "info": {"RUB": {"depositFee": 0, "depositProcessTime": 0, "minDeposit": 1, "maxDeposit": 100000}},
                "image": "https://cmsbetconstruct.com/content/images/payments/default/40.png"
            },
            {
                "name": "toditocash",
                "canDeposit": true,
                "canWithdraw": false,
                "displayName": "ToditoCash",
                "order": 20,
                "depositFormFields": [],
                "withdrawFormFields": [],
                "paymentID": 139,
                "info": {"MXN": {"depositFee": 0, "depositProcessTime": 0, "minDeposit": 1, "maxDeposit": 10000}},
                "image": "https://cmsbetconstruct.com/content/images/payments/default/139.png"
            },
            {
                "name": "AstroPayDirect",
                "order": 20,
                "depositFormFields": [],
                "withdrawFormFields": [],
                "displayName": "AstroPayDirect",
                "paymentID": 58,
                "canDeposit": false,
                "canWithdraw": false,
                "info": {
                    "USD": {"depositFee": 0, "depositProcessTime": 0, "minDeposit": 1, "maxDeposit": 10000},
                    "EUR": {"depositFee": 0, "depositProcessTime": 0, "minDeposit": 1, "maxDeposit": 10000},
                    "RUB": {"depositFee": 0, "depositProcessTime": 0, "minDeposit": 1, "maxDeposit": 10000}
                },
                "image": "https://cmsbetconstruct.com/content/images/payments/default/58.png"
            },
            {
                "name": "otopay",
                "canDeposit": true,
                "canWithdraw": false,
                "order": 19,
                "depositFormFields": [],
                "withdrawFormFields": [],
                "displayName": "OtoPay",
                "paymentID": 133,
                "info": {"EUR": {"depositFee": 0, "depositProcessTime": 0, "minDeposit": 1, "maxDeposit": 10000}},
                "image": "https://cmsbetconstruct.com/content/images/payments/default/133.png"
            },
            {
                "name": "InterkassaQiwi",
                "order": 22,
                "depositFormFields": [],
                "withdrawFormFields": [],
                "displayName": "InterkassaQiwi",
                "paymentID": 14,
                "canDeposit": true,
                "canWithdraw": false,
                "info": {
                    "USD": {"depositFee": 0, "depositProcessTime": 0, "minDeposit": 1, "maxDeposit": 10000},
                    "RUB": {"depositFee": 0, "depositProcessTime": 0, "minDeposit": 1, "maxDeposit": 10000},
                    "UAH": {"depositFee": 0, "depositProcessTime": 0, "minDeposit": 1, "maxDeposit": 10000}
                },
                "image": "https://cmsbetconstruct.com/content/images/payments/default/14.png"
            },
            {
                "name": "interkassa_visa",
                "displayName": "InterkassaVisa",
                "canDeposit": false,
                "canWithdraw": false,
                "order": 41,
                "depositFormFields": [],
                "withdrawFormFields": [{"name": "lastname", "type": "text", "label": "Last name"}, {
                    "name": "firstname",
                    "type": "text",
                    "label": "First name"
                }, {"name": "middlename", "type": "text", "label": "Middle name"}, {
                    "name": "phone",
                    "type": "text",
                    "label": "Phone"
                }, {"name": "card_num", "type": "text", "label": "Card number", "restrict": "[^0-9]"}, {
                    "name": "isPrivat",
                    "type": "select",
                    "label": "Bank",
                    "options": [{"value": "", "text": ""}, {
                        "value": "privat",
                        "text": "CB PrivatBank"
                    }, {"value": "notprivat", "text": "Other Bank"}]
                }],
                "paymentID": 84,
                "info": {
                    "USD": {
                        "depositFee": 0,
                        "depositProcessTime": 0,
                        "minDeposit": 1,
                        "maxDeposit": 10000,
                        "withdrawFee": 0,
                        "withdrawProcessTime": 24,
                        "minWithdraw": 1,
                        "maxWithdraw": 10000
                    },
                    "RUB": {
                        "depositFee": 0,
                        "depositProcessTime": 0,
                        "minDeposit": 1,
                        "maxDeposit": 10000,
                        "withdrawFee": 0,
                        "withdrawProcessTime": 24,
                        "minWithdraw": 1,
                        "maxWithdraw": 10000
                    },
                    "UAH": {
                        "depositFee": 0,
                        "depositProcessTime": 0,
                        "minDeposit": 1,
                        "maxDeposit": 10000,
                        "withdrawFee": 0,
                        "withdrawProcessTime": 24,
                        "minWithdraw": 50,
                        "maxWithdraw": 10000
                    }
                },
                "image": "https://cmsbetconstruct.com/content/images/payments/default/84.png"
            },
            {
                "name": "interkassa_master",
                "displayName": "InterkassaMaster",
                "canDeposit": false,
                "canWithdraw": false,
                "order": 42,
                "depositFormFields": [],
                "withdrawFormFields": [{"name": "lastname", "type": "text", "label": "Last name"}, {
                    "name": "firstname",
                    "type": "text",
                    "label": "First name"
                }, {"name": "middlename", "type": "text", "label": "Middle name"}, {
                    "name": "phone",
                    "type": "text",
                    "label": "Phone"
                }, {"name": "card_num", "type": "text", "label": "Card number", "restrict": "[^0-9]"}, {
                    "name": "isPrivat",
                    "type": "select",
                    "label": "Bank",
                    "options": [{"value": "", "text": ""}, {
                        "value": "privat",
                        "text": "CB PrivatBank"
                    }, {"value": "notprivat", "text": "Other Bank"}]
                }],
                "paymentID": 85,
                "info": {
                    "USD": {
                        "depositFee": 0,
                        "depositProcessTime": 0,
                        "minDeposit": 1,
                        "maxDeposit": 10000,
                        "withdrawFee": 0,
                        "withdrawProcessTime": 24,
                        "minWithdraw": 1,
                        "maxWithdraw": 10000
                    },
                    "RUB": {
                        "depositFee": 0,
                        "depositProcessTime": 0,
                        "minDeposit": 1,
                        "maxDeposit": 10000,
                        "withdrawFee": 0,
                        "withdrawProcessTime": 24,
                        "minWithdraw": 1,
                        "maxWithdraw": 10000
                    },
                    "UAH": {
                        "depositFee": 0,
                        "depositProcessTime": 0,
                        "minDeposit": 1,
                        "maxDeposit": 10000,
                        "withdrawFee": 0,
                        "withdrawProcessTime": 24,
                        "minWithdraw": 1,
                        "maxWithdraw": 10000
                    }
                },
                "image": "https://cmsbetconstruct.com/content/images/payments/default/85.png"
            },
            {
                "name": "interkassa_w1",
                "displayName": "InterkassaW1",
                "canDeposit": false,
                "canWithdraw": false,
                "order": 43,
                "depositInfoText": [],
                "withdrawInfoText": [],
                "depositFormFields": [],
                "withdrawFormFields": [{"name": "lastname", "type": "text", "label": "Last name"}, {
                    "name": "firstname",
                    "type": "text",
                    "label": "First name"
                }, {"name": "middlename", "type": "text", "label": "Middle name"}, {
                    "name": "purse",
                    "type": "text",
                    "label": "Purse",
                    "restrict": "[\\s]"
                }],
                "paymentID": 86,
                "info": {
                    "USD": {
                        "depositFee": 0,
                        "depositProcessTime": 0,
                        "minDeposit": 1,
                        "maxDeposit": 10000,
                        "withdrawFee": 0,
                        "withdrawProcessTime": 24,
                        "minWithdraw": 1,
                        "maxWithdraw": 10000
                    },
                    "EUR": {
                        "depositFee": 0,
                        "depositProcessTime": 0,
                        "minDeposit": 1,
                        "maxDeposit": 10000,
                        "withdrawFee": 0,
                        "withdrawProcessTime": 24,
                        "minWithdraw": 1,
                        "maxWithdraw": 10000
                    },
                    "UAH": {
                        "depositFee": 0,
                        "depositProcessTime": 0,
                        "minDeposit": 1,
                        "maxDeposit": 10000,
                        "withdrawFee": 0,
                        "withdrawProcessTime": 24,
                        "minWithdraw": 1,
                        "maxWithdraw": 10000
                    }
                },
                "image": "https://cmsbetconstruct.com/content/images/payments/default/86.png"
            },
            {
                "name": "interkassa_webmoney",
                "displayName": "InterkassaWebmoney",
                "canDeposit": false,
                "canWithdraw": true,
                "order": 44,
                "depositInfoText": [],
                "withdrawInfoText": [],
                "depositFormFields": [],
                "withdrawFormFields": [{"name": "purse", "type": "text", "label": "Purse", "restrict": "[\\s]"}],
                "paymentID": 229,
                "info": {
                    "USD": {
                        "depositFee": 0,
                        "depositProcessTime": 0,
                        "minDeposit": 1,
                        "maxDeposit": 10000,
                        "withdrawFee": 0,
                        "withdrawProcessTime": 24,
                        "minWithdraw": 1,
                        "maxWithdraw": 10000
                    },
                    "RUB": {"depositFee": 0, "depositProcessTime": 0, "minDeposit": 1, "maxDeposit": 10000},
                    "UAH": {"depositFee": 0, "depositProcessTime": 0, "minDeposit": 1, "maxDeposit": 10000}
                },
                "image": "https://cmsbetconstruct.com/content/images/payments/default/229.png"
            },
            {
                "name": "interkassa",
                "order": 27,
                "depositFormFields": [],
                "withdrawFormFields": [],
                "displayName": "Interkassa",
                "paymentID": 158,
                "canDeposit": true,
                "canWithdraw": false,
                "info": {
                    "USD": {"depositFee": 0, "depositProcessTime": 0, "minDeposit": 1, "maxDeposit": 10000},
                    "RUB": {"depositFee": 0, "depositProcessTime": 0, "minDeposit": 1, "maxDeposit": 10000},
                    "UAH": {"depositFee": 0, "depositProcessTime": 0, "minDeposit": 1, "maxDeposit": 10000}
                },
                "image": "https://cmsbetconstruct.com/content/images/payments/default/158.png"
            },
            {
                "name": "apcopay",
                "canDeposit": true,
                "canWithdraw": false,
                "displayName": "IDEAL",
                "depositInfoText": [],
                "order": 37,
                "depositFormFields": [],
                "withdrawFormFields": [],
                "paymentID": 166,
                "info": {"EUR": {"depositFee": 0, "depositProcessTime": 0, "minDeposit": 1, "maxDeposit": 10000}},
                "image": "https://cmsbetconstruct.com/content/images/payments/default/166.png"
            },
            {
                "name": "AstroPay",
                "order": 29,
                "depositFormFields": [],
                "withdrawFormFields": [],
                "displayName": "AstroPay",
                "paymentID": 5,
                "canDeposit": true,
                "canWithdraw": true,
                "info": {
                    "USD": {
                        "depositFee": 0,
                        "depositProcessTime": 0,
                        "minDeposit": 1,
                        "maxDeposit": 10000,
                        "withdrawFee": 0,
                        "withdrawProcessTime": 24,
                        "minWithdraw": 1,
                        "maxWithdraw": 10000
                    },
                    "EUR": {"withdrawFee": 0, "withdrawProcessTime": 24, "minWithdraw": 1, "maxWithdraw": 10000},
                    "RUB": {"withdrawFee": 0, "withdrawProcessTime": 24, "minWithdraw": 1, "maxWithdraw": 10000},
                    "UAH": {"withdrawFee": 0, "withdrawProcessTime": 24, "minWithdraw": 1, "maxWithdraw": 10000}
                },
                "image": "https://cmsbetconstruct.com/content/images/payments/default/5.png"
            },
            {
                "name": "apcopay2",
                "canDeposit": false,
                "canWithdraw": false,
                "displayName": "TrustPay",
                "depositInfoText": [],
                "order": 38,
                "depositFormFields": [],
                "withdrawFormFields": [],
                "paymentID": 196,
                "info": {"EUR": {"depositFee": 0, "depositProcessTime": 0, "minDeposit": 1, "maxDeposit": 10000}},
                "image": "https://cmsbetconstruct.com/content/images/payments/default/196.png"
            },
            {
                "name": "apcopay3",
                "canDeposit": false,
                "canWithdraw": false,
                "displayName": "GiroPay",
                "depositInfoText": [],
                "order": 39,
                "depositFormFields": [],
                "withdrawFormFields": [],
                "paymentID": 197,
                "info": {
                    "USD": {"depositFee": 0, "depositProcessTime": 0, "minDeposit": 1, "maxDeposit": 10000},
                    "EUR": {"depositFee": 0, "depositProcessTime": 0, "minDeposit": 1, "maxDeposit": 10000}
                },
                "image": "https://cmsbetconstruct.com/content/images/payments/default/197.png"
            }
        ],
        "googleAnalyticsId": 'UA-29242337-44'
    },
    casino: {
        '@replace': true,
        providersThatWorkWithSwarm: [],
        urlPrefix: "https://launchgames.vbet.com",
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
    "betting": {
        "enableExpressBonus": true
    }
};