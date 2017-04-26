import React from 'react';
import Config from "../../../config/main";
import {t} from "../../../helpers/translator";

module.exports = function timeFilterTemplate () {

    return (
        <div className="time-filter-m live-f-view-m">
            <ul>
                <li onClick={this.setFilter('all')}
                    className={this.props.liveVideoFilter === 'all' ? "active" : ""}>
                    <p>{t("All")}</p>
                </li>
                {Config.main.video.enableLiveGamesFilter
                    ? <li onClick={this.setFilter("with_video")}
                        className={this.props.liveVideoFilter === "with_video" ? "active" : ""}>
                        <p>{t("With video")}</p>
                    </li>
                    : null}

            </ul>
        </div>
    );
};
