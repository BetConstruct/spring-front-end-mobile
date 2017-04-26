export const parseXML = (data) => {
    var xml, tmp;
    if (!data || typeof data !== "string") {
        return null;
    }
    try {
        if (window.DOMParser) { // Standard
            tmp = new DOMParser();
            xml = tmp.parseFromString(data, "text/xml");
        } else { // IE
            /* global ActiveXObject */
            xml = new ActiveXObject("Microsoft.XMLDOM");
            xml.async = "false";
            xml.loadXML(data);
        }
    } catch (e) {
        xml = undefined;
    }
    /*    if (!xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length) {
     jQuery.error( "Invalid XML: " + data );
     }*/
    return xml;
};

export const getVideoURL = (data) => {
    let xmlDoc = parseXML(data),
        url;
    let streamLaunchCodes = xmlDoc.getElementsByTagName("streamLaunchCode");
    if (xmlDoc) {
        for (let i = 0; i < streamLaunchCodes.length; i++) {
            url = (streamLaunchCodes[i].innerHTML).replace(/[\[\]']+/g, '').replace(/CDATA/g, '').replace('<!', '').replace('>', '');  // eslint-disable-line no-useless-escape
            if (url.indexOf('.m3u8') !== -1) {
                return url;
            }
        }
    }
    return null;
};

export const updateBetChashout = (openBet, cashoutableEvents) => {
    if (openBet.cash_out && (openBet.type === 1 || openBet.type === 2)) {
        let isBetCashoutable = true;
        let newCoef = 1;
        let amountCoefPow = 0;
        Object.keys(openBet.events).forEach(key => {
            let openBetSelectionId = openBet.events[key].selection_id;
            if (cashoutableEvents[openBetSelectionId] && cashoutableEvents[openBetSelectionId].price && cashoutableEvents[openBetSelectionId].price > 1) {
                newCoef *= cashoutableEvents[openBetSelectionId].price;
                amountCoefPow += 1;
            } else if (openBet.events[key].outcome !== 3) {
                isBetCashoutable = false;
            }
        });

        if (isBetCashoutable) {
            let amountCoef = Math.pow(0.9, amountCoefPow);
            return {
                cashoutSuspended: false,
                calculatedCashout: Math.round(((openBet.k / newCoef) * openBet.amount * amountCoef || 0) * 10) / 10
            };
        }
        return {cashoutSuspended: true};
    }
};