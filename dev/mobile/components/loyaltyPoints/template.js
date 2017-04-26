import React from 'react';
import {Link} from "react-router";
import Loader from "../../components/loader/";
import {t} from "../../../helpers/translator";
import {getUserLoyaltyStatus} from "../../../helpers/profile/loyalty";

function loyaltyTemplate () {
    console.log("loyalty template props", this.props);
    let displayLoyaltyPoints = () => {
        // let rate = this.props.ratesData[this.props.currencyId];
        let loyaltyStatus = getUserLoyaltyStatus(this.props.profile, this.props.levelsData);
        let points1 = loyaltyStatus.userCurrentStatus ? (360 * (loyaltyStatus.userCurrentStatus.MinPoint - this.props.profile.loyalty_last_earned_points) / (loyaltyStatus.userCurrentStatus.MinPoint || 1)) : 0;
        let points2 = (336 * (this.props.profile.loyalty_earned_points - this.props.profile.loyalty_point) / this.props.profile.loyalty_earned_points);
        return <div className="loyalty-points-j">
            <div className="lp-header-j Bronze {{pointsExchangeData.userCurrentStatus.Name}}">
                <div className="lp-status-panel-wrap-j">
                    <ul>
                        <li>
                            <div className="lp-current-status-j">
                                <ul>
                                    <li className="lp-current-status-icon-holder-j">
                                        <div><i/></div>
                                    </li>
                                    { loyaltyStatus.userCurrentStatus ? <li>
                                        <h1>{t(loyaltyStatus.userCurrentStatus.Name)}</h1>
                                        <h2>{loyaltyStatus.userCurrentStatus.MinPoint} + / <span>{t("Month")}</span></h2>
                                        <p>{t("Next status update")}</p>
                                        <h4>
                                            <span className={loyaltyStatus.userNextStatus.Name}>{t(loyaltyStatus.userNextStatus.Name)}</span>
                                            <icon className="cms-jcon-infou">
                                                <div className="tooltip-j">{t("Status updates take place at the end of each month")}</div>
                                            </icon>
                                            { loyaltyStatus.remainingDays ? <span>{t('In {1} days', loyaltyStatus.remainingDays)}</span> : null}
                                        </h4>
                                        <Link to="/bonus">{t("View Bonuses")}</Link>
                                    </li> : null}
                                </ul>
                            </div>
                        </li>
                        <li>
                            <div className="lp-circle-wrapper-j">
                                <div className="lp-circle-group-w-j">
                                    <svg width="108" height="108">
                                        <circle r="53" cx="54" cy="54" strokeDasharray={ points1 + ",600"}/>
                                    </svg>
                                    <div className="lp-circle-j">

                                        <div>
                                            <p>{this.props.profile && this.props.profile.loyalty_last_earned_points}</p>
                                            <small>{loyaltyStatus.userCurrentStatus && loyaltyStatus.userCurrentStatus.MinPoint}+</small>
                                        </div>
                                    </div>

                                </div>
                                <h3>{t("Month points")}</h3>
                                <p>{t("Pack Minimum")}</p>
                                <icon className="cms-jcon-infou">
                                    <div className="tooltip-j">{t("Number of points received during the current month")}</div>
                                </icon>
                            </div>
                        </li>

                        <li>
                            <div className="lp-circle-wrapper-j">
                                <div className="lp-circle-group-w-j">
                                    <svg width="108" height="108">
                                        <circle r="53" cx="54" cy="54" strokeDasharray={ points2 + ", 600"}/>
                                    </svg>
                                    <div className="lp-circle-j">

                                        <div>
                                            <p>{ this.props.profile && this.props.profile.loyalty_point }</p>
                                            <small>{ this.props.profile && this.props.profile.loyalty_earned_points }</small>
                                        </div>
                                    </div>

                                </div>
                                <h3>{t("Exchangeable")}</h3>
                                <p>{t("All time")}</p>
                                <icon className="cms-jcon-infou">
                                    <div className="tooltip-j">{t("Total number of exchangeable points")}</div>
                                </icon>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="lp-progress-bar-j">
                <div className="lp-progress-j"><span style={{width: loyaltyStatus.progressValue + "%"}} data-progress={this.props.profile.loyalty_last_earned_points}/></div>
                <ul className="lp-packs-wrap-j">
                    {this.props.levelsData.map(program => <li key={program.Id}>{program.MinPoint}</li>)}
                </ul>
            </div>
            <div className="lp-packs-group-wrap-j">
                <ul className="lp-packs-wrap-j">
                    {this.props.levelsData.map(program => <li key={program.Id}>
                        <div className={"lp-pack-wrap-j " + program.Name /* + (selectedProgram.Id === program.Id ? 'active' : "")*/ }>
                            <div className="lp-pack-icon-j"></div>
                            <h2>{t(program.Name)}</h2>
                            <p>{program.MinPoint} + / <span>{t("Month")}</span></p>
                        </div>
                    </li>)}
                </ul>

            </div>
        </div>;
    };

    return (
        <div className="loyalty-page-wrapper">
            <div className="loyalty-wrapper">
                <h1>{t("Loyalty Points")}</h1>
                {(this.props.levelsLoaded && this.props.ratesLoaded && this.props.profile) ? displayLoyaltyPoints() : <Loader/>}
            </div>
        </div>
    );
}
module.exports = loyaltyTemplate;

