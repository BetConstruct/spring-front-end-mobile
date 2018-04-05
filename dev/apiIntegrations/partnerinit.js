(function () {

    var document = window.document || document;
    try {
        document.domain = window.location.hostname.split(/\./).slice(-2).join(".");
    } catch (e) {
        console.log(e);
    }

    // document.domain = 'bestbet.com';

    function getUrlParams(url) {
        // http://stackoverflow.com/a/23946023/2407309
        if (typeof url == 'undefined') {
            url = window.location.search
        }
        var url = url.split('#')[0], // Discard fragment identifier.,
            queryString = url.split('?')[1];
        if (!queryString) {
            if (url.search('=') !== false) {
                queryString = url
            }
        }
        var urlParams = {}
        if (queryString) {
            var keyValuePairs = queryString.split('&')
            for (var i = 0; i < keyValuePairs.length; i++) {
                var keyValuePair = keyValuePairs[i].split('='),
                    paramName = keyValuePair[0],
                    paramValue = keyValuePair[1] || '';
                urlParams[paramName] = decodeURIComponent(paramValue.replace(/\+/g, ' '))
            }
        }
        return urlParams;
    } //

    function qs(where, key) {
        key = key.replace(/[*+?^$.\[\]{}()|\\\/]/g, "\\$&"); // escape RegEx meta chars
        var match = where.match(new RegExp("[?&]" + key + "=([^&]+)(&|$)"));
        return match && decodeURIComponent(match[1].replace(/\+/g, " "));
    }

    function bindEvent(element, type, handler) {
        if (element.addEventListener) {
            element.addEventListener(type, handler, false);
        } else {
            element.attachEvent('on' + type, handler);
        }
    }

    var src = document.getElementById('bcsportsbook').src;

    var query_p = getUrlParams(src);

    var parsed_src = src.match(/^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)(\/[^?#]*)(\?[^#]*|)(#.*|)$/),
        domain = parsed_src ? parsed_src[2] : '',
        query = parsed_src ? parsed_src[6] : '',
        path = parsed_src ? parsed_src[5] : '';
    path = path.length ? path.substr(1, path.indexOf('/js/partnerinit.js')) : "";

    console.log(query_p.containerID);

    var container = document.getElementById(query_p.containerID);
    console.log(container);

    var skinName = qs(src, 'skinName'),
        pathPrefix = qs(src, 'pathPrefix') || "",
        page = qs(src, 'page') || '/sport',
        url = (domain ? ("//" + domain) : "") + pathPrefix + "/" + path + (skinName ? (skinName + ".html") : "") + "#" + (page === '/' ? '' : page) + '/' + query,
        frame = document.createElement("iframe");
    frame.setAttribute("src", url);
    frame.setAttribute("id", "bcsportsbookiframe");

    function fixHeight() {
        try {
            frame.height = frame.contentWindow.document.body.scrollHeight;
        } catch (e) {
            setTimeout(fixHeight, 500);
        }
    }

    frame.setAttribute("width", "100%");
    if (qs(src, 'dynamicheight')) {
        bindEvent(frame, "load", fixHeight);
        bindEvent(window, "resize", fixHeight);
    } else {
        frame.setAttribute("height", "100%");
    }

    container.appendChild(frame);
})();
