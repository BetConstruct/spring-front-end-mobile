module.exports = {
    "main": {
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
            },
            "fas": {
                "short": "FA",
                "full": "فارسی",
                "order": 14,
                "rtl": true
            },
            "arb": {
                "short": "AR",
                "full": "العربية"
            },
            "pt-br": {
                "short": "PT-BR",
                "full": "Português do Brasil",
                "order": 6
            }
        },
        "showGameStatistics": true,
        "statsHostname": {
            "prefixUrl": 'http://statistics.vbet.com/#/'
        },
        "enableTabletVersion": true,
        "enableRuntimePopup": false,
        "mainMenuItemsOrder": ["prematch", "live", "poker", "casino", "live-casino", "news", "statistics", "backgammon(fromUrl)", "belote", "matchCenter(fromUrl)", "colossusBets"],
        "mainMenuItems": { // main menu items that are not in routes
            "news": {
                "title": "News",
                "link": "http://news.vbet.com",
                "target": "_blank"
                //"hideBeforeLogin": false hiding navigation link from menu
            },
            "poker": {
                "title": "poker",
                "direct": true,
                "link": "https://poker-web.vbet.com/4/#/",
                "target": "_blank",
                "id": 28,
                "preLoadAuth": true,
                "withSticker": "new"
            },
            "statistics": {
                "title": "Statistics",
                "link": "https://statistics.vbet.com",
                "target": "_blank"
            },
            "belote": {"title": "Belote", "direct": true, "link": "https://belote.vbet.com/m/", "target": "_blank", "id": 10, "params": {"gameid": "10"}, "preLoadAuth": true}
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
            "downloadLink": "http://android.betcoapps.com/sportsbook/sportsbook-vbet.apk"
        },
        "iosAppSettings": {
            "showIOSAppDownloadPopup": true,
            "appStoreLink": "https://itunes.apple.com/am/app/sportsbook-by-vbet-sports/id1071205599?mt=8",
            "iosAppMetaContent": "app-id=1071205599"
        },
        "liveChat": {
            "isLiveAgent": true,
            "liveAgentID": 'b0170f5a'
        },
        'regConfig': {
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
                        "regex": "^[^0-9\\[\\]\\\\`~!@#$%^&*()_+={};:<>|./?,\"'-\\s]+$",
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
                        "regex": "^[^0-9\\[\\]\\\\`~!@#$%^&*()_+={};:<>|./?,\"'-\\s]+$",
                        "required": true
                    },
                    "validationMessages": {
                        "required": "This field is required",
                        "minlength": "Too short",
                        "maxlength": "Too long",
                        "regex": "Please enter a valid name: only letters - no digits and/or symbols"
                    }
                },
                "password": {
                    "showPasswordMask": true,
                    "order": 17,
                    "title": "Password",
                    "name": "password",
                    "placeholder": "Enter here",
                    "type": "password",
                    "classes": "single-form-item",
                    "customAttrs": {
                        "minlength": "8",
                        "maxlength": "50",
                        "regex": "^(?=.*[a-z])[a-zA-Z\\d\\[\\]\\\\`~!@#$%^&*()_+={};:<>|./?,\"'-]+$",
                        "required": true
                    },
                    "validationMessages": {
                        "required": "This field is required",
                        "minlength": "Password should contain at least 8 characters",
                        "maxlength": "Too long",
                        "tooShort": "Password is too short",
                        "regex": "Allowed characters are A-Z, a-z, 0-9 and these special characters ! @ # $ % ? ^ & * ( ) - = _ + \\ / | ; : , . < > [ ] { } ` ' \" ~",
                        "sameAsLogin": "Password can't be same as login."
                    }
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
                        "regex": "^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+([.])[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$",
                        "required": true
                    },
                    "validationMessages": {
                        "required": "This field is required",
                        "regex": "Invalid email address",
                        "regexArray": "Invalid email address",
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
                    "placeholder": "Day/Month/Year",
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
                    "options": [{
                        "value": "M",
                        "translationKey": "Male"
                    }, {
                        "value": "F",
                        "translationKey": "Female"
                    }]
                },
                //  "re_captcha": {
                //      "order": 6,
                //      "title": "Re Captcha",
                //      "skippAbleForProfileValidation": true,
                //      "name": "g_recaptcha_response",
                //      "placeholder": "Enter here",
                //     "type": "re_captcha",
                //      "classes": "single-form-item",
                //      "customAttrs": {
                //          "required": true
                //      },
                //      "validationMessages": {
                //         "required": "This field is required"
                //       }
                //  },
                "countryCode": {
                    "order": 3,
                    "title": "Country code",
                    "name": "country_code",
                    "labelText": "Country of Residence",
                    "skippAbleForProfileValidation": true,
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
                "currencyName": {
                    "order": 4,
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
                    "order": 5,
                    "title": "Phone number",
                    "labelText": "Phone number",
                    "name": "phone",
                    "placeholder": "Enter here",
                    "type": "phone",
                    "classes": "single-form-item",
                    "customAttrs": {
                        "minlength": "5",
                        "maxlength": "50",
                        "regex": "^[0-9]+$",
                        "required": false
                    },
                    "validationMessages": {
                        "minlength": "Too short",
                        "maxlength": "Too long",
                        "required": "This field is required",
                        "regex": "This is not a valid phone number"
                    }
                },
                "phone_code": {
                    "title": "phone_code",
                    "labelText": "phone_code",
                    "name": "phone_code",
                    "placeholder": "phone_code",
                    "type": "phone_code",
                    "classes": "phone_code",
                    "customAttrs": {
                        "minlength": "2",
                        "maxlength": "10",
                        "regex": "^[+]\\d+$",
                        "required": false
                    },
                    "validationMessages": {
                        "minlength": "Too short",
                        "maxlength": "Too long",
                        "required": "This field is required",
                        "regex": "This is not a valid phone code",
                        "contain": "This is not a valid phone code"
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
            "steps": [
                {
                    "fields": ["password", "email"]
                },
                {
                    "fields": ["firstName", "lastName", "countryCode", "currencyName", "phone_code", "phone", "agree"]
                }

            ],
            'settings': {
                "redirectAfterRegistration": true,
                "enableMultiStepForm": true,
                "restrictedCountries": ["AF", "AG", "AU", "BE", "BG", "KY", "CU", "CY", "CZ", "DK", "DE", "HK", "HU", "IR", "IE", "IL", "IT", "JP", "LY", "MM", "NL", "KP", "PL", "PT", "RU", "SA", "RS", "SG", "ES", "SD", "SY", "PH", "TR", "GB", "YE", "GY"],
                "restrictedCountriesByIp": ["AF", "AG", "AU", "BE", "BG", "KY", "CU", "CY", "CZ", "DK", "DE", "HK", "HU", "IR", "IE", "IL", "IT", "JP", "LY", "MM", "NL", "KP", "PL", "PT", "RU", "SA", "RS", "SG", "ES", "SD", "SY", "PH", "TR", "GB", "YE", "GY", "FR"],
                "connectCountryToCurrency": {
                    "enabled": true,
                    "map": {
                        "AD": "EUR",
                        "AL": "EUR",
                        "AT": "EUR",
                        "BE": "EUR",
                        "BA": "EUR",
                        "BG": "EUR",
                        "CH": "EUR",
                        "CY": "EUR",
                        "GR": "EUR",
                        "HR": "EUR",
                        "IT": "EUR",
                        "LV": "EUR",
                        "LT": "EUR",
                        "LU": "EUR",
                        "MC": "EUR",
                        "ME": "EUR",
                        "MK": "EUR",
                        "MT": "EUR",
                        "NL": "EUR",
                        "RO": "EUR",
                        "SK": "EUR",
                        "SM": "EUR",
                        "SI": "EUR",
                        "LI": "EUR",
                        "RS": "EUR",
                        "PL": "PLN",
                        "SE": "SEK",
                        "UA": "UAH"
                    },
                    "default": "USD"
                }
            }
        },
        "personalDetails": {
            "readOnlyFields": ['id', 'first_name', 'last_name', 'birth_date', 'gender', 'email', 'country_code'],
            "editableFields": ['phone', 'password'],
            "requiredFields": ['birth_date', 'phone', 'password', 'gender', 'country_code']
        },
        "payments": [],
        "googleAnalyticsId": 'UA-29242337-7',
        "geoIPLangSwitch": {
            "enabled": true,
            "default": "eng",
            "MX": "spa",
            "ES": "spa",
            "CO": "spa",
            "AR": "spa",
            "PE": "spa",
            "VE": "spa",
            "CL": "spa",
            "CU": "spa",
            "EC": "spa",
            "DO": "spa",
            "GT": "spa",
            "HN": "spa",
            "BO": "spa",
            "SV": "spa",
            "NI": "spa",
            "PY": "spa",
            "CR": "spa",
            "PR": "spa",
            "UY": "spa",
            "PA": "spa",
            "GQ": "spa",
            "RU": "rus",
            "UA": "rus",
            "KZ": "rus",
            "UZ": "rus",
            "BY": "rus",
            "AZ": "rus",
            "KG": "rus",
            "TJ": "rus",
            "LV": "rus",
            "LT": "rus",
            "MD": "rus",
            "EE": "rus",
            "TM": "rus",
            "AM": "arm",
            "PT": "por",
            "AO": "por",
            "MZ": "por",
            "CV": "por",
            "GW": "por",
            "ST": "por",
            "TL": "por",
            "BR": "pt-br",
            "TR": "tur",
            "KR": "kor",
            "KP": "kor",
            "JP": "jpn",
            "CN": "zhh",
            "HK": "chi",
            "MO": "chi",
            "TW": "chi",
            "GE": "geo",
            "GR": "gre",
            "SE": "swe",
            "DE": "ger",
            "AT": "ger",
            "LI": "ger",
            "CH": "ger",
            "LU": "ger",
            "NO": "nor",
            "DZ": "arb",
            "BH": "arb",
            "DJ": "arb",
            "EG": "arb",
            "JO": "arb",
            "IQ": "arb",
            "YE": "arb",
            "QA": "arb",
            "KW": "arb",
            "LB": "arb",
            "LY": "arb",
            "MR": "arb",
            "MA": "arb",
            "AE": "arb",
            "OM": "arb",
            "SA": "arb",
            "SY": "arb",
            "SD": "arb",
            "TN": "arb",
            "KM": "arb",
            "SO": "arb",
            "SN": "arb",
            "TD": "arb",
            "PS": "arb",
            "IR": "fas",
            "AF": "fas"
        }
    },
    "cms": {
        "baseHost": "vbet",
        "configFromCmsLink": "https://cmsbetconstruct.com/skins/vbet.cms.betconstruct.com/js/conf.json",
        "keysThatShouldBeMerged": [{
            "path": "SkinConfig.payments",
            "key": "main.payments"
        }]
    },
    "casino": {
        '@replace': true,
        "providersThatWorkWithSwarm": [],
        "urlPrefix": "https://launchgames.vbet.com",
        "gamesUrl": '/global/mplay1.php',
        "url": "https://www.cmsbetconstruct.com/casino/",
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
    "betting": {
        "enableExpressBonus": false,
        "totalOddsMax": 10000
    },
    "everCookie": {"enabled": true}
};