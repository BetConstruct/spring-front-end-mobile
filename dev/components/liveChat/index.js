import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import Config from "../../config/main";
import {GetProfile} from "../../helpers/selectors";
import setGlobalUserDetails from "../../helpers/profile/setGlobalUserDetailsForLiveChat";

function initLiveAgent () {
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
                    liveAgentButton.onClick();
                    if (chat.liveAgentVersion === 2) {
                        document.getElementById(liveAgentButton.elementId).className += chat.showNativeLiveChatButton ? '' : ' hide ';
                    }
                    return instance && instance.closeOpenedWidget && instance.closeOpenedWidget();
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
                window.openContactSupport = function () {
                    $zopim.livechat.window.openPopout(); //eslint-disable-line no-undef
                };
            })(document, 'script');
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
            window.lpTag = window.lpTag || {};
            if (typeof window.lpTag._tagCount === 'undefined') {
                window.lpTag = {
                    site: chat.siteNumber || '',
                    section: window.lpTag.section || '',
                    autoStart: window.lpTag.autoStart !== false,
                    ovr: window.lpTag.ovr || {},
                    _v: '1.6.0',
                    _tagCount: 1,
                    protocol: 'https:',
                    events: {
                        bind: function (app, ev, fn) {
                            window.lpTag.defer(function () {
                                window.lpTag.events.bind(app, ev, fn);
                            }, 0);
                        },
                        trigger: function (app, ev, json) {
                            window.lpTag.defer(function () {
                                window.lpTag.events.trigger(app, ev, json);
                            }, 1);
                        }
                    },
                    defer: function (fn, fnType) {
                        if (fnType === 0) {
                            this._defB = this._defB || [];
                            this._defB.push(fn);
                        } else if (fnType === 1) {
                            this._defT = this._defT || [];
                            this._defT.push(fn);
                        } else {
                            this._defL = this._defL || [];
                            this._defL.push(fn);
                        }
                    },
                    load: function (src, chr, id) {
                        var t = this;
                        setTimeout(function () {
                            t._load(src, chr, id);
                        }, 0);
                    },
                    _load: function (src, chr, id) {
                        var url = src;
                        if (!src) {
                            url = this.protocol + '//' + ((this.ovr && this.ovr.domain) ? this.ovr.domain : chat.ovrDomain) + '/tag/tag.js?site=' + this.site;
                        }
                        var s = document.createElement('script');
                        s.setAttribute('charset', chr || 'UTF-8');
                        if (id) {
                            s.setAttribute('id', id);
                        }
                        s.setAttribute('src', url);
                        document.getElementsByTagName('head').item(0).appendChild(s);
                    },
                    init: function () {
                        this._timing = this._timing || {};
                        this._timing.start = (new Date()).getTime();
                        var that = this;
                        if (window.attachEvent) {
                            window.attachEvent('onload', function () {
                                that._domReady('domReady');
                            });
                        } else {
                            window.addEventListener('DOMContentLoaded', function () {
                                that._domReady('contReady');
                            }, false);
                            window.addEventListener('load', function () {
                                that._domReady('domReady');
                            }, false);
                        }
                        if (typeof (window._lptStop) === 'undefined') {
                            this.load();
                        }
                    },
                    start: function () {
                        this.autoStart = true;
                    },
                    _domReady: function (n) {
                        if (!this.isDom) {
                            this.isDom = true;
                            this.events.trigger('LPT', 'DOM_READY', {
                                t: n
                            });
                        }
                        this._timing[n] = (new Date()).getTime();
                    },
                    vars: window.lpTag.vars || [],
                    dbs: window.lpTag.dbs || [],
                    ctn: window.lpTag.ctn || [],
                    sdes: window.lpTag.sdes || [],
                    ev: window.lpTag.ev || []
                };
                window.lpTag.init();
                // window.openContactSupport = function () {
                // };
            } else {
                window.lpTag._tagCount += 1;
            }
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
        default: {
            chat = null;
        }
    }
}

const LiveChat = React.createClass({
    propTypes: {
        profile: PropTypes.object
    },
    componentWillMount () {
        initLiveAgent();
    },
    componentWillReceiveProps (nextProps) {
        Config.main.storeUserProfileOnWindow && setGlobalUserDetails(nextProps);
        if (nextProps.profile && window.LiveAgent && window.LiveAgent.setUserDetails) {
            window.LiveAgent.setUserDetails(nextProps.profile.id || '', nextProps.profile.email || '', nextProps.profile.first_name || '', nextProps.profile.last_name || '', nextProps.profile.phone || nextProps.profile.phone_number || '');
        }
    },
    render () {
        return <div id="livechat"></div>;
    }
});
function mapStateToProps (state) {
    return {
        profile: GetProfile(state)
    };
}
export default connect(mapStateToProps)(LiveChat);