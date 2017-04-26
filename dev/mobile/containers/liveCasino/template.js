import React from 'react';
import {t} from '../../../helpers/translator';
// import {Link} from 'react-router';
import Loader from "../../components/loader/";

module.exports = function LiveCasinoTemplate () {
    let self = this,
        selectedProvider = self.props.casino.liveCasino.selectedProvider;

    if (self.props.casino.liveCasino.loaded && selectedProvider) {
        return (
            <div className="livecasino-wrapper">
                <div className="l-casino-menu-view">
                    <div className="l-casino-provider-nav">
                        <ul>
                            {
                                (function () {
                                    return Object.keys(self.props.casino.liveCasino.providers).map((providerName, index) => {
                                        return (
                                            <li key={index} onClick={() => { self.props.selectProvider(providerName); }}>
                                                <p className={selectedProvider === providerName ? 'active' : ''}>{t(providerName)}</p>
                                            </li>
                                        );
                                    });
                                })()
                            }
                        </ul>
                    </div>

                    {/*<div className="help-view-b">/!*active*!/ /!*() => { self.props.openHelp(); } TODO add click handler after solving issue with @Oxanna*!/
                        <span className="help-icon-view"/>
                    </div>*/}
                </div>

                <div className={`l-game-contain ${selectedProvider}`}>
                    {
                        (function () {
                            let studiIds = self.props.getStudiosList();
                            if (studiIds.length) {
                                return studiIds.map((id) => {
                                    let group = self.props.casino.liveCasino.providers[selectedProvider].filter((game) => {
                                        let market = game.markets;
                                        if (typeof market !== 'object') {
                                            market = JSON.parse(market);
                                        }
                                        return market.available.indexOf(id) !== -1;
                                    }).map((game) => {
                                        return (
                                            <div key={game.id || game.front_game_id} className="single-l-game">
                                                <div className="mini-separator-l">
                                                    <div className="screen-view-l-game">
                                                        <img src={game.icon_1 || game.icon_2 || game.icon_3} alt=""/>
                                                    </div>
                                                    <p className="title-single-game">{t(game.name)}</p>
                                                </div>
                                                <button type="button" onClick={ () => { self.props.openGame(game, id); }} className="button-view-normal-m">{t("Play")}</button>
                                            </div>
                                        );
                                    });
                                    return (
                                        <div key={id} className="l-casino-list-container">
                                            <div className="provider-title">
                                                <h2><span>{t(`Studio_${id}`)}</span></h2>
                                            </div>
                                            <div className="l-game-contain">
                                                {group}
                                            </div>
                                        </div>
                                    );
                                });
                            }
                            return self.props.casino.liveCasino.providers[selectedProvider].map((game) => {
                                return (
                                    <div key={game.id || game.front_game_id} className="single-l-game">
                                        <div className="mini-separator-l">
                                            <div className="screen-view-l-game">
                                                <img src={game.icon_1 || game.icon_2 || game.icon_3} alt=""/>
                                            </div>
                                            <p className="title-single-game">{t(game.name)}</p>
                                        </div>
                                        <button type="button" onClick={ () => { self.props.openGame(game); }} className="button-view-normal-m">{t("Play")}</button>
                                    </div>
                                );
                            });
                        })()
                    }

                </div>

            </div>
        );
    }
    return (<Loader/>);
};
