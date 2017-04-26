import React from 'react';
import Expandable from "../../containers/expandable/";
import {t} from "../../../helpers/translator";
import Loader from "../../components/loader/";

module.exports = function casinoTemplate () {
    let self = this;
    if (!self.props.casino.categoriesAndProviders.failed && self.props.casino.selectedCategory && self.props.casino.selectedProvider) {
        return (
            <div className="casino-wrapper">
                {
                    (function () {
                        if (self.props.casino.mostPopularGame.loaded && self.props.casino.mostPopularGame.data && self.props.casino.mostPopularGame.data.instance) {
                            return (
                                <div className="top-banner-container">
                                    <img src={self.props.casino.mostPopularGame.data.instance.image} alt=""/>
                                    <p className="game-play-button-view"
                                    onClick={ () => {
                                        self.props.openMostPopularGame(self.props.casino.mostPopularGame.data.instance);
                                    } }>Play now</p>
                                </div>
                            );
                        } else if (self.props.casino.mostPopularGame.failed) {
                            return null;
                        } else if (self.props.casino.mostPopularGame.loading) {
                            return <Loader/>;
                        } else {
                            return null;
                        }
                    })()
                }
                <div className="provider-menu">
                    <ul>
                        {
                            (
                                this.props.casino.categoriesAndProviders &&
                                this.props.casino.categoriesAndProviders.loaded &&
                                this.props.casino.categoriesAndProviders.providers.length > 1
                            ) ? (
                                this.props.casino.categoriesAndProviders.providers.map((provider, index) => {
                                    return (
                                        <li key={index} onClick={() => {
                                            this.props.selectProvider(provider.name);
                                        }}>
                                            <p className={this.props.casino.selectedProvider === provider.name ? 'active' : ''}>{t(provider.title)}</p>
                                        </li>
                                    );
                                })
                            ) : (!this.props.casino.categoriesAndProviders.loaded) ? (<Loader/>) : (null)
                        }
                    </ul>
                </div>
                <div className="casino-games-list-view">
                    {
                        (function () {
                            let gamesList = self.props.getFavoritesList();
                            if (gamesList.length) {
                                return (
                                    <div className="single-game-type-list" key="favorites">
                                        <Expandable className="title-game-type-box"
                                                    handleToggleEvent={(expanded) => { self.props.selectCategory('favorite', expanded); }}
                                                    uiKey={`casino_categories_favorite::favorite`}>
                                            <p>{t('Favorites')}</p>
                                            <span className="arrow-view-open-box"/>
                                        </Expandable>
                                        <div className="casino-games-list">
                                            {gamesList.map((key, index) => {
                                                let game = self.props.favorites.casinoGame[key];
                                                return (
                                                    <div className="single-casino-game-view" key={index}>
                                                        <div className="casino-game-info-view">
                                                            <span className="game-screen-view"
                                                                  onClick={() => {
                                                                      self.props.openPopupForGame(game);
                                                                  }}>
                                                                <img src={game.icon_1}/>
                                                            </span>
                                                            <p className="casino-game-title">
                                                                <b>{t(game.name)}</b>
                                                                <i
                                                                    className={"favorite-game-star" + (self.props.isCasinoGameFavorite(game.id) ? " active" : "")}
                                                                    onClick={self.props.toggleCasinoGameFavorite(game.id, game)}
                                                                />
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                    </div>
                                );
                            } else {
                                return (null);
                            }
                        })()
                    }

                    {
                        this.props.getCategoriesForSelectedProvider().map((category, index) => {
                            let loadingGames = this.props.casino.gamesList[`casino_categories_${category.id}::${this.props.casino.selectedProvider}`];
                            let gamesList = loadingGames &&
                            loadingGames.list &&
                            loadingGames.list.length
                                ? loadingGames.list.map((game, index) => {
                                    return (
                                        <div className="single-casino-game-view" key={index}>
                                            <div className="casino-game-info-view">
                                                    <span className="game-screen-view"
                                                          onClick={() => {
                                                              this.props.openPopupForGame(game);
                                                          }}>
                                                        <img src={game.icon_1 || game.icon_2}/>
                                                    </span>
                                                <p className="casino-game-title">
                                                    <b>{t(game.name)}</b>
                                                    <i
                                                        className={"favorite-game-star" + (this.props.isCasinoGameFavorite(game.id) ? " active" : "")}
                                                        onClick={this.props.toggleCasinoGameFavorite(game.id, game)}
                                                    />
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })
                                : (null);

                            return (
                                <div className="single-game-type-list" key={index}>
                                    <Expandable className="title-game-type-box" handleToggleEvent={(expanded) => { this.props.selectCategory(category.id, expanded); }}
                                                uiKey={`casino_categories_${category.id}::${this.props.casino.selectedProvider}`}>
                                        <p>{t(category.title)}</p>
                                        <span className="arrow-view-open-box"/>
                                    </Expandable>
                                    <div className="casino-games-list">
                                        {gamesList}
                                        {
                                            (() => {
                                                if (gamesList && loadingGames.list.length < loadingGames.to) {
                                                    return (null);
                                                }
                                                return (
                                                    <div className="see-all-games">
                                                        {
                                                            gamesList
                                                                ? (
                                                                    <button disabled={loadingGames.loading} onClick={() => { this.props.loadMore(loadingGames); }} className="button-view-normal-m trans-m">
                                                                        {t("Load more")}
                                                                    </button>
                                                                )
                                                                : loadingGames && loadingGames.loading
                                                                ? <Loader/>
                                                                : (
                                                                <button disabled="disabled" className="button-view-normal-m trans-m">
                                                                    {t("There are no games found for {1} provider", this.props.casino.selectedProvider)}
                                                                </button>
                                                            )
                                                        };
                                                    </div>
                                                );
                                            })()
                                        };
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>

            </div>
        );
    }
    return (null);
};
