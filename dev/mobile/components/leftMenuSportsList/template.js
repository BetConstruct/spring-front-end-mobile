import React from 'react';
import {Link} from 'react-router';
import Loader from "../loader/";
// import {t} from "../../../helpers/translator";

module.exports = function leftMenuSportsListTemplate() {
    var Sports = [];
    var sportsList = this.props.data;
    if (this.props.loaded) {
        if (sportsList && sportsList.length) {
            Sports = sportsList.map(
                (sport) =>
                    <div
                        onClick={ () => { this.handleSportItemClick(sport.alias); } }
                        className="single-sport-title-dashboard-m"
                        key={sport.id}>
                        <Link
                            className={this.props.sport === sport.alias ? "active" : ""}
                            to={ `/${this.props.isInLive ? "live" : "prematch"}/${sport.alias}` }
                            onClick={this.props.closeLeftMenu()}
                        >
                            <span className={"dashboard-sport-icon-m " + sport.alias}/>
                            <h5>{sport.name}</h5>
                            <span className="closed-open-arrow-m"/>
                        </Link>
                    </div>
            );
        }
        return (
            <div className="mini-sport-nav-box">
                {Sports}
                { /*
                 <div className="single-sport-title-dashboard-m more-sports">
                 <div className="dashboard-sport-icon-m more-sports"></div>
                 <h5>{t("More sports")}</h5>
                 <div className="more-sport-count-m"><span>+226</span></div>
                 </div>
                 */}

            </div>
        );
    }
    return <Loader/>;
};
