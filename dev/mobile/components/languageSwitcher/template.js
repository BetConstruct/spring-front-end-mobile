import React from 'react';
import Helpers from "../../../helpers/helperFunctions";
import Config from "../../../config/main";
import {t} from "../../../helpers/translator";

module.exports = function languageSwitcherTemplate () {
    return (
        <div className="import-view-container">
            <div className="language-container-m">
                {this.props.mode === "select"
                ? <ul>
                    <li>
                        <p>{t("Language")}</p>
                    </li>
                    <li>
                        <div className="select-contain-m">
                            <select onChange={this.changeLanguage} ref="lngSelect"
                                    value={this.props.preferences.lang}>
                                {Helpers.objectToArray(Config.main.availableLanguages, "code").sort(Helpers.byOrderSortingFunc).map(
                                    lng => <option key={lng.code} value={lng.code}>{lng.full}</option>
                                )}
                            </select>
                        </div>
                    </li>
                </ul>
                : <ul className="language-list">
                    {Helpers.objectToArray(Config.main.availableLanguages, "code").sort(Helpers.byOrderSortingFunc).map(
                        lng => <li key={lng.code} className={lng.code + (lng.code === this.props.preferences.lang ?" active":"")} onClick={this.changeLanguageTo(lng.code)}>{lng.full}</li>
                    )}
                </ul>}
            </div>
        </div>
    );
};
