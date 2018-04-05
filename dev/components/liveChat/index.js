import React, {Component} from 'react';
import {connect} from 'react-redux';
import Config from "../../config/main";
import {GetProfile} from "../../helpers/selectors";
import setGlobalUserDetails from "../../helpers/profile/setGlobalUserDetailsForLiveChat";
import PropTypes from 'prop-types';
import countries from "../../constants/countries";

function initLiveAgent (preferences) {
    let chat = Config.main.liveChat && (Config.main.liveChat[Config.env.lang] || Config.main.liveChat);
    let liveAgentButton;
    switch (true) {
        case !!(chat && chat.isLiveAgent): {
            switch (chat.liveAgentVersion) {
                case 2:
                    (function (d, src, c) {
                        let t = d.scripts[d.scripts.length - 1], s = d.createElement('script');
                        s.id = 'la_x2s6df8d';
                        s.async = true;
                        s.src = src;
                        s.onload = s.onreadystatechange = function () {
                            let rs = this.readyState;
                            if (rs && (rs !== 'complete') && (rs !== 'loaded')) {
                                return;
                            }
                            c(this);
                        };
                        t.parentElement.insertBefore(s, t.nextSibling);
                    })(document,
                        chat.liveAgentScript || '//cs.betconstruct.com/liveagent/scripts/track.js',
                        function (e) {
                            liveAgentButton = LiveAgent.createButton(chat.liveAgentLangsID && //eslint-disable-line no-undef
                            chat.liveAgentLangsID[Config.env.lang]
                                ? chat.liveAgentLangsID[Config.env.lang]
                                : chat.liveAgentID, e);
                            document.getElementById(liveAgentButton.elementId).className += chat.showNativeLiveChatButton ? '' : ' hide ';
                        });
                    break;
                default:
                    (function (d, src, c) {
                        let t = d.scripts[d.scripts.length - 1], s = d.createElement('script');
                        s.id = 'la_x2s6df8d';
                        s.async = true;
                        s.src = src;
                        s.onload = s.onreadystatechange = function () {
                            let rs = this.readyState;
                            if (rs && (rs !== 'complete') && (rs !== 'loaded')) {
                                return;
                            }
                            c(this);
                        };
                        t.parentElement.insertBefore(s, t.nextSibling);
                    })(document,
                        chat.liveAgentScript || '//cs.betconstruct.com/liveagent/scripts/track.js',
                        function (e) {
                            let vb = document.createElement('img');
                            vb.src = '//cs.betconstruct.com/liveagent/scripts/pix.gif';
                            vb.onload = function () {
                                liveAgentButton = LiveAgent.createVirtualButton(chat.liveAgentLangsID && //eslint-disable-line no-undef
                                chat.liveAgentLangsID[Config.env.lang]
                                    ? chat.liveAgentLangsID[Config.env.lang]
                                    : chat.liveAgentID, vb);
                            };
                        });
            }
            window.openContactSupport = function () {
                let instance = LiveAgent.instance; //eslint-disable-line no-undef
                if (liveAgentButton && (liveAgentButton.chat || chat.liveAgentVersion === 2)) {
                    // liveAgentButton.onClick();
                    (liveAgentButton.form && liveAgentButton.form.url) ? window.open(liveAgentButton.form.url, '_blank') : liveAgentButton.onClick();
                    if (chat.liveAgentVersion === 2) {
                        document.getElementById(liveAgentButton.elementId).className += chat.showNativeLiveChatButton ? '' : ' hide ';
                    }
                    return instance && instance.closeOpenedWidget;
                }
                setTimeout(window.openContactSupport, 100);
            };
            break;
        }
        case !!(chat && chat.isZopim): {
            window.$zopim || (function (d, s) {
                let z = window.$zopim = function (c) {
                        z._.push(c);
                    },
                    $ = z.s = d.createElement(s),
                    e = d.getElementsByTagName(s)[0];
                z.set = function (o) {
                    z.set._.push(o);
                };
                z._ = [];
                z.set._ = [];
                $.async = !0;
                $.setAttribute('charset', 'utf-8');
                $.src = '//v2.zopim.com/?' + chat.zopimId;
                z.t = +new Date();
                $.type = 'text/javascript';
                e.parentNode.insertBefore($, e);
            })(document, 'script');
            window.openContactSupport = function () {
                if (chat.zopimSimplePopup) {
                    var url;
                    if (chat.zopimPopupLanguage && chat.zopimPopupLanguage[Config.env.lang]) {
                        url = 'https://v2.zopim.com/widget/livechat.html?key=' + chat.zopimId + '&lang=' + chat.zopimPopupLanguage[Config.env.lang];
                    } else {
                        url = 'https://v2.zopim.com/widget/popout.html?key=' + chat.zopimId;
                    }
                    window.open(url, 'zopimChat', 'height=550,width=415,left=1,top=10,resizable=no,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no,status=yes');
                    return;
                } else {
                    window.$zopim.livechat.window.openPopout();
                }
            };
            let checkLiveChatButton = () => {
                if (window.$zopim && window.$zopim.livechat && window.$zopim.livechat.button) {
                    window.$zopim.livechat.button.hide();
                    return;
                } else {
                    setTimeout(function () {
                        checkLiveChatButton();
                    }, 1500);
                }
            };
            !chat.showNativeLiveChatButton && checkLiveChatButton();

            preferences && preferences.geoData &&
            preferences.geoData.countryCode &&
            chat.zopimPopupLanguage &&
            countries.iso2ToIso3[preferences.geoData.countryCode] &&
            chat.zopimPopupLanguage[countries.iso2ToIso3[preferences.geoData.countryCode].toLowerCase()] &&
            window.$zopim(function () {
                window.$zopim.livechat.setLanguage(chat.zopimPopupLanguage[countries.iso2ToIso3[preferences.geoData.countryCode].toLowerCase()]);
            });
            break;
        }
        case !!(chat && chat.siteId && chat.codePlan): {
            let url = chat.url || 'https://chatserver.comm100.com',
                comm100ChatButton1 = {},
                comm100Lc = window.document.createElement('script'),
                comm100S = window.document.getElementsByTagName('script')[0];

            window.Comm100API = window.Comm100API || {};
            window.Comm100API.chat_buttons = window.Comm100API.chat_buttons || [];
            comm100ChatButton1.code_plan = chat.codePlan;
            comm100ChatButton1.div_id = 'live-chat-button1';
            window.Comm100API.chat_buttons.push(comm100ChatButton1);
            window.Comm100API.site_id = chat.siteId;
            window.Comm100API.main_code_plan = chat.codePlan;
            comm100Lc.type = 'text/javascript';
            comm100Lc.async = true;
            comm100Lc.src = url + '/livechat.ashx?siteId=' + window.Comm100API.site_id;
            comm100S.parentNode.insertBefore(comm100Lc, comm100S);
            window.openContactSupport = function () {
                window.Comm100API.open_chat_window(null, chat.codePlan);
            };
            let attempt = 0,
                hideCommButton = () => {
                    if (attempt > 100) {
                        return;
                    }
                    let button = window.Comm100API.chat_buttons[0];
                    if (button && button.div_id && document.getElementById(button.div_id)) {
                        let chatButton = document.getElementById(button.div_id);
                        chatButton && (chatButton.className = 'hide');
                    } else {
                        setTimeout(function () {
                            ++attempt;
                            hideCommButton();
                        }, 30);
                    }
                };
            if (!chat.showNativeLiveChatButton) {
                comm100Lc.addEventListener('load', hideCommButton, false);
            }
            break;
        }
        case !!(chat && chat.lc_api): {
            window.__lc = window.__lc || {};
            window.__lc.license = chat.license;
            (function () {
                var lc = document.createElement('script');
                lc.type = 'text/javascript';
                lc.async = true;
                lc.src = (document.location.protocol === 'https:' ? 'https://' : 'http://') + chat.url;
                var s = document.getElementsByTagName('script')[0];
                s.parentNode.insertBefore(lc, s);
            })();
            window.openContactSupport = function () {
                window.parent.LC_API.open_chat_window({source: 'minimized'}); //eslint-disable-line no-undef
            };
            // if (!chat.showNativeLiveChatButton) {
            //     let checkLiveChatButton = () => {
            //         if (window........) {
            //             // hide
            //             return;
            //         } else {
            //             setTimeout(function () {
            //                 checkLiveChatButton();
            //             }, 1500);
            //         }
            //     };
            //     !chat.showNativeLiveChatButton && checkLiveChatButton();
            // }
            break;
        }
        case !!(chat && chat.livePersonMonitor): {
            window.lpTag = window.lpTag || {}, typeof window.lpTag._tagCount === "undefined" ? (window.lpTag = {
                site: chat.siteNumber || "",
                section: window.lpTag.section || "",
                tagletSection: window.lpTag.tagletSection || null,
                autoStart: window.lpTag.autoStart !== !1,
                ovr: window.lpTag.ovr || {},
                _v: "1.8.0",
                _tagCount: 1,
                protocol: "https:",
                events: {
                    bind: function (t, e, i) {
                        window.lpTag.defer(function () {
                            window.lpTag.events.bind(t, e, i);
                        }, 0);
                    },
                    trigger: function (t, e, i) {
                        window.lpTag.defer(function () {
                            window.lpTag.events.trigger(t, e, i);
                        }, 1);
                    }
                },
                defer: function (t, e) {
                    e === 0 ? (this._defB = this._defB || [], this._defB.push(t)) : e === 1 ? (this._defT = this._defT || [], this._defT.push(t)) : (this._defL = this._defL || [], this._defL.push(t));
                },

                load: function (t, e, i) {
                    var n = this;
                    setTimeout(function () {
                        n._load(t, e, i);
                    }, 0);
                },
                _load: function (t, e, i) {
                    var n = t;
                    t || (n = this.protocol + "//" + (this.ovr && this.ovr.domain ? this.ovr.domain : chat.ovrDomain) + "/tag/tag.js?site=" + this.site);
                    var a = document.createElement("script");
                    a.setAttribute("charset", e || "UTF-8"), i && a.setAttribute("id", i), a.setAttribute("src", n), document.getElementsByTagName("head").item(0).appendChild(a);
                },
                init: function () {
                    this._timing = this._timing || {}, this._timing.start = (new Date()).getTime();
                    var t = this;
                    window.attachEvent ? window.attachEvent("onload", function () {
                        t._domReady("domReady");
                    }) : (window.addEventListener("DOMContentLoaded", function () {
                        t._domReady("contReady");
                    }, !1), window.addEventListener("load", function () {
                        t._domReady("domReady");
                    }
                        , !1)), typeof window._lptStop === "undefined" && this.load();
                },
                start: function () {
                    this.autoStart = !0;
                },
                _domReady: function (t) {
                    this.isDom || (this.isDom = !0, this.events.trigger("LPT", "DOM_READY",
                        {t: t}
                    )), this._timing[t] = (new Date()).getTime();
                },
                vars: window.lpTag.vars || [],
                dbs: window.lpTag.dbs || [],
                ctn: window.lpTag.ctn || [],
                sdes: window.lpTag.sdes || [],
                hooks: window.lpTag.hooks || [],
                ev: window.lpTag.ev || []
            }, window.lpTag.init()) : window.lpTag._tagCount += 1;
            break;
        }
        case !!(chat && chat.chatra && chat.chatraId): {
            (function (d, w, c) {
                w.ChatraID = chat.chatraId;
                let s = d.createElement('script');
                w[c] = w[c] || function () {
                    (w[c].q = w[c].q || []).push(arguments);
                };
                s.async = true;
                s.src = (d.location.protocol === 'https:' ? 'https:' : 'http:') +
                    '//call.chatra.io/chatra.js';
                if (d.head) d.head.appendChild(s);
            })(document, window, 'Chatra');
            window.openContactSupport = function () {
                window.Chatra.openChat();
            };
            // if (!chat.showNativeLiveChatButton) {
            //     let checkLiveChatButton = () => {
            //         if (window........) {
            //             // hide
            //             return;
            //         } else {
            //             setTimeout(function () {
            //                 checkLiveChatButton();
            //             }, 1500);
            //         }
            //     };
            //     !chat.showNativeLiveChatButton && checkLiveChatButton();
            // }
            break;
        }
        case !!(chat && chat.widget && chat.widget_id): {
            let widgetChat = () => {
                (function () {
                    function l () {
                        var s = document.createElement('script');
                        s.type = 'text/javascript';
                        s.async = true;
                        s.src = '//code.jivosite.com/script/widget/' + chat.widget_id;
                        var ss = document.getElementsByTagName('script')[0];
                        ss.parentNode.insertBefore(s, ss);
                    }
                    if (document.readyState === 'complete') {
                        l();
                    } else {
                        if (window.attachEvent) {
                            window.attachEvent('onload', l);
                        } else {
                            window.addEventListener('load', l, false);
                        }
                    }
                })();
            };
            setTimeout(function () {
                widgetChat();
            }, 2000);
            window.openContactSupport = function () {
                window.jivo_api.open();
            };
            if (!chat.showNativeLiveChatButton) {
                let checkLiveChatButton = () => {
                    var element = document.querySelector('.__jfakecls');
                    if (element) {
                        element.className = 'hide';
                        return;
                    } else {
                        setTimeout(function () {
                            checkLiveChatButton();
                        }, 1000);
                    }
                };
                !chat.showNativeLiveChatButton && checkLiveChatButton();
            }
            break;
        }
        case !!(chat && chat.chat2deskID): {
            let chat2deskWidgetRun = () => {
                window['cha' + 't2d' + 'e' + 'skID'] = chat.chat2deskID;
                window.domain = 'https://chat2desk.com';
                let sc = document.createElement('script');
                sc.type = 'text/javascript';
                sc.async = true;
                sc.src = window.domain + '/js/widget/new/dist/widget.min.js';

                let c = document['getElement' + 'sByTagNa' + 'me']('script')[0];
                if (c) {
                    return c['p' + 'arent' + 'Node']['inser' + 'tB' + 'efo' + 're'](sc, c);
                } else {
                    return document['docu' + 'me' + 'ntEle' + 'm' + 'ent']['f' + 'i' + 'r' + 's' + 'tChi' + 'ld']['appe' + 'nd' + 'C' + 'hild'](sc);
                }
            };
            window.chat2deskWidgetCanRun = true;
            if (window.chat2deskWidgetCanRun) {
                chat2deskWidgetRun();
            }
            break;
        }
        case !!(chat && chat.crisp): {
            window.$crisp = [];
            window.CRISP_WEBSITE_ID = chat.crisp_website_id;
            (function () {
                var d = document;
                var s = d.createElement("script");
                s.src = chat.src;
                s.async = 1;
                d.getElementsByTagName("head")[0].appendChild(s);
            })();
            window.openContactSupport = function () {
                window.$crisp.push(['do', 'chat:open']);
            };
            // if (!chat.showNativeLiveChatButton) {
            //     let checkLiveChatButton = () => {
            //         if (window.$crisp) {
            //             // ...
            //             return;
            //         } else {
            //             setTimeout(function () {
            //                 checkLiveChatButton();
            //             }, 1000);
            //         }
            //     };
            //     !chat.showNativeLiveChatButton && checkLiveChatButton();
            // }
            break;
        }
        case !!(chat && chat.zembed): {
            window.zEmbed || (function (e, t) {
                let n, o, d, i, s, a = [],
                    r = document.createElement("iframe");
                window.zEmbed = function () {
                    a.push(arguments);
                };
                window.zE = window.zE || window.zEmbed,
                    r.src = "javascript:false",
                    r.title = "",
                    r.role = "presentation",
                    (r.frameElement || r).style.cssText = "display: none",
                    d = document.getElementsByTagName("script"),
                    d = d[d.length - 1],
                    d.parentNode.insertBefore(r, d),
                    i = r.contentWindow,
                    s = i.document;
                try {
                    o = s;
                } catch (e) {
                    n = document.domain,
                        r.src = 'javascript:var d=document.open();d.domain="' + n + '";void(0);',
                        o = s;
                }
                o.open()._l = function () {
                    let e = this.createElement("script");
                    n && (this.domain = n),
                        e.id = "js-iframe-async",
                        e.src = 'https://assets.zendesk.com/embeddable_framework/main.js',
                        this.t = +new Date(), this.zendeskHost = chat.zendeskHost,
                        this.zEQueue = a, this.body.appendChild(e);
                };
                o.write('<body onload="document._l();">');
                o.close();
            }());
            window.openContactSupport = function () {
                window.zEmbed.activate();
            };
            // if (!chat.showNativeLiveChatButton) {
            //     let checkLiveChatButton = () => {
            //         if (window.zEmbed) {
            //             window.zEmbed.hide();
            //             return;
            //         } else {
            //             setTimeout(function () {
            //                 checkLiveChatButton();
            //             }, 1000);
            //         }
            //     };
            //     !chat.showNativeLiveChatButton && checkLiveChatButton();
            // }
            break;
        }
        case !!(chat && chat.onlyLink && chat.url): {
            window.openContactSupport = function () {
                window.open(chat.url, '_blank');
            };
            break;
        }
        case !!(chat && chat.olark): {
            (function (o, l, a, r, k, y) {
                if (o.olark) return;
                r = "script";
                y = l.createElement(r);
                r = l.getElementsByTagName(r)[0];
                y.async = 1;
                y.src = "//" + a;
                r.parentNode.insertBefore(y, r);
                y = o.olark = function () {
                    k.s.push(arguments);
                    k.t.push(+new Date());
                };
                y.extend = function (i, j) {
                    y("extend", i, j);
                };
                y.identify = function (i) {
                    y("identify", k.i = i);
                };
                y.configure = function (i, j) {
                    y("configure", i, j);
                    k.c[i] = j;
                };
                k = y._ = {
                    s: [],
                    t: [+new Date()],
                    c: {},
                    l: a
                };
            })(window, document, "static.olark.com/jsclient/loader.js");
            window.olark.identify(chat.olarkId);
            if (!chat.showNativeLiveChatButton) {
                let checkLiveChatButton = () => {
                    if (window.olark) {
                        window.olark('api.box.hide');
                        return;
                    } else {
                        setTimeout(function () {
                            checkLiveChatButton();
                        }, 1000);
                    }
                };
                !chat.showNativeLiveChatButton && checkLiveChatButton();
            }
            window.olark('api.box.onShrink', function () {
                !chat.showNativeLiveChatButton && window.olark('api.box.hide');
                return;
            });
            window.openContactSupport = function () {
                window.olark('api.box.expand');
            };
            break;
        }
        default: {
            chat = null;
        }
    }
}

class LiveChat extends Component {
    componentWillMount () {
        initLiveAgent(this.props.preferences);
    }
    componentWillReceiveProps (nextProps) {
        if (JSON.stringify(this.props.profile) !== JSON.stringify(nextProps.profile) && Config.main.storeUserProfileOnWindow) {
            setGlobalUserDetails(nextProps);
        }
        if (nextProps.profile && window.LiveAgent && window.LiveAgent.setUserDetails) {
            window.LiveAgent.setUserDetails(nextProps.profile.id || '', nextProps.profile.email || '', nextProps.profile.first_name || '', nextProps.profile.last_name || '', nextProps.profile.phone || nextProps.profile.phone_number || '');
        }
        if (nextProps.profile && Config.main.userProfileOnWindow) {
            window.aboutUserObj = nextProps.profile;
        }
    }
    render () {
        return (
            <div>
                <div id="livechat" />
                {
                    Config.main.liveChat && Config.main.liveChat.showFooterLiveChatButton
                        ? <div className="footerLivechatButton" onClick={window.openContactSupport} />
                        : null
                }
            </div>
        );
    }
}

LiveChat.propTypes = {
    profile: PropTypes.object,
    preferences: PropTypes.object
};

function mapStateToProps (state) {
    return {
        profile: GetProfile(state),
        preferences: state.preferences
    };
}

export default connect(mapStateToProps)(LiveChat);