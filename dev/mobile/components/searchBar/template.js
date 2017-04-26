import React from 'react';
import {Link} from 'react-router';
import moment from "moment";
import Helpers from "../../../helpers/helperFunctions";
import Loader from "../loader/";
import Config from "../../../config/main";
import {t} from "../../../helpers/translator";
import CasinoSearchResult from "../casinoSearchResult";

module.exports = function searchBarTemplate () {
    // console.log("search props:", this.props);
    let self = this;

    /**
     * @name totalResults
     * @description get search total results 
     * @param {Object} results
     * @returns {Object}
     * */
    let totalResults = results => {
        var total = 0;
        results && Object.keys(results).map(id => {
            total += results[id].results.length;
        });
        return total;
    };
    return (
        <div className="search-wrapper-m">
            <div className="contain-search-view">
                <input type="search" ref="searchInput"
                       placeholder={this.props.type === "casino"
                       ? t("Search for a game")
                       : t("Search a competition or a team")
                       }
                       onChange={this.handleOnChange}/>
                <button className="closed-search-m" onClick={this.handleCloseBtn}/>
            </div>

            {/*Search result*/}

            {
                (function () {
                    if (self.props.swarmData.loaded.casinoSearchResults) {
                        return (
                            <CasinoSearchResult clearSearch={self.clearSearch.bind(self)} />
                        );
                    } else {
                        return (null);
                    }
                })()
            }
            {this.props.swarmData.loaded.searchResults !== undefined
                ? <div className="search-result-wrapper-m">
                    { this.props.swarmData.loaded.searchResults
                    ? <div className="search-result-view-contain">
                        <div className="search-result-title">
                        <h3>{t("Search results")} ({totalResults(this.props.swarmData.data.searchResults)})</h3>
                        <div className="closed-search-icon-m" onClick={this.clearSearch}></div>
                    </div>
                        <div className="search-all-info-contain">
                        <div className="search-result-box">
                            <div className="mini-wrapper-result-m">

                                {this.props.swarmData.data.searchResults ? Object.keys(this.props.swarmData.data.searchResults).map(
                                    sportId => {
                                        let sport = this.props.swarmData.data.searchResults[sportId];
                                        return <div className="separator-search-result" key={sportId}>
                                            <div className={"sport-title-result-m " + sport.alias}>
                                                <div className={"result-sport-icon " + sport.alias}></div>
                                                <h4>{sport.name}</h4>
                                            </div>
                                            {sport.results.sort(Helpers.byOrderSortingFunc).map(
                                                result => <Link
                                                    onClick={this.clearSearch}
                                                    to={`/${{0: "prematch", 1: "live", 2: "prematch"}[result.game.type]}/game/${result.game.id}`}
                                                    className="result-single-game-view-m" key={result.game.id}>
                                                    <p className="teams-name-result-m">
                                                        <span>{result.game.team1_name}</span>
                                                        {result.game.team2_name ? [" - ", <span
                                                            key="team2_name">{result.game.team2_name}</span>] : null}
                                                    </p>
                                                    <p className="flag-date-competition-m">
                                                        <span className={"flag-view-m icon-" + result.region.alias.toLowerCase().replace(/\s/g, '')}/>
                                                                <span className="additional-info-m">
                                                                    <i>
                                                                        {moment.unix(result.game.start_ts).format(Config.main.dateFormat)} {moment.unix(result.game.start_ts).format(Config.main.timeFormat)}
                                                                    </i>
                                                                    <i>{result.competition.name}</i>
                                                                </span>
                                                    </p>
                                                </Link>
                                            )}
                                        </div>;
                                    }
                                ) : ""}

                            </div>
                        </div>

                    </div>
                    </div>
                : <Loader/>
                }
                </div>
                : null}
            {/*Search result END*/}

        </div>
    );
};
