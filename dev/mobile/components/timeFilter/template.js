import React from 'react';
import Config from "../../../config/main";
import {t} from "../../../helpers/translator";

module.exports = function timeFilterTemplate () {
    return (
        <div className="time-filter-m">
            <ul>
                <li onClick={this.setTimeFilter(0)}
                    className={this.props.prematchTimeFilter === 0 ? "active" : ""}>
                    <p>{t("All")}</p>
                </li>
                {Config.main.prematchTimeFilterValues.map(interval =>
                    <li key={interval} onClick={this.setTimeFilter(interval)}
                        className={this.props.prematchTimeFilter === interval ? "active" : ""}>
                        <p>{interval} {t("hrs")}</p>
                    </li>
                )}
            </ul>
        </div>
    );
};
