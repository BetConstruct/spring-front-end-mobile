import React from 'react';
import Config from "../../../config/main";
import {t} from "../../../helpers/translator";

module.exports = function oddFormatChangerTemplate () {
    return (
        <div className="import-view-container">
            <div className="language-container-m">
                <ul>
                    <li>
                        <p>{t("Odds format:")}</p>
                    </li>
                    <li>
                        <div className="select-contain-m">
                            <select onChange={this.changeOddsFormat} ref="oddsFormatSelect" value={this.props.preferences.oddsFormat}>
                                {Config.main.availableOddFormats.map(format => <option key={format} value={format}>{t(format)}</option>)}
                            </select>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    );
};
