import React from 'react';
import {getStatsLink} from "../../../helpers/sport/sportData";
import Config from "../../../config/main";
import moment from "moment";
import {t} from "../../../helpers/translator";

module.exports = function gameInfoTemplate () {
    console.log("game info", this.props.game);
    return (
        <div className="game-view-wrapper">

            {/*Pre match Game*/}
            <div className={"game-view-title-contain-m" + (this.props.game.team2_name ? "" : " single-team")}>
                <div className="game-date-row-m">
                    <p>{moment.unix(this.props.game.start_ts).format(Config.main.dateFormat)}</p>
                    {this.props.game.is_stat_available
                        ? <div className="statistic-icon-view-m">
                            <a href={getStatsLink(this.props.game, this.props.language)} target="_blank">
                                <span className="statistic-icon-m-v"/>
                            </a>
                        </div> : null}
                    <span>{moment.unix(this.props.game.start_ts).format(Config.main.timeFormat)}</span>
                </div>
                <div className="teams-name-shirt-color">
                     <ul>
                        <li className="team-names-b-m">
                            <p>{this.props.game.team1_name}</p>
                            {this.props.game.info.shirt1_color && this.props.game.show_type !== "OUTRIGHT" ? <div className="shirt-box-m"></div> : null }
                        </li>
                        {this.props.game.team2_name
                            ? [
                                <li className="vs-contain-m" key="vs">
                                    <span>{t("vs")}</span>
                                </li>,
                                <li className="team-names-b-m" key="team2">
                                    <p>{this.props.game.team2_name}</p>
                                    {this.props.game.info.shirt2_color ? <div className="shirt-box-m"></div> : null }
                                </li>
                            ] : null}
                    </ul>
                    {this.props.game.info.add_info ? <div className="game-view-additional-info-m"><p>{this.props.game.info.add_info}</p></div> : null}
                </div>
            </div>
            {/*Pre match Game END*/}

        </div>
    );
};
