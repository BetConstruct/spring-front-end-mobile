import Config from "../config/main";

export const handicapBaseFormat = (base, filterCondition, showOrdered, marketNameDisplayKey, homeScore, awayScore, type) => {
    if (base === undefined) {
        return;
    }

    if (Config.main.homeAwayBaseRecalculationEnabled && homeScore !== undefined && awayScore !== undefined) {
        base = parseFloat(base);
        let delta = homeScore - awayScore;
        switch (type) {
            case "Home":
                base += delta;
                break;
            case "Away":
                base -= delta;
                break;
        }
    }
    if (Config.main.fractionalBaseFormat && (filterCondition || filterCondition === undefined)) {
        if (marketNameDisplayKey === "HANDICAP" || "TOTALS") {
            let sign = parseFloat(base) < 0 ? '-' : '';
            let value = parseFloat(base);
            if ((value / 0.25) % 2 === 0) {
                return base;
            } else {
                if (showOrdered) {
                    let value1 = Math.abs(value - 0.25),
                        value2 = Math.abs(value + 0.25),
                        result;
                    if (value1 >= value2) {
                        result = value2 + ' / ' + value1;
                    } else {
                        result = value1 + ' / ' + value2;
                    }
                    return sign + result;
                } else {
                    return (value - 0.25) + ' / ' + Math.abs((value + 0.25));
                }
            }
        } else {
            return base;
        }
    } else {
        return base;
    }
};

export const mathCuttingFunction = (fValue) => {
    if (Config.main.decimalFormatRemove3Digit) {
        let dValue = fValue.toString().split('.')[0],
            remValue = fValue.toString().split('.')[1];
        if (remValue) {
            //avoids javascript bug: 8.2 * 100 = 819.9999999999999
            if (remValue.length > 1) {
                return parseInt(remValue.substr(0, 2)) === 99 ? parseInt(dValue) + 1 : parseInt(dValue);

            } else {
                return Math.floor(fValue);
            }

        } else {
            return fValue;
        }

    } else {
        return Math.round(fValue);
    }
};