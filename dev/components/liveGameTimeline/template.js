import React from 'react';
import {generateTimeLineEvents, checkExtraTime} from "../../helpers/sport/gameInfo";
import {SPORTS_HAVING_TIMELINE} from "../../constants/sportsInfo";
import {t} from "../../helpers/translator";

module.exports = function LiveGameTimelineTemplate () {
    let {tlEvents, tlCurrentMinute, tlCurrentPosition} = generateTimeLineEvents(this.props.game);
    return SPORTS_HAVING_TIMELINE[this.props.sportAlias] ? (
        <div className="timeline-container">
            <div className={"timeline-control" + (((this.props.game.last_event && this.props.game.last_event.match_length === '80') || (this.props.game && this.props.game.match_length === '80')) ? ' tl-80' : "") + (checkExtraTime(this.props.game.info) ? " extra" : "")}>
                <span className="tl-15"/>
                <span className="tl-30"/>
                <span className="tl-45"/>
                <span className="tl-60"/>
                <span className="tl-75"/>
                <span className="tl-90"/>
                <span className="tl-20"/>
                <span className="tl-40"/>
                <span className="tl-6-0"/>
                <span className="tl-80"/>
                <span className="ht-ft"/>
            </div>
            <div className="tl-data">
                <div className="current-minute" style={tlCurrentMinute}></div>
                {tlEvents.map(tlEvent =>
                    <div style={tlEvent.timeline_position} className={tlEvent.team + '-' + tlEvent.type}>
                        <div className={tlEvent.type}></div>
                        <div className={"tl-details" + (tlEvent.minute > 50 ? ' to-right' : '')}>{t(tlEvent.details.type)} {tlEvent.details.add_info}</div>
                </div>
                )}

                <div className="tl-info" style={tlCurrentPosition}>
                </div>
            </div>
        </div>
    ) : null;
};
