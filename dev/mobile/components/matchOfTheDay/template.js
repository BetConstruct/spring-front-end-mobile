import React from 'react';
import {Link} from 'react-router';
import Loader from "../loader/";
import Event from "../event/";
import Helpers from "../../../helpers/helperFunctions";
import {niceEventName} from "../../../helpers/sport/eventNames";
import {getPrimaryMarketType} from "../../../helpers/sport/sportData";
import {t} from "../../../helpers/translator";

module.exports = function matchOfTheDayTemplate () {
    if (this.props.loaded) {

        if (!this.props.data || !this.props.data.sport || !Object.keys(this.props.data.sport).length) {
            return null;
        }
        console.debug("match of the day", this.props.data);
        let Sport = Helpers.firstElement(this.props.data.sport);
        let Game = Helpers.firstElement(Sport.game);
        return <div className={"match-of-day-m" + (Game.is_blocked ? " blocked" : "")} >
            <div className="title-view-match-day">
                <h2>{t("Match of the day")}</h2>
            </div>
            <div className="match-team-name-view">
                <div className="teams-name-info-m">
                    <ul>
                        <li className="team-name-container-m left-t">
                            <Link to={'/game/' + Game.id} className="single-team-info-m">
                                <p>{t("HOME")}</p>
                                <h4>{Game.team1_name}</h4>
                                <span className="team-logo-contain-view"/>
                            </Link>
                        </li>
                        <li className="vs-contain-b">
                            <span>vs</span>
                        </li>
                        <li className="team-name-container-m right-t">
                            <Link to={'/game/' + Game.id} className="single-team-info-m">
                                <p>{t("AWAY")}</p>
                                <h4>{Game.team2_name}</h4>
                                <span className="team-logo-contain-view"/>
                            </Link>
                        </li>
                    </ul>
                </div>

            </div>

            <div className="coefficient-game-view">
                <ul>
                    {(() => {
                        let market = Helpers.firstElement(Game.market), eventsObj = market && market.event, events = {};
                        eventsObj && Object.keys(eventsObj).map(id => { events[eventsObj[id].type] = eventsObj[id]; });
                        return [
                            <li key="P1"><Event event={events.P1} price={events.P1 && events.P1.price} name={niceEventName(events.P1.name, Game)} game={Game} market={market}/></li>,
                            getPrimaryMarketType(Game) === "P1XP2" ? <li key="X"><Event event={events.X} price={events.X && events.X.price} name={niceEventName(events.X.name, Game)} game={Game} market={market}/></li> : null,
                            <li key="P2"><Event event={events.P2} price={events.P2 && events.P2.price} name={niceEventName(events.P2.name, Game)} game={Game} market={market}/></li>
                        ];
                    })()}
                </ul>
            </div>

        </div>;
    } else {
        return <Loader/>;
    }
};
