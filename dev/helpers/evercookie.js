import Config from "../config/main";
import Fingerprint2 from "fingerprintjs2";

let ecValue, fingerPrint;

export const init = (props) => {
    if (!Config.everCookie.enabled) {
        return;
    }
    console.log("EC init ", props, Config.everCookie);

    let ec = new Evercookie(Config.everCookie.options);

    new Fingerprint2().get(function(fp, _components){
        fingerPrint = fp;
        ec.get("afec", function (value) {
            if (value) {
                ecValue = value;
            } else {
                ecValue = generateCookie();
                ec.set("afec", ecValue);
            }
            log(props);
        });
    });
};

export const log = (props, prevLocation) => {
    if (!Config.everCookie.enabled) {
        return;
    }
    console.log("EC log", props, prevLocation);

    try {
        let cookieObj = JSON.parse(atob(ecValue));
        let msg = {
            partnerId: Config.main.site_id,
            url: window.location.href,
            source: Config.main.source,
            sessionToken: (props.user && props.user.authData && props.user.authData.auth_token) || "",
            sessionStart: 0,
            cookieId: cookieObj.id,
            cookieTs: cookieObj.ts,
            referer: (prevLocation && prevLocation.pathname) || document.referrer,
            clientId: (props.user && props.user.authData && props.user.authData.user_id) || 0,
            fingerprint: fingerPrint || ""
        };
        let kafkaMsg = getMessageJson(msg);
        console.log("EC kafka:", kafkaMsg);
        postToKafka(kafkaMsg);
    } catch (err) {
        console.error(err);
    }
};

function generateCookie () {
    function randHex (length) {
        var id = [];
        for (var i = 0; i < length * 2; i++) {
            id[i] = Math.random() * 16 | 0;
        }
        return id.map(function (v) {
            return v.toString(16);
        }).join('');
    }

    return btoa(JSON.stringify({
        "id": randHex(16),
        "ts": +new Date()
    }));
}

function postToKafka (msg) {
    fetch(Config.everCookie.afecUrl, {
        method: 'post',
        headers: {
            "Content-Type": "application/vnd.kafka.avro.v2+json",
            "Accept": "application/vnd.kafka.v2+json"
        },
        body: JSON.stringify(msg)
    })
    .then(function (response) {
        console.log("EC post response", response);
    });
}

function getMessageJson (data) {
    return {
        "key_schema": JSON.stringify({
            "name": "cookieId",
            "type": "string"
        }),
        "value_schema": JSON.stringify({
            "type": "record",
            "name": "ClientActivity",
            "namespace": "com.betconstruct.antifraud.avro",
            "fields": [
                {
                    "name": "partnerId",
                    "type": "int"
                },
                {
                    "name": "url",
                    "type": "string"
                },
                {
                    "name": "source",
                    "type": "int"
                },
                {
                    "name": "sessionToken",
                    "type": "string"
                },
                {
                    "name": "sessionStart",
                    "type": "long"
                },
                {
                    "name": "fingerprint",
                    "type": "string"
                },
                {
                    "name": "cookieId",
                    "type": "string"
                },
                {
                    "name": "cookieTs",
                    "type": "long"
                },
                {
                    "name": "referrer",
                    "type": "string"
                },
                {
                    "name": "clientId",
                    "type": "int"
                },
                {
                    "name": "data",
                    "type": {
                        "type": "map",
                        "values": "string"
                    }
                }
            ]
        }),
        "records": [{
            "key": data.cookieId,
            "value": {
                "partnerId": data.partnerId,
                "url": data.url,
                "source": data.source,
                "sessionToken": data.sessionToken,
                "sessionStart": data.sessionStart,
                "fingerprint": data.fingerprint,
                "cookieId": data.cookieId,
                "cookieTs": data.cookieTs,
                "referrer": data.referer,
                "clientId": data.clientId,
                "data": {}
            }
        }]
    };
}

// TODO: move these to separate files

// swfobject required by evercookie
window.swfobject = function () {

    var UNDEF = "undefined",
        OBJECT = "object",
        SHOCKWAVE_FLASH = "Shockwave Flash",
        SHOCKWAVE_FLASH_AX = "ShockwaveFlash.ShockwaveFlash",
        FLASH_MIME_TYPE = "application/x-shockwave-flash",
        EXPRESS_INSTALL_ID = "SWFObjectExprInst",
        ON_READY_STATE_CHANGE = "onreadystatechange",

        win = window,
        doc = document,
        nav = navigator,

        plugin = false,
        domLoadFnArr = [],
        regObjArr = [],
        objIdArr = [],
        listenersArr = [],
        storedFbContent,
        storedFbContentId,
        storedCallbackFn,
        storedCallbackObj,
        isDomLoaded = false,
        isExpressInstallActive = false,
        dynamicStylesheet,
        dynamicStylesheetMedia,
        autoHideShow = true,
        encodeURIEnabled = false,

        /* Centralized function for browser feature detection
         - User agent string detection is only used when no good alternative is possible
         - Is executed directly for optimal performance
         */
        ua = function () {
            var w3cdom = typeof doc.getElementById !== UNDEF && typeof doc.getElementsByTagName !== UNDEF && typeof doc.createElement !== UNDEF,
                u = nav.userAgent.toLowerCase(),
                p = nav.platform.toLowerCase(),
                windows = p ? /win/.test(p) : /win/.test(u),
                mac = p ? /mac/.test(p) : /mac/.test(u),
                webkit = /webkit/.test(u) ? parseFloat(u.replace(/^.*webkit\/(\d+(\.\d+)?).*$/, "$1")) : false, // returns either the webkit version or false if not webkit
                ie = nav.appName === "Microsoft Internet Explorer",
                playerVersion = [0, 0, 0],
                d = null;
            if (typeof nav.plugins !== UNDEF && typeof nav.plugins[SHOCKWAVE_FLASH] === OBJECT) {
                d = nav.plugins[SHOCKWAVE_FLASH].description;
                // nav.mimeTypes["application/x-shockwave-flash"].enabledPlugin indicates whether plug-ins are enabled or disabled in Safari 3+
                if (d && (typeof nav.mimeTypes !== UNDEF && nav.mimeTypes[FLASH_MIME_TYPE] && nav.mimeTypes[FLASH_MIME_TYPE].enabledPlugin)) {
                    plugin = true;
                    ie = false; // cascaded feature detection for Internet Explorer
                    d = d.replace(/^.*\s+(\S+\s+\S+$)/, "$1");
                    playerVersion[0] = toInt(d.replace(/^(.*)\..*$/, "$1"));
                    playerVersion[1] = toInt(d.replace(/^.*\.(.*)\s.*$/, "$1"));
                    playerVersion[2] = /[a-zA-Z]/.test(d) ? toInt(d.replace(/^.*[a-zA-Z]+(.*)$/, "$1")) : 0;
                }
            }
            else if (typeof win.ActiveXObject !== UNDEF) {
                try {
                    var a = new ActiveXObject(SHOCKWAVE_FLASH_AX);
                    if (a) { // a will return null when ActiveX is disabled
                        d = a.GetVariable("$version");
                        if (d) {
                            ie = true; // cascaded feature detection for Internet Explorer
                            d = d.split(" ")[1].split(",");
                            playerVersion = [toInt(d[0]), toInt(d[1]), toInt(d[2])];
                        }
                    }
                }
                catch (e) {}
            }
            return {w3: w3cdom, pv: playerVersion, wk: webkit, ie: ie, win: windows, mac: mac};
        }(),

        /* Cross-browser onDomLoad
         - Will fire an event as soon as the DOM of a web page is loaded
         - Internet Explorer workaround based on Diego Perini's solution: http://javascript.nwbox.com/IEContentLoaded/
         - Regular onload serves as fallback
         */
        onDomLoad = function () {
            if (!ua.w3) { return; }
            if ((typeof doc.readyState !== UNDEF && (doc.readyState === "complete" || doc.readyState === "interactive")) || (typeof doc.readyState === UNDEF && (doc.getElementsByTagName("body")[0] || doc.body))) { // function is fired after onload, e.g. when script is inserted dynamically
                callDomLoadFunctions();
            }
            if (!isDomLoaded) {
                if (typeof doc.addEventListener !== UNDEF) {
                    doc.addEventListener("DOMContentLoaded", callDomLoadFunctions, false);
                }
                if (ua.ie) {
                    doc.attachEvent(ON_READY_STATE_CHANGE, function detach() {
                        if (doc.readyState === "complete") {
                            doc.detachEvent(ON_READY_STATE_CHANGE, detach);
                            callDomLoadFunctions();
                        }
                    });
                    if (win == top) { // if not inside an iframe
                        (function checkDomLoadedIE() {
                            if (isDomLoaded) { return; }
                            try {
                                doc.documentElement.doScroll("left");
                            }
                            catch (e) {
                                setTimeout(checkDomLoadedIE, 0);
                                return;
                            }
                            callDomLoadFunctions();
                        }());
                    }
                }
                if (ua.wk) {
                    (function checkDomLoadedWK() {
                        if (isDomLoaded) { return; }
                        if (!/loaded|complete/.test(doc.readyState)) {
                            setTimeout(checkDomLoadedWK, 0);
                            return;
                        }
                        callDomLoadFunctions();
                    }());
                }
            }
        }();

    function callDomLoadFunctions() {
        if (isDomLoaded || !document.getElementsByTagName("body")[0]) { return; }
        try { // test if we can really add/remove elements to/from the DOM; we don't want to fire it too early
            var t, span = createElement("span");
            span.style.display = "none"; //hide the span in case someone has styled spans via CSS
            t = doc.getElementsByTagName("body")[0].appendChild(span);
            t.parentNode.removeChild(t);
            t = null; //clear the variables
            span = null;
        }
        catch (e) { return; }
        isDomLoaded = true;
        var dl = domLoadFnArr.length;
        for (var i = 0; i < dl; i++) {
            domLoadFnArr[i]();
        }
    }

    function addDomLoadEvent(fn) {
        if (isDomLoaded) {
            fn();
        }
        else {
            domLoadFnArr[domLoadFnArr.length] = fn; // Array.push() is only available in IE5.5+
        }
    }

    /* Cross-browser onload
     - Based on James Edwards' solution: http://brothercake.com/site/resources/scripts/onload/
     - Will fire an event as soon as a web page including all of its assets are loaded
     */
    function addLoadEvent(fn) {
        if (typeof win.addEventListener !== UNDEF) {
            win.addEventListener("load", fn, false);
        }
        else if (typeof doc.addEventListener !== UNDEF) {
            doc.addEventListener("load", fn, false);
        }
        else if (typeof win.attachEvent !== UNDEF) {
            addListener(win, "onload", fn);
        }
        else if (typeof win.onload === "function") {
            var fnOld = win.onload;
            win.onload = function () {
                fnOld();
                fn();
            };
        }
        else {
            win.onload = fn;
        }
    }

    /* Detect the Flash Player version for non-Internet Explorer browsers
     - Detecting the plug-in version via the object element is more precise than using the plugins collection item's description:
     a. Both release and build numbers can be detected
     b. Avoid wrong descriptions by corrupt installers provided by Adobe
     c. Avoid wrong descriptions by multiple Flash Player entries in the plugin Array, caused by incorrect browser imports
     - Disadvantage of this method is that it depends on the availability of the DOM, while the plugins collection is immediately available
     */
    function testPlayerVersion() {
        var b = doc.getElementsByTagName("body")[0];
        var o = createElement(OBJECT);
        o.setAttribute("style", "visibility: hidden;");
        o.setAttribute("type", FLASH_MIME_TYPE);
        var t = b.appendChild(o);
        if (t) {
            var counter = 0;
            (function checkGetVariable() {
                if (typeof t.GetVariable !== UNDEF) {
                    try {
                        var d = t.GetVariable("$version");
                        if (d) {
                            d = d.split(" ")[1].split(",");
                            ua.pv = [toInt(d[0]), toInt(d[1]), toInt(d[2])];
                        }
                    } catch (e) {
                        //t.GetVariable("$version") is known to fail in Flash Player 8 on Firefox
                        //If this error is encountered, assume FP8 or lower. Time to upgrade.
                        ua.pv = [8, 0, 0];
                    }
                }
                else if (counter < 10) {
                    counter++;
                    setTimeout(checkGetVariable, 10);
                    return;
                }
                b.removeChild(o);
                t = null;
                matchVersions();
            }());
        }
        else {
            matchVersions();
        }
    }

    /* Perform Flash Player and SWF version matching; static publishing only
     */
    function matchVersions() {
        var rl = regObjArr.length;
        if (rl > 0) {
            for (var i = 0; i < rl; i++) { // for each registered object element
                var id = regObjArr[i].id;
                var cb = regObjArr[i].callbackFn;
                var cbObj = {success: false, id: id};
                if (ua.pv[0] > 0) {
                    var obj = getElementById(id);
                    if (obj) {
                        if (hasPlayerVersion(regObjArr[i].swfVersion) && !(ua.wk && ua.wk < 312)) { // Flash Player version >= published SWF version: Houston, we have a match!
                            setVisibility(id, true);
                            if (cb) {
                                cbObj.success = true;
                                cbObj.ref = getObjectById(id);
                                cbObj.id = id;
                                cb(cbObj);
                            }
                        }
                        else if (regObjArr[i].expressInstall && canExpressInstall()) { // show the Adobe Express Install dialog if set by the web page author and if supported
                            var att = {};
                            att.data = regObjArr[i].expressInstall;
                            att.width = obj.getAttribute("width") || "0";
                            att.height = obj.getAttribute("height") || "0";
                            if (obj.getAttribute("class")) { att.styleclass = obj.getAttribute("class"); }
                            if (obj.getAttribute("align")) { att.align = obj.getAttribute("align"); }
                            // parse HTML object param element's name-value pairs
                            var par = {};
                            var p = obj.getElementsByTagName("param");
                            var pl = p.length;
                            for (var j = 0; j < pl; j++) {
                                if (p[j].getAttribute("name").toLowerCase() !== "movie") {
                                    par[p[j].getAttribute("name")] = p[j].getAttribute("value");
                                }
                            }
                            showExpressInstall(att, par, id, cb);
                        }
                        else { // Flash Player and SWF version mismatch or an older Webkit engine that ignores the HTML object element's nested param elements: display fallback content instead of SWF
                            displayFbContent(obj);
                            if (cb) { cb(cbObj); }
                        }
                    }
                }
                else { // if no Flash Player is installed or the fp version cannot be detected we let the HTML object element do its job (either show a SWF or fallback content)
                    setVisibility(id, true);
                    if (cb) {
                        var o = getObjectById(id); // test whether there is an HTML object element or not
                        if (o && typeof o.SetVariable !== UNDEF) {
                            cbObj.success = true;
                            cbObj.ref = o;
                            cbObj.id = o.id;
                        }
                        cb(cbObj);
                    }
                }
            }
        }
    }

    /* Main function
     - Will preferably execute onDomLoad, otherwise onload (as a fallback)
     */
    domLoadFnArr[0] = function () {
        if (plugin) {
            testPlayerVersion();
        }
        else {
            matchVersions();
        }
    };

    function getObjectById(objectIdStr) {
        var r = null,
            o = getElementById(objectIdStr);

        if (o && o.nodeName.toUpperCase() === "OBJECT") {
            //If targeted object is valid Flash file
            if (typeof o.SetVariable !== UNDEF) {
                r = o;
            } else {
                //If SetVariable is not working on targeted object but a nested object is
                //available, assume classic nested object markup. Return nested object.

                //If SetVariable is not working on targeted object and there is no nested object,
                //return the original object anyway. This is probably new simplified markup.

                r = o.getElementsByTagName(OBJECT)[0] || o;
            }
        }

        return r;
    }

    /* Requirements for Adobe Express Install
     - only one instance can be active at a time
     - fp 6.0.65 or higher
     - Win/Mac OS only
     - no Webkit engines older than version 312
     */
    function canExpressInstall() {
        return !isExpressInstallActive && hasPlayerVersion("6.0.65") && (ua.win || ua.mac) && !(ua.wk && ua.wk < 312);
    }

    /* Show the Adobe Express Install dialog
     - Reference: http://www.adobe.com/cfusion/knowledgebase/index.cfm?id=6a253b75
     */
    function showExpressInstall(att, par, replaceElemIdStr, callbackFn) {

        var obj = getElementById(replaceElemIdStr);

        //Ensure that replaceElemIdStr is really a string and not an element
        replaceElemIdStr = getId(replaceElemIdStr);

        isExpressInstallActive = true;
        storedCallbackFn = callbackFn || null;
        storedCallbackObj = {success: false, id: replaceElemIdStr};

        if (obj) {
            if (obj.nodeName.toUpperCase() === "OBJECT") { // static publishing
                storedFbContent = abstractFbContent(obj);
                storedFbContentId = null;
            }
            else { // dynamic publishing
                storedFbContent = obj;
                storedFbContentId = replaceElemIdStr;
            }
            att.id = EXPRESS_INSTALL_ID;
            if (typeof att.width === UNDEF || (!/%$/.test(att.width) && toInt(att.width) < 310)) { att.width = "310"; }
            if (typeof att.height === UNDEF || (!/%$/.test(att.height) && toInt(att.height) < 137)) { att.height = "137"; }
            var pt = ua.ie ? "ActiveX" : "PlugIn",
                fv = "MMredirectURL=" + encodeURIComponent(win.location.toString().replace(/&/g, "%26")) + "&MMplayerType=" + pt + "&MMdoctitle=" + encodeURIComponent(doc.title.slice(0, 47) + " - Flash Player Installation");
            if (typeof par.flashvars !== UNDEF) {
                par.flashvars += "&" + fv;
            }
            else {
                par.flashvars = fv;
            }
            // IE only: when a SWF is loading (AND: not available in cache) wait for the readyState of the object element to become 4 before removing it,
            // because you cannot properly cancel a loading SWF file without breaking browser load references, also obj.onreadystatechange doesn't work
            if (ua.ie && obj.readyState != 4) {
                var newObj = createElement("div");
                replaceElemIdStr += "SWFObjectNew";
                newObj.setAttribute("id", replaceElemIdStr);
                obj.parentNode.insertBefore(newObj, obj); // insert placeholder div that will be replaced by the object element that loads expressinstall.swf
                obj.style.display = "none";
                removeSWF(obj); //removeSWF accepts elements now
            }
            createSWF(att, par, replaceElemIdStr);
        }
    }

    /* Functions to abstract and display fallback content
     */
    function displayFbContent(obj) {
        if (ua.ie && obj.readyState != 4) {
            // IE only: when a SWF is loading (AND: not available in cache) wait for the readyState of the object element to become 4 before removing it,
            // because you cannot properly cancel a loading SWF file without breaking browser load references, also obj.onreadystatechange doesn't work
            obj.style.display = "none";
            var el = createElement("div");
            obj.parentNode.insertBefore(el, obj); // insert placeholder div that will be replaced by the fallback content
            el.parentNode.replaceChild(abstractFbContent(obj), el);
            removeSWF(obj); //removeSWF accepts elements now
        }
        else {
            obj.parentNode.replaceChild(abstractFbContent(obj), obj);
        }
    }

    function abstractFbContent(obj) {
        var ac = createElement("div");
        if (ua.win && ua.ie) {
            ac.innerHTML = obj.innerHTML;
        }
        else {
            var nestedObj = obj.getElementsByTagName(OBJECT)[0];
            if (nestedObj) {
                var c = nestedObj.childNodes;
                if (c) {
                    var cl = c.length;
                    for (var i = 0; i < cl; i++) {
                        if (!(c[i].nodeType == 1 && c[i].nodeName === "PARAM") && !(c[i].nodeType == 8)) {
                            ac.appendChild(c[i].cloneNode(true));
                        }
                    }
                }
            }
        }
        return ac;
    }

    function createIeObject(url, paramStr) {
        var div = createElement("div");
        div.innerHTML = "<object classid='clsid:D27CDB6E-AE6D-11cf-96B8-444553540000'><param name='movie' value='" + url + "'>" + paramStr + "</object>";
        return div.firstChild;
    }

    /* Cross-browser dynamic SWF creation
     */
    function createSWF(attObj, parObj, id) {
        var r, el = getElementById(id);
        id = getId(id); // ensure id is truly an ID and not an element

        if (ua.wk && ua.wk < 312) { return r; }

        if (el) {
            var o = (ua.ie) ? createElement("div") : createElement(OBJECT),
                attr,
                attrLower,
                param;

            if (typeof attObj.id === UNDEF) { // if no 'id' is defined for the object element, it will inherit the 'id' from the fallback content
                attObj.id = id;
            }

            //Add params
            for (param in parObj) {
                //filter out prototype additions from other potential libraries and IE specific param element
                if (parObj.hasOwnProperty(param) && param.toLowerCase() !== "movie") {
                    createObjParam(o, param, parObj[param]);
                }
            }

            //Create IE object, complete with param nodes
            if (ua.ie) { o = createIeObject(attObj.data, o.innerHTML); }

            //Add attributes to object
            for (attr in attObj) {
                if (attObj.hasOwnProperty(attr)) { // filter out prototype additions from other potential libraries
                    attrLower = attr.toLowerCase();

                    // 'class' is an ECMA4 reserved keyword
                    if (attrLower === "styleclass") {
                        o.setAttribute("class", attObj[attr]);
                    } else if (attrLower !== "classid" && attrLower !== "data") {
                        o.setAttribute(attr, attObj[attr]);
                    }
                }
            }

            if (ua.ie) {
                objIdArr[objIdArr.length] = attObj.id; // stored to fix object 'leaks' on unload (dynamic publishing only)
            } else {
                o.setAttribute("type", FLASH_MIME_TYPE);
                o.setAttribute("data", attObj.data);
            }

            el.parentNode.replaceChild(o, el);
            r = o;
        }

        return r;
    }

    function createObjParam(el, pName, pValue) {
        var p = createElement("param");
        p.setAttribute("name", pName);
        p.setAttribute("value", pValue);
        el.appendChild(p);
    }

    /* Cross-browser SWF removal
     - Especially needed to safely and completely remove a SWF in Internet Explorer
     */
    function removeSWF(id) {
        var obj = getElementById(id);
        if (obj && obj.nodeName.toUpperCase() === "OBJECT") {
            if (ua.ie) {
                obj.style.display = "none";
                (function removeSWFInIE() {
                    if (obj.readyState == 4) {
                        //This step prevents memory leaks in Internet Explorer
                        for (var i in obj) {
                            if (typeof obj[i] === "function") {
                                obj[i] = null;
                            }
                        }
                        obj.parentNode.removeChild(obj);
                    } else {
                        setTimeout(removeSWFInIE, 10);
                    }
                }());
            }
            else {
                obj.parentNode.removeChild(obj);
            }
        }
    }

    function isElement(id) {
        return (id && id.nodeType && id.nodeType === 1);
    }

    function getId(thing) {
        return (isElement(thing)) ? thing.id : thing;
    }

    /* Functions to optimize JavaScript compression
     */
    function getElementById(id) {

        //Allow users to pass an element OR an element's ID
        if (isElement(id)) { return id; }

        var el = null;
        try {
            el = doc.getElementById(id);
        }
        catch (e) {}
        return el;
    }

    function createElement(el) {
        return doc.createElement(el);
    }

    //To aid compression; replaces 14 instances of pareseInt with radix
    function toInt(str) {
        return parseInt(str, 10);
    }

    /* Updated attachEvent function for Internet Explorer
     - Stores attachEvent information in an Array, so on unload the detachEvent functions can be called to avoid memory leaks
     */
    function addListener(target, eventType, fn) {
        target.attachEvent(eventType, fn);
        listenersArr[listenersArr.length] = [target, eventType, fn];
    }

    /* Flash Player and SWF content version matching
     */
    function hasPlayerVersion(rv) {
        rv += ""; //Coerce number to string, if needed.
        var pv = ua.pv, v = rv.split(".");
        v[0] = toInt(v[0]);
        v[1] = toInt(v[1]) || 0; // supports short notation, e.g. "9" instead of "9.0.0"
        v[2] = toInt(v[2]) || 0;
        return (pv[0] > v[0] || (pv[0] == v[0] && pv[1] > v[1]) || (pv[0] == v[0] && pv[1] == v[1] && pv[2] >= v[2])) ? true : false;
    }

    /* Cross-browser dynamic CSS creation
     - Based on Bobby van der Sluis' solution: http://www.bobbyvandersluis.com/articles/dynamicCSS.php
     */
    function createCSS(sel, decl, media, newStyle) {
        var h = doc.getElementsByTagName("head")[0];
        if (!h) { return; } // to also support badly authored HTML pages that lack a head element
        var m = (typeof media === "string") ? media : "screen";
        if (newStyle) {
            dynamicStylesheet = null;
            dynamicStylesheetMedia = null;
        }
        if (!dynamicStylesheet || dynamicStylesheetMedia != m) {
            // create dynamic stylesheet + get a global reference to it
            var s = createElement("style");
            s.setAttribute("type", "text/css");
            s.setAttribute("media", m);
            dynamicStylesheet = h.appendChild(s);
            if (ua.ie && typeof doc.styleSheets !== UNDEF && doc.styleSheets.length > 0) {
                dynamicStylesheet = doc.styleSheets[doc.styleSheets.length - 1];
            }
            dynamicStylesheetMedia = m;
        }
        // add style rule
        if (dynamicStylesheet) {
            if (typeof dynamicStylesheet.addRule !== UNDEF) {
                dynamicStylesheet.addRule(sel, decl);
            } else if (typeof doc.createTextNode !== UNDEF) {
                dynamicStylesheet.appendChild(doc.createTextNode(sel + " {" + decl + "}"));
            }
        }
    }

    function setVisibility(id, isVisible) {
        if (!autoHideShow) { return; }
        var v = isVisible ? "visible" : "hidden",
            el = getElementById(id);
        if (isDomLoaded && el) {
            el.style.visibility = v;
        } else if (typeof id === "string") {
            createCSS("#" + id, "visibility:" + v);
        }
    }

    /* Filter to avoid XSS attacks
     */
    function urlEncodeIfNecessary(s) {
        var regex = /[\\\"<>\.;]/;
        var hasBadChars = regex.exec(s) !== null;
        return hasBadChars && typeof encodeURIComponent !== UNDEF ? encodeURIComponent(s) : s;
    }

    /* Release memory to avoid memory leaks caused by closures, fix hanging audio/video threads and force open sockets/NetConnections to disconnect (Internet Explorer only)
     */
    var cleanup = function () {
        if (ua.ie) {
            window.attachEvent("onunload", function () {
                // remove listeners to avoid memory leaks
                var ll = listenersArr.length;
                for (var i = 0; i < ll; i++) {
                    listenersArr[i][0].detachEvent(listenersArr[i][1], listenersArr[i][2]);
                }
                // cleanup dynamically embedded objects to fix audio/video threads and force open sockets and NetConnections to disconnect
                var il = objIdArr.length;
                for (var j = 0; j < il; j++) {
                    removeSWF(objIdArr[j]);
                }
                // cleanup library's main closures to avoid memory leaks
                for (var k in ua) {
                    ua[k] = null;
                }
                ua = null;
                for (var l in swfobject) {
                    swfobject[l] = null;
                }
                swfobject = null;
            });
        }
    }();

    return {
        /* Public API
         - Reference: http://code.google.com/p/swfobject/wiki/documentation
         */
        registerObject: function (objectIdStr, swfVersionStr, xiSwfUrlStr, callbackFn) {
            if (ua.w3 && objectIdStr && swfVersionStr) {
                var regObj = {};
                regObj.id = objectIdStr;
                regObj.swfVersion = swfVersionStr;
                regObj.expressInstall = xiSwfUrlStr;
                regObj.callbackFn = callbackFn;
                regObjArr[regObjArr.length] = regObj;
                setVisibility(objectIdStr, false);
            }
            else if (callbackFn) {
                callbackFn({success: false, id: objectIdStr});
            }
        },

        getObjectById: function (objectIdStr) {
            if (ua.w3) {
                return getObjectById(objectIdStr);
            }
        },

        embedSWF: function (swfUrlStr, replaceElemIdStr, widthStr, heightStr, swfVersionStr, xiSwfUrlStr, flashvarsObj, parObj, attObj, callbackFn) {

            var id = getId(replaceElemIdStr),
                callbackObj = {success: false, id: id};

            if (ua.w3 && !(ua.wk && ua.wk < 312) && swfUrlStr && replaceElemIdStr && widthStr && heightStr && swfVersionStr) {
                setVisibility(id, false);
                addDomLoadEvent(function () {
                    widthStr += ""; // auto-convert to string
                    heightStr += "";
                    var att = {};
                    if (attObj && typeof attObj === OBJECT) {
                        for (var i in attObj) { // copy object to avoid the use of references, because web authors often reuse attObj for multiple SWFs
                            att[i] = attObj[i];
                        }
                    }
                    att.data = swfUrlStr;
                    att.width = widthStr;
                    att.height = heightStr;
                    var par = {};
                    if (parObj && typeof parObj === OBJECT) {
                        for (var j in parObj) { // copy object to avoid the use of references, because web authors often reuse parObj for multiple SWFs
                            par[j] = parObj[j];
                        }
                    }
                    if (flashvarsObj && typeof flashvarsObj === OBJECT) {
                        for (var k in flashvarsObj) { // copy object to avoid the use of references, because web authors often reuse flashvarsObj for multiple SWFs
                            if (flashvarsObj.hasOwnProperty(k)) {

                                var key = (encodeURIEnabled) ? encodeURIComponent(k) : k,
                                    value = (encodeURIEnabled) ? encodeURIComponent(flashvarsObj[k]) : flashvarsObj[k];

                                if (typeof par.flashvars !== UNDEF) {
                                    par.flashvars += "&" + key + "=" + value;
                                }
                                else {
                                    par.flashvars = key + "=" + value;
                                }

                            }
                        }
                    }
                    if (hasPlayerVersion(swfVersionStr)) { // create SWF
                        var obj = createSWF(att, par, replaceElemIdStr);
                        if (att.id == id) {
                            setVisibility(id, true);
                        }
                        callbackObj.success = true;
                        callbackObj.ref = obj;
                        callbackObj.id = obj.id;
                    }
                    else if (xiSwfUrlStr && canExpressInstall()) { // show Adobe Express Install
                        att.data = xiSwfUrlStr;
                        showExpressInstall(att, par, replaceElemIdStr, callbackFn);
                        return;
                    }
                    else { // show fallback content
                        setVisibility(id, true);
                    }
                    if (callbackFn) { callbackFn(callbackObj); }
                });
            }
            else if (callbackFn) { callbackFn(callbackObj); }
        },

        switchOffAutoHideShow: function () {
            autoHideShow = false;
        },

        enableUriEncoding: function (bool) {
            encodeURIEnabled = (typeof bool === UNDEF) ? true : bool;
        },

        ua: ua,

        getFlashPlayerVersion: function () {
            return {major: ua.pv[0], minor: ua.pv[1], release: ua.pv[2]};
        },

        hasFlashPlayerVersion: hasPlayerVersion,

        createSWF: function (attObj, parObj, replaceElemIdStr) {
            if (ua.w3) {
                return createSWF(attObj, parObj, replaceElemIdStr);
            }
            else {
                return undefined;
            }
        },

        showExpressInstall: function (att, par, replaceElemIdStr, callbackFn) {
            if (ua.w3 && canExpressInstall()) {
                showExpressInstall(att, par, replaceElemIdStr, callbackFn);
            }
        },

        removeSWF: function (objElemIdStr) {
            if (ua.w3) {
                removeSWF(objElemIdStr);
            }
        },

        createCSS: function (selStr, declStr, mediaStr, newStyleBoolean) {
            if (ua.w3) {
                createCSS(selStr, declStr, mediaStr, newStyleBoolean);
            }
        },

        addDomLoadEvent: addDomLoadEvent,

        addLoadEvent: addLoadEvent,

        getQueryParamValue: function (param) {
            var q = doc.location.search || doc.location.hash;
            if (q) {
                if (/\?/.test(q)) { q = q.split("?")[1]; } // strip question mark
                if (!param) {
                    return urlEncodeIfNecessary(q);
                }
                var pairs = q.split("&");
                for (var i = 0; i < pairs.length; i++) {
                    if (pairs[i].substring(0, pairs[i].indexOf("=")) == param) {
                        return urlEncodeIfNecessary(pairs[i].substring((pairs[i].indexOf("=") + 1)));
                    }
                }
            }
            return "";
        },

        // For internal usage only
        expressInstallCallback: function () {
            if (isExpressInstallActive) {
                var obj = getElementById(EXPRESS_INSTALL_ID);
                if (obj && storedFbContent) {
                    obj.parentNode.replaceChild(storedFbContent, obj);
                    if (storedFbContentId) {
                        setVisibility(storedFbContentId, true);
                        if (ua.ie) { storedFbContent.style.display = "block"; }
                    }
                    if (storedCallbackFn) { storedCallbackFn(storedCallbackObj); }
                }
                isExpressInstallActive = false;
            }
        },

        version: "2.3"

    };
}();

//EverCookie - no npm package available
try {
    (function (window) {
        'use strict';
        var document = window.document,
            Image = window.Image,
            globalStorage = window.globalStorage,
            swfobject = window.swfobject;

        try{
            var localStore = window.localStorage
        }catch(ex){}

        try {
            var sessionStorage = window.sessionStorage;
        } catch (e) { }

        function newImage(src) {
            var img = new Image();
            img.style.visibility = "hidden";
            img.style.position = "absolute";
            img.src = src;
        }
        function _ec_replace(str, key, value) {
            if (str.indexOf("&" + key + "=") > -1 || str.indexOf(key + "=") === 0) {
                // find start
                var idx = str.indexOf("&" + key + "="),
                    end, newstr;
                if (idx === -1) {
                    idx = str.indexOf(key + "=");
                }
                // find end
                end = str.indexOf("&", idx + 1);
                if (end !== -1) {
                    newstr = str.substr(0, idx) + str.substr(end + (idx ? 0 : 1)) + "&" + key + "=" + value;
                } else {
                    newstr = str.substr(0, idx) + "&" + key + "=" + value;
                }
                return newstr;
            } else {
                return str + "&" + key + "=" + value;
            }
        }

        function idb() {
            if ('indexedDB' in window) {
                return true
            } else if (window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB) {
                return true
            } else {
                return false
            }
        }

        // necessary for flash to communicate with js...
        // please implement a better way
        var _global_lso;
        function _evercookie_flash_var(cookie) {
            _global_lso = cookie;

            // remove the flash object now
            var swf = document.getElementById("myswf");
            if (swf && swf.parentNode) {
                swf.parentNode.removeChild(swf);
            }
        }

        /*
         * Again, ugly workaround....same problem as flash.
         */
        var _global_isolated;
        function onSilverlightLoad(sender, args) {
            var control = sender.getHost();
            _global_isolated = control.Content.App.getIsolatedStorage();
        }

        function onSilverlightError(sender, args) {
            _global_isolated = "";
        }


        // hsts-cookie "lib"
        function HSTS_Cookie(domains){
            var fields = [];
            var remaining = 0;
            var working = false;

            function create_request(i, src, callback){
                var img = document.createElement('img');
                img.src = src + '#' + parseInt(Math.random()*32000); // prevent caching
                img.onload = function(){
                    fields[i] = true;
                    remaining -= 1;
                    if(remaining <= 0){
                        working = false;
                        callback(fields);
                    }
                };
                img.onerror = function(){
                    fields[i] = false;
                    remaining -= 1;
                    if(remaining <= 0){
                        working = false;
                        callback(fields);
                    }
                };
                return img;
            }
            function pad(value, length) {
                return (value.toString().length < length) ? pad("0"+value, length):value;
            }
            function bools_to_int(bools){
                var n = 0, l = bools.length;
                for (var i = 0; i < l; ++i) {
                    n = (n << 1) + (bools[i] ? 1 : 0);
                }
                return n;
            }
            function int_to_bools(value, bit_count){
                var bools = [];
                var bits = parseInt(value, 10).toString(2);
                bits = pad(bits, 32);
                for(var i=32-bit_count; i < 32; ++i){
                    bools.push(bits[i]=='1' ? true : false);
                }
                return bools;
            }
            return {
                'bools_to_int': bools_to_int,
                'is_working': function(){ return working },
                'get_hsts_value': function (callback){
                    if(working) return false;
                    working = true;
                    fields = [];
                    remaining = domains.length;
                    for(var i = 0; i < domains.length; ++i){
                        fields.push(undefined);
                        var img = create_request(i, domains[i], callback);
                    }
                    return true;
                },
                'set_hsts_value': function (values, callback){
                    if(working) return false;
                    working = true;
                    fields = [];
                    remaining = domains.length;
                    for(var i = 0; i < domains.length; ++i){
                        fields.push(undefined);
                        if(values[i])
                            create_request(i, domains[i]+'?SET=1', callback);
                        else
                            create_request(i, domains[i]+'?DEL=1', callback);
                    }
                    return true;
                },
                'set_hsts_as_int': function (value, callback){
                    var value = int_to_bools(value, domains.length);
                    return this.set_hsts_value(value, callback);
                },
                'get_hsts_as_int': function (callback){
                    return this.get_hsts_value(function(fields){
                        callback(bools_to_int(fields));
                    });
                }
            };
        }



        var defaultOptionMap = {
            history: true, // CSS history knocking or not .. can be network intensive
            java: true, // Java applet on/off... may prompt users for permission to run.
            tests: 10,  // 1000 what is it, actually?
            silverlight: true, // you might want to turn it off https://github.com/samyk/evercookie/issues/45,
            lso: true, // local storage
            domain: '.' + window.location.host.replace(/:\d+/, ''), // Get current domain
            baseurl: '', // base url for php, flash and silverlight assets
            asseturi: '/assets', // assets = .fla, .jar, etc
            phpuri: '/php', // php file path or route
            authPath: false, //'/evercookie_auth.php', // set to false to disable Basic Authentication cache
            swfFileName: '/evercookie.swf',
            xapFileName: '/evercookie.xap',
            jnlpFileName: '/evercookie.jnlp',
            pngCookieName: 'evercookie_png',
            pngPath: '/evercookie_png.php',
            etagCookieName: 'evercookie_etag',
            etagPath: '/evercookie_etag.php',
            cacheCookieName: 'evercookie_cache',
            cachePath: '/evercookie_cache.php',
            hsts: false,
            hsts_domains: [],
            db: true, // Database
            idb: true // Indexed DB
        };

        var _baseKeyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        /**
         * @class Evercookie
         * @param {Object} options
         * @param {Boolean} options.history CSS history knocking or not .. can be network intensive
         * @param {Boolean} options.java Java applet on/off... may prompt users for permission to run.
         * @param {Number} options.tests
         * @param {Boolean} options.silverlight you might want to turn it off https://github.com/samyk/evercookie/issues/45
         * @param {Boolean} options.lso 	Turn local storage cookies on and off.
         * @param {String} options.domain (eg: www.sitename.com use .sitename.com)
         * @param {String} options.baseurl base url (eg: www.sitename.com/demo use /demo)
         * @param {String} options.asseturi asset path (eg: www.sitename.com/assets use /assets)
         * @param {String} options.phpuri php path/route (eg: www.sitename.com/php use /php)
         * @param {String|Function} options.domain as a string, domain for cookie, as a function, accept window object and return domain string
         * @param {String} options.swfFileName
         * @param {String} options.xapFileName
         * @param {String} options.jnlpFileName
         * @param {String} options.pngCookieName
         * @param {String} options.pngPath
         * @param {String} options.etagCookieName:
         * @param {String} options.etagPath
         * @param {String} options.cacheCookieName
         * @param {String} options.cachePath
         * @param {String} options.hsts	Turn hsts cookies on and off.
         * @param {Boolean} options.db 	Turn db cookies on and off.
         * @param {Boolean} options.idb 	Turn indexed db cookies on and off.
         * @param {Array} options.hsts_domains	The domains used for the hsts cookie. 1 Domain = one bit (8 domains => 8 bit => values up to 255)
         */
        function Evercookie(options) {
            options = options || {};
            var opts = {};
            for (var key in defaultOptionMap) {
                var optValue = options[key];
                if(typeof optValue !== 'undefined') {
                    opts[key] = optValue
                } else {
                    opts[key] = defaultOptionMap[key];
                }
            }
            if(typeof opts.domain === 'function'){
                opts.domain = opts.domain(window);
            }
            var _ec_history = opts.history,
                _ec_java =  opts.java,
                _ec_tests = opts.tests,
                _ec_baseurl = opts.baseurl,
                _ec_asseturi = opts.asseturi,
                _ec_phpuri = opts.phpuri,
                _ec_domain = opts.domain,
                _ec_swf_file_name = opts.swfFileName,
                _ec_xap_file_name = opts.xapFileName,
                _ec_jnlp_file_name = opts.jnlpFileName,
                _ec_hsts = opts.hsts;

            // private property
            var self = this;
            this._ec = {};
            if (_ec_hsts){
                if(opts.hsts_domains.length <= 8){
                    // TODO: warn on some more prominent place ?
                    console.log('HSTS cookie with '+opts.hsts_domains.length+' can only save values up to ' + Math.pow(2, opts.hsts_domains.length) - 1);
                }
                this.hsts_cookie = HSTS_Cookie(opts.hsts_domains);
            }

            this.get = function (name, cb, dont_reset) {
                self._evercookie(name, cb, undefined, undefined, dont_reset);
            };

            this.set = function (name, value) {
                self._evercookie(name, function () {}, value);
            };

            this._evercookie = function (name, cb, value, i, dont_reset) {
                if (self._evercookie === undefined) {
                    self = this;
                }
                if (i === undefined) {
                    i = 0;
                }
                // first run
                if (i === 0) {
                    if (opts.db) {
                        self.evercookie_database_storage(name, value);
                    }
                    if (opts.idb) {
                        self.evercookie_indexdb_storage(name, value);
                    }
                    if (opts.pngCookieName) {
                        self.evercookie_png(name, value);
                    }
                    if (opts.etagCookieName) {
                        self.evercookie_etag(name, value);
                    }
                    if (opts.cacheCookieName) {
                        self.evercookie_cache(name, value);
                    }
                    if (opts.lso) {
                        self.evercookie_lso(name, value);
                    }
                    if (opts.silverlight) {
                        self.evercookie_silverlight(name, value);
                    }
                    if (opts.authPath) {
                        self.evercookie_auth(name, value);
                    }
                    if (opts.java && _ec_java) {
                        self.evercookie_java(name, value);
                    }

                    self._ec.userData      = self.evercookie_userdata(name, value);
                    self._ec.cookieData    = self.evercookie_cookie(name, value);
                    self._ec.localData     = self.evercookie_local_storage(name, value);
                    self._ec.globalData    = self.evercookie_global_storage(name, value);
                    self._ec.sessionData   = self.evercookie_session_storage(name, value);
                    self._ec.windowData    = self.evercookie_window(name, value);

                    if (_ec_history) {
                        self._ec.historyData = self.evercookie_history(name, value);
                    }
                    if (_ec_hsts) {
                        self._ec.hstsData = undefined;
                        if( value === undefined ){
                            self.hsts_cookie.get_hsts_as_int(function(int_val){
                                self._ec.hstsData = int_val;
                            });
                        }else{
                            self.hsts_cookie.set_hsts_as_int(value, function(val){
                                self._ec.hstsData = self.hsts_cookie.bools_to_int(val);
                            });
                        }
                    }
                }

                // when writing data, we need to make sure lso and silverlight object is there
                if (value !== undefined) {
                    if ((typeof _global_lso === "undefined" ||
                        typeof _global_isolated === "undefined" ||
                        self._ec.hstsData === undefined ||
                        self.hsts_cookie.is_working()) &&
                        i++ < _ec_tests) {
                        setTimeout(function () {
                            self._evercookie(name, cb, value, i, dont_reset);
                        }, 300);
                    }
                }

                // when reading data, we need to wait for swf, db, silverlight, java and png
                else
                {
                    if (
                        (
                            // we support local db and haven't read data in yet
                            (opts.db && window.openDatabase && typeof self._ec.dbData === "undefined") ||
                            (opts.idb && idb() && (typeof self._ec.idbData === "undefined" || self._ec.idbData === "")) ||
                            (opts.lso && typeof _global_lso === "undefined") ||
                            (opts.etagCookieName && typeof self._ec.etagData === "undefined") ||
                            (opts.cacheCookieName && typeof self._ec.cacheData === "undefined") ||
                            (opts.java && typeof self._ec.javaData === "undefined") ||
                            (opts.hsts && (self._ec.hstsData === undefined || self.hsts_cookie.is_working())) ||
                            (opts.pngCookieName && document.createElement("canvas").getContext && (typeof self._ec.pngData === "undefined" || self._ec.pngData === "")) ||
                            (opts.silverlight && typeof _global_isolated === "undefined")
                        ) &&
                        i++ < _ec_tests
                    )
                    {
                        setTimeout(function () {
                            self._evercookie(name, cb, value, i, dont_reset);
                        }, 300);
                    }

                    // we hit our max wait time or got all our data
                    else
                    {
                        // get just the piece of data we need from swf
                        self._ec.lsoData = self.getFromStr(name, _global_lso);
                        _global_lso = undefined;

                        // get just the piece of data we need from silverlight
                        self._ec.slData = self.getFromStr(name, _global_isolated);
                        _global_isolated = undefined;

                        var tmpec = self._ec,
                            candidates = [],
                            bestnum = 0,
                            candidate,
                            item;
                        self._ec = {};

                        // figure out which is the best candidate
                        for (item in tmpec) {
                            if (tmpec[item] && tmpec[item] !== "null" && tmpec[item] !== "undefined") {
                                candidates[tmpec[item]] = candidates[tmpec[item]] === undefined ? 1 : candidates[tmpec[item]] + 1;
                            }
                        }

                        for (item in candidates) {
                            if (candidates[item] > bestnum) {
                                bestnum = candidates[item];
                                candidate = item;
                            }
                        }

                        this.working = false;
                        // reset cookie everywhere
                        if (candidate !== undefined && (dont_reset === undefined || dont_reset !== 1)) {
                            self.set(name, candidate);
                        }
                        if (typeof cb === "function") {
                            cb(candidate, tmpec);
                        }
                    }
                }
            };

            this.evercookie_window = function (name, value) {
                try {
                    if (value !== undefined) {
                        window.name = _ec_replace(window.name, name, value);
                    } else {
                        return this.getFromStr(name, window.name);
                    }
                } catch (e) { }
            };

            this.evercookie_userdata = function (name, value) {
                try {
                    var elm = this.createElem("div", "userdata_el", 1);
                    if (elm.addBehavior) {
                        elm.style.behavior = "url(#default#userData)";

                        if (value !== undefined) {
                            elm.setAttribute(name, value);
                            elm.save(name);
                        } else {
                            elm.load(name);
                            return elm.getAttribute(name);
                        }
                    }
                } catch (e) {}
            };

            this.ajax = function (settings) {
                var headers, name, transports, transport, i, length;

                headers = {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'text/javascript, text/html, application/xml, text/xml, */*'
                };

                transports = [
                    function () { return new XMLHttpRequest(); },
                    function () { return new ActiveXObject('Msxml2.XMLHTTP'); },
                    function () { return new ActiveXObject('Microsoft.XMLHTTP'); }
                ];

                for (i = 0, length = transports.length; i < length; i++) {
                    transport = transports[i];
                    try {
                        transport = transport();
                        break;
                    } catch (e) {
                    }
                }

                transport.onreadystatechange = function () {
                    if (transport.readyState !== 4) {
                        return;
                    }
                    settings.success(transport.responseText);
                };
                transport.open('get', settings.url, true);
                for (name in headers) {
                    transport.setRequestHeader(name, headers[name]);
                }
                transport.send();
            };

            this.evercookie_cache = function (name, value) {
                if (value !== undefined) {
                    // make sure we have evercookie session defined first
                    document.cookie = opts.cacheCookieName + "=" + value + "; path=/; domain=" + _ec_domain;
                    // {{ajax request to opts.cachePath}} handles caching
                    self.ajax({
                        url: _ec_baseurl + _ec_phpuri + opts.cachePath + "?name=" + name + "&cookie=" + opts.cacheCookieName,
                        success: function (data) {}
                    });
                } else {
                    // interestingly enough, we want to erase our evercookie
                    // http cookie so the php will force a cached response
                    var origvalue = this.getFromStr(opts.cacheCookieName, document.cookie);
                    self._ec.cacheData = undefined;
                    document.cookie = opts.cacheCookieName + "=; expires=Mon, 20 Sep 2010 00:00:00 UTC; path=/; domain=" + _ec_domain;

                    self.ajax({
                        url: _ec_baseurl + _ec_phpuri + opts.cachePath + "?name=" + name + "&cookie=" + opts.cacheCookieName,
                        success: function (data) {
                            // put our cookie back
                            document.cookie = opts.cacheCookieName + "=" + origvalue + "; expires=Tue, 31 Dec 2030 00:00:00 UTC; path=/; domain=" + _ec_domain;

                            self._ec.cacheData = data;
                        }
                    });
                }
            };
            this.evercookie_auth = function (name, value) {
                if (value !== undefined) {
                    // {{opts.authPath}} handles Basic Access Authentication
                    newImage('//' + value + '@' + location.host + _ec_baseurl + _ec_phpuri + opts.authPath + "?name=" + name);
                }
                else {
                    self.ajax({
                        url: _ec_baseurl + _ec_phpuri + opts.authPath + "?name=" + name,
                        success: function (data) {
                            self._ec.authData = data;
                        }
                    });
                }
            };

            this.evercookie_etag = function (name, value) {
                if (value !== undefined) {
                    // make sure we have evercookie session defined first
                    document.cookie = opts.etagCookieName + "=" + value + "; path=/; domain=" + _ec_domain;
                    // {{ajax request to opts.etagPath}} handles etagging
                    self.ajax({
                        url: _ec_baseurl + _ec_phpuri + opts.etagPath + "?name=" + name + "&cookie=" + opts.etagCookieName,
                        success: function (data) {}
                    });
                } else {
                    // interestingly enough, we want to erase our evercookie
                    // http cookie so the php will force a cached response
                    var origvalue = this.getFromStr(opts.etagCookieName, document.cookie);
                    self._ec.etagData = undefined;
                    document.cookie = opts.etagCookieName + "=; expires=Mon, 20 Sep 2010 00:00:00 UTC; path=/; domain=" + _ec_domain;

                    self.ajax({
                        url: _ec_baseurl + _ec_phpuri + opts.etagPath + "?name=" + name + "&cookie=" + opts.etagCookieName,
                        success: function (data) {
                            // put our cookie back
                            document.cookie = opts.etagCookieName + "=" + origvalue + "; expires=Tue, 31 Dec 2030 00:00:00 UTC; path=/; domain=" + _ec_domain;

                            self._ec.etagData = data;
                        }
                    });
                }
            };

            this.evercookie_java = function (name, value) {
                var div = document.getElementById("ecAppletContainer");

                // Exit if dtjava.js was not included in the page header.
                if (typeof dtjava === "undefined") {
                    return;
                }

                // Create the container div if none exists.
                if (div===null || div === undefined || !div.length) {
                    div = document.createElement("div");
                    div.setAttribute("id", "ecAppletContainer");
                    div.style.position = "absolute";
                    div.style.top = "-3000px";
                    div.style.left = "-3000px";
                    div.style.width = "1px";
                    div.style.height = "1px";
                    document.body.appendChild(div);
                }

                // If the Java applet is not yet defined, embed it.
                if (typeof ecApplet === "undefined") {
                    dtjava.embed({
                        id: "ecApplet",
                        url: _ec_baseurl + _ec_asseturi + _ec_jnlp_file_name,
                        width: "1px",
                        height: "1px",
                        placeholder: "ecAppletContainer"
                    }, {},{ onJavascriptReady: doSetOrGet });
                    // When the applet is loaded we will continue in doSetOrGet()
                }
                else {
                    // applet already running... call doGetOrSet() directly.
                    doSetOrGet("ecApplet");
                }

                function doSetOrGet(appletId) {
                    var applet = document.getElementById(appletId);
                    if (value !== undefined) {
                        applet.set(name,value);
                    }
                    else {
                        self._ec.javaData = applet.get(name);
                    }
                }

                // The result of a get() is now in self._ec._javaData
            };

            this.evercookie_lso = function (name, value) {
                var div = document.getElementById("swfcontainer"),
                    flashvars = {},
                    params = {},
                    attributes = {};
                if (div===null || div === undefined || !div.length) {
                    div = document.createElement("div");
                    div.setAttribute("id", "swfcontainer");
                    document.body.appendChild(div);
                }

                if (value !== undefined) {
                    flashvars.everdata = name + "=" + value;
                }
                params.swliveconnect = "true";
                attributes.id        = "myswf";
                attributes.name      = "myswf";
                swfobject.embedSWF(_ec_baseurl + _ec_asseturi + _ec_swf_file_name, "swfcontainer", "1", "1", "9.0.0", false, flashvars, params, attributes);
            };

            this.evercookie_png = function (name, value) {
                var canvas = document.createElement("canvas"),
                    img, ctx, origvalue;
                canvas.style.visibility = "hidden";
                canvas.style.position = "absolute";
                canvas.width = 200;
                canvas.height = 1;
                if (canvas && canvas.getContext) {
                    // {{opts.pngPath}} handles the hard part of generating the image
                    // based off of the http cookie and returning it cached
                    img = new Image();
                    img.style.visibility = "hidden";
                    img.style.position = "absolute";
                    if (value !== undefined) {
                        // make sure we have evercookie session defined first
                        document.cookie = opts.pngCookieName + "=" + value + "; path=/; domain=" + _ec_domain;
                    } else {
                        self._ec.pngData = undefined;
                        ctx = canvas.getContext("2d");

                        // interestingly enough, we want to erase our evercookie
                        // http cookie so the php will force a cached response
                        origvalue = this.getFromStr(opts.pngCookieName, document.cookie);
                        document.cookie = opts.pngCookieName + "=; expires=Mon, 20 Sep 2010 00:00:00 UTC; path=/; domain=" + _ec_domain;

                        img.onload = function () {
                            // put our cookie back
                            document.cookie = opts.pngCookieName + "=" + origvalue + "; expires=Tue, 31 Dec 2030 00:00:00 UTC; path=/; domain=" + _ec_domain;

                            self._ec.pngData = "";
                            ctx.drawImage(img, 0, 0);

                            // get CanvasPixelArray from  given coordinates and dimensions
                            var imgd = ctx.getImageData(0, 0, 200, 1),
                                pix = imgd.data, i, n;

                            // loop over each pixel to get the "RGB" values (ignore alpha)
                            for (i = 0, n = pix.length; i < n; i += 4) {
                                if (pix[i] === 0) {
                                    break;
                                }
                                self._ec.pngData += String.fromCharCode(pix[i]);
                                if (pix[i + 1] === 0) {
                                    break;
                                }
                                self._ec.pngData += String.fromCharCode(pix[i + 1]);
                                if (pix[i + 2] === 0) {
                                    break;
                                }
                                self._ec.pngData += String.fromCharCode(pix[i + 2]);
                            }
                        };
                    }
                    img.src = _ec_baseurl + _ec_phpuri + opts.pngPath + "?name=" + name + "&cookie=" + opts.pngCookieName;
                    img.crossOrigin = 'Anonymous';
                }
            };

            this.evercookie_local_storage = function (name, value) {
                try {
                    if (localStore) {
                        if (value !== undefined) {
                            localStore.setItem(name, value);
                        } else {
                            return localStore.getItem(name);
                        }
                    }
                } catch (e) { }
            };

            this.evercookie_database_storage = function (name, value) {
                try {
                    if (window.openDatabase) {
                        var database = window.openDatabase("sqlite_evercookie", "", "evercookie", 1024 * 1024);

                        if (value !== undefined) {
                            database.transaction(function (tx) {
                                tx.executeSql("CREATE TABLE IF NOT EXISTS cache(" +
                                    "id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, " +
                                    "name TEXT NOT NULL, " +
                                    "value TEXT NOT NULL, " +
                                    "UNIQUE (name)" +
                                    ")", [], function (tx, rs) {}, function (tx, err) {});
                                tx.executeSql("INSERT OR REPLACE INTO cache(name, value) " +
                                    "VALUES(?, ?)",
                                    [name, value], function (tx, rs) {}, function (tx, err) {});
                            });
                        } else {
                            database.transaction(function (tx) {
                                tx.executeSql("SELECT value FROM cache WHERE name=?", [name],
                                    function (tx, result1) {
                                        if (result1.rows.length >= 1) {
                                            self._ec.dbData = result1.rows.item(0).value;
                                        } else {
                                            self._ec.dbData = "";
                                        }
                                    }, function (tx, err) {});
                            });
                        }
                    }
                } catch (e) { }
            };

            this.evercookie_indexdb_storage = function(name, value) {
                try {
                    if (!('indexedDB' in window)) {

                        indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
                        IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
                        IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
                    }

                    if (indexedDB) {
                        var ver = 1;
                        //FF incognito mode restricts indexedb access
                        var request = indexedDB.open("idb_evercookie", ver);


                        request.onerror = function(e) { ;
                        }

                        request.onupgradeneeded = function(event) {
                            var db = event.target.result;

                            var store = db.createObjectStore("evercookie", {
                                keyPath: "name",
                                unique: false
                            })

                        }

                        if (value !== undefined) {


                            request.onsuccess = function(event) {
                                var idb = event.target.result;
                                if (idb.objectStoreNames.contains("evercookie")) {
                                    var tx = idb.transaction(["evercookie"], "readwrite");
                                    var objst = tx.objectStore("evercookie");
                                    var qr = objst.put({
                                        "name": name,
                                        "value": value
                                    })
                                } idb.close();
                            }

                        } else {

                            request.onsuccess = function(event) {

                                var idb = event.target.result;

                                if (!idb.objectStoreNames.contains("evercookie")) {

                                    self._ec.idbData = undefined;
                                } else {
                                    var tx = idb.transaction(["evercookie"]);
                                    var objst = tx.objectStore("evercookie");
                                    var qr = objst.get(name);

                                    qr.onsuccess = function(event) {
                                        if (qr.result === undefined) {
                                            self._ec.idbData = undefined
                                        } else {
                                            self._ec.idbData = qr.result.value;
                                        }
                                    }
                                }
                                idb.close();
                            }
                        }
                    }
                } catch (e) {}
            };

            this.evercookie_session_storage = function (name, value) {
                try {
                    if (sessionStorage) {
                        if (value !== undefined) {
                            sessionStorage.setItem(name, value);
                        } else {
                            return sessionStorage.getItem(name);
                        }
                    }
                } catch (e) { }
            };

            this.evercookie_global_storage = function (name, value) {
                if (globalStorage) {
                    var host = this.getHost();
                    try {
                        if (value !== undefined) {
                            globalStorage[host][name] = value;
                        } else {
                            return globalStorage[host][name];
                        }
                    } catch (e) { }
                }
            };

            this.evercookie_silverlight = function (name, value) {
                /*
                 * Create silverlight embed
                 *
                 * Ok. so, I tried doing this the proper dom way, but IE chokes on appending anything in object tags (including params), so this
                 * is the best method I found. Someone really needs to find a less hack-ish way. I hate the look of this shit.
                 */
                var source = _ec_baseurl + _ec_asseturi + _ec_xap_file_name,
                    minver = "4.0.50401.0",
                    initParam = "",
                    html;
                if (value !== undefined) {
                    initParam = '<param name="initParams" value="' + name + '=' + value + '" />';
                }

                html =
                    '<object style="position:absolute;left:-500px;top:-500px" data="data:application/x-silverlight-2," type="application/x-silverlight-2" id="mysilverlight" width="0" height="0">' +
                    initParam +
                    '<param name="source" value="' + source + '"/>' +
                    '<param name="onLoad" value="onSilverlightLoad"/>' +
                    '<param name="onError" value="onSilverlightError"/>' +
                    '<param name="background" value="Transparent"/>' +
                    '<param name="windowless" value="true"/>' +
                    '<param name="minRuntimeVersion" value="' + minver + '"/>' +
                    '<param name="autoUpgrade" value="false"/>' +
                    '<a href="http://go.microsoft.com/fwlink/?LinkID=149156&v=' + minver + '" style="display:none">' +
                    'Get Microsoft Silverlight' +
                    '</a>' +
                    '</object>';
                try{
                    if (typeof jQuery === 'undefined') {
                        document.body.appendChild(html);
                    } else {
                        $('body').append(html);
                    }
                }catch(ex){

                }
            };

            // public method for encoding
            this.encode = function (input) {
                var output = "",
                    chr1, chr2, chr3, enc1, enc2, enc3, enc4,
                    i = 0;

                input = this._utf8_encode(input);

                while (i < input.length) {

                    chr1 = input.charCodeAt(i++);
                    chr2 = input.charCodeAt(i++);
                    chr3 = input.charCodeAt(i++);

                    enc1 = chr1 >> 2;
                    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                    enc4 = chr3 & 63;

                    if (isNaN(chr2)) {
                        enc3 = enc4 = 64;
                    } else if (isNaN(chr3)) {
                        enc4 = 64;
                    }

                    output = output +
                        _baseKeyStr.charAt(enc1) + _baseKeyStr.charAt(enc2) +
                        _baseKeyStr.charAt(enc3) + _baseKeyStr.charAt(enc4);

                }

                return output;
            };

            // public method for decoding
            this.decode = function (input) {
                var output = "",
                    chr1, chr2, chr3,
                    enc1, enc2, enc3, enc4,
                    i = 0;

                input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

                while (i < input.length) {
                    enc1 = _baseKeyStr.indexOf(input.charAt(i++));
                    enc2 = _baseKeyStr.indexOf(input.charAt(i++));
                    enc3 = _baseKeyStr.indexOf(input.charAt(i++));
                    enc4 = _baseKeyStr.indexOf(input.charAt(i++));

                    chr1 = (enc1 << 2) | (enc2 >> 4);
                    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                    chr3 = ((enc3 & 3) << 6) | enc4;

                    output = output + String.fromCharCode(chr1);

                    if (enc3 !== 64) {
                        output = output + String.fromCharCode(chr2);
                    }
                    if (enc4 !== 64) {
                        output = output + String.fromCharCode(chr3);
                    }
                }
                output = this._utf8_decode(output);
                return output;
            };

            // private method for UTF-8 encoding
            this._utf8_encode = function (str) {
                str = str.replace(/\r\n/g, "\n");
                var utftext = "", i = 0, n = str.length, c;
                for (; i < n; i++) {
                    c = str.charCodeAt(i);
                    if (c < 128) {
                        utftext += String.fromCharCode(c);
                    } else if ((c > 127) && (c < 2048)) {
                        utftext += String.fromCharCode((c >> 6) | 192);
                        utftext += String.fromCharCode((c & 63) | 128);
                    } else {
                        utftext += String.fromCharCode((c >> 12) | 224);
                        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                        utftext += String.fromCharCode((c & 63) | 128);
                    }
                }
                return utftext;
            };

            // private method for UTF-8 decoding
            this._utf8_decode = function (utftext) {
                var str = "",
                    i = 0, n = utftext.length,
                    c = 0, c1 = 0, c2 = 0, c3 = 0;
                while (i < n) {
                    c = utftext.charCodeAt(i);
                    if (c < 128) {
                        str += String.fromCharCode(c);
                        i += 1;
                    } else if ((c > 191) && (c < 224)) {
                        c2 = utftext.charCodeAt(i + 1);
                        str += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                        i += 2;
                    } else {
                        c2 = utftext.charCodeAt(i + 1);
                        c3 = utftext.charCodeAt(i + 2);
                        str += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                        i += 3;
                    }
                }
                return str;
            };

            // this is crazy but it's 4am in dublin and i thought this would be hilarious
            // blame the guinness
            this.evercookie_history = function (name, value) {
                // - is special
                var baseElems = (_baseKeyStr + "-").split(""),
                    // sorry google.
                    url = "http://www.google.com/evercookie/cache/" + this.getHost() + "/" + name,
                    i, base,
                    letter = "",
                    val = "",
                    found = 1;

                if (value !== undefined) {
                    // don't reset this if we already have it set once
                    // too much data and you can't clear previous values
                    if (this.hasVisited(url)) {
                        return;
                    }

                    this.createIframe(url, "if");
                    url = url + "/";

                    base = this.encode(value).split("");
                    for (i = 0; i < base.length; i++) {
                        url = url + base[i];
                        this.createIframe(url, "if" + i);
                    }

                    // - signifies the end of our data
                    url = url + "-";
                    this.createIframe(url, "if_");
                } else {
                    // omg you got csspwn3d
                    if (this.hasVisited(url)) {
                        url = url + "/";

                        while (letter !== "-" && found === 1) {
                            found = 0;
                            for (i = 0; i < baseElems.length; i++) {
                                if (this.hasVisited(url + baseElems[i])) {
                                    letter = baseElems[i];
                                    if (letter !== "-") {
                                        val = val + letter;
                                    }
                                    url = url + letter;
                                    found = 1;
                                    break;
                                }
                            }
                        }

                        // lolz
                        return this.decode(val);
                    }
                }
            };

            this.createElem = function (type, name, append) {
                var el;
                if (name !== undefined && document.getElementById(name)) {
                    el = document.getElementById(name);
                } else {
                    el = document.createElement(type);
                }
                el.style.visibility = "hidden";
                el.style.position = "absolute";

                if (name) {
                    el.setAttribute("id", name);
                }

                if (append) {
                    document.body.appendChild(el);
                }
                return el;
            };

            this.createIframe = function (url, name) {
                var el = this.createElem("iframe", name, 1);
                el.setAttribute("src", url);
                return el;
            };

            // wait for our swfobject to appear (swfobject.js to load)
            var waitForSwf = this.waitForSwf = function (i) {
                if (i === undefined) {
                    i = 0;
                } else {
                    i++;
                }

                // wait for ~2 seconds for swfobject to appear
                if (i < _ec_tests && typeof swfobject === "undefined") {
                    setTimeout(function () {
                        waitForSwf(i);
                    }, 300);
                }
            };

            this.evercookie_cookie = function (name, value) {
                if (value !== undefined) {
                    // expire the cookie first
                    document.cookie = name + "=; expires=Mon, 20 Sep 2010 00:00:00 UTC; path=/; domain=" + _ec_domain;
                    document.cookie = name + "=" + value + "; expires=Tue, 31 Dec 2030 00:00:00 UTC; path=/; domain=" + _ec_domain;
                } else {
                    return this.getFromStr(name, document.cookie);
                }
            };

            // get value from param-like string (eg, "x=y&name=VALUE")
            this.getFromStr = function (name, text) {
                if (typeof text !== "string") {
                    return;
                }
                var nameEQ = name + "=",
                    ca = text.split(/[;&]/),
                    i, c;
                for (i = 0; i < ca.length; i++) {
                    c = ca[i];
                    while (c.charAt(0) === " ") {
                        c = c.substring(1, c.length);
                    }
                    if (c.indexOf(nameEQ) === 0) {
                        return c.substring(nameEQ.length, c.length);
                    }
                }
            };

            this.getHost = function () {
                return window.location.host.replace(/:\d+/, '');
            };

            this.toHex = function (str) {
                var r = "",
                    e = str.length,
                    c = 0,
                    h;
                while (c < e) {
                    h = str.charCodeAt(c++).toString(16);
                    while (h.length < 2) {
                        h = "0" + h;
                    }
                    r += h;
                }
                return r;
            };

            this.fromHex = function (str) {
                var r = "",
                    e = str.length,
                    s;
                while (e >= 0) {
                    s = e - 2;
                    r = String.fromCharCode("0x" + str.substring(s, e)) + r;
                    e = s;
                }
                return r;
            };

            /**
             * css history knocker (determine what sites your visitors have been to)
             *
             * originally by Jeremiah Grossman
             * http://jeremiahgrossman.blogspot.com/2006/08/i-know-where-youve-been.html
             *
             * ported to additional browsers by Samy Kamkar
             *
             * compatible with ie6, ie7, ie8, ff1.5, ff2, ff3, opera, safari, chrome, flock
             *
             * - code@samy.pl
             */
            this.hasVisited = function (url) {
                if (this.no_color === -1) {
                    var no_style = this._getRGB("http://samy-was-here-this-should-never-be-visited.com", -1);
                    if (no_style === -1) {
                        this.no_color = this._getRGB("http://samy-was-here-" + Math.floor(Math.random() * 9999999) + "rand.com");
                    }
                }

                // did we give full url?
                if (url.indexOf("https:") === 0 || url.indexOf("http:") === 0) {
                    return this._testURL(url, this.no_color);
                }

                // if not, just test a few diff types  if (exact)
                return this._testURL("http://" + url, this.no_color) ||
                    this._testURL("https://" + url, this.no_color) ||
                    this._testURL("http://www." + url, this.no_color) ||
                    this._testURL("https://www." + url, this.no_color);
            };

            /* create our anchor tag */
            var _link = this.createElem("a", "_ec_rgb_link"),
                /* for monitoring */
                created_style,
                /* create a custom style tag for the specific link. Set the CSS visited selector to a known value */
                _cssText = "#_ec_rgb_link:visited{display:none;color:#FF0000}",
                style;

            /* Methods for IE6, IE7, FF, Opera, and Safari */
            try {
                created_style = 1;
                style = document.createElement("style");
                if (style.styleSheet) {
                    style.styleSheet.innerHTML = _cssText;
                } else if (style.innerHTML) {
                    style.innerHTML = _cssText;
                } else {
                    style.appendChild(document.createTextNode(_cssText));
                }
            } catch (e) {
                created_style = 0;
            }

            /* if test_color, return -1 if we can't set a style */
            this._getRGB = function (u, test_color) {
                if (test_color && created_style === 0) {
                    return -1;
                }

                /* create the new anchor tag with the appropriate URL information */
                _link.href = u;
                _link.innerHTML = u;
                // not sure why, but the next two appendChilds always have to happen vs just once
                document.body.appendChild(style);
                document.body.appendChild(_link);

                /* add the link to the DOM and save the visible computed color */
                var color;
                if (document.defaultView) {
                    if (document.defaultView.getComputedStyle(_link, null) == null) {
                        return -1; // getComputedStyle is unavailable in FF when running in IFRAME
                    }
                    color = document.defaultView.getComputedStyle(_link, null).getPropertyValue("color");
                } else {
                    color = _link.currentStyle.color;
                }
                return color;
            };

            this._testURL = function (url, no_color) {
                var color = this._getRGB(url);

                /* check to see if the link has been visited if the computed color is red */
                if (color === "rgb(255, 0, 0)" || color === "#ff0000") {
                    return 1;
                } else if (no_color && color !== no_color) {
                    /* if our style trick didn't work, just compare default style colors */
                    return 1;
                }
                /* not found */
                return 0;
            };

        };

        window._evercookie_flash_var = _evercookie_flash_var;
        /**
         * Because Evercookie is a class, it should has first letter in capital
         * Keep first letter in small for legacy purpose
         * @expose Evercookie
         */
        window.evercookie = window.Evercookie = Evercookie;
    }(window));
}catch(ex){}
