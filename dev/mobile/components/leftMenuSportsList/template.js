import React from 'react';
import {Link} from 'react-router';
import Loader from "../loader/";
import Expandable from "../../../../dev/mobile/containers/expandable/";
import Config from "../../../../dev/config/main";
// import {t} from "../../../helpers/translator";

module.exports = function leftMenuSportsListTemplate () {
    var Sports = [],
        Esports = [],
        sportsList = this.props.data;
    let eSports = Config.betting && Config.betting.eSportsIdList;
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

            if (eSports) {
                Esports = sportsList.map(
                    (esport) =>
                        eSports.indexOf(esport.id) !== -1
                            ? <div
                                onClick={ () => { this.handleSportItemClick(esport.alias); } }
                                className="single-sport-title-dashboard-m"
                                key={esport.id}>
                                <Link
                                    className={this.props.sport === esport.alias ? "active" : ""}
                                    to={ `/${this.props.isInLive ? "live" : "prematch"}/${esport.alias}` }
                                    onClick={this.props.closeLeftMenu()}
                                >
                                    <span className={"dashboard-sport-icon-m " + esport.alias}/>
                                    <h5>{esport.name}</h5>
                                    <span className="closed-open-arrow-m"/>
                                </Link>
                            </div>
                            : null
                );
            }
        }
        return (
            <div className="mini-sport-nav-box">
                {
                    eSports && <div className="promotions">
                        <Expandable className="title-row-u-m" uiKey="rm_promo">
                            <div className="icon-view-u-m sport-view-m"/>
                            <p><span>E-sports</span>
                            </p>
                            <i className="arrow-u-m"/>
                        </Expandable>
                        <div className="open-view-single-u-m">
                            {Esports}
                        </div>
                    </div>
                }
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
