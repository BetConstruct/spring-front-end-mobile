import React from 'react';
import {t} from '../../../helpers/translator';

module.exports = function CasinoSearchResultsTemplate () {
    return (
        <div className="search-result-wrapper-m">
            <div className="search-result-view-contain">
                <div className="search-result-title">
                    <h3>{t("Search results")} ({this.props.results.total_count})</h3>
                    <div className="closed-search-icon-m" onClick={this.closeSearch}></div>
                </div>
                <div className="search-all-info-contain">
                    <div className="search-result-box">
                        <div className="mini-wrapper-result-m">
                            {
                                this.props.results.games.map((game) => {
                                    return (
                                        <div className="single-game-item-c">
                                            <ul>
                                                <li>
                                                    <img src={game.icon_1 || game.icon_2} alt=""/>
                                                </li>
                                                <li>
                                                    <p className="results-game-title">{t(game.name)}</p>
                                                    <div className="r-b-view">
                                                        <button onClick={ () => {
                                                            this.openGame(game);
                                                        } } type="button" className="button-view-normal-m">{t("Play")}</button>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    );
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};