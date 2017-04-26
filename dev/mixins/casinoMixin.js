import React from 'react';
import {CmsLoadData, SelectCategory, SelectProvider} from '../actions/casino';
import {UICollapseElement, UIExpandElement, OpenPopup} from "../actions/ui"; //,
import Config from "../config/main";
import {HandleProviderClick, HandleOpenGameClick} from '../helpers/casino/helpers';

/**
 * @name CasinoMixin
 * @description CasinoMixin is a HOC(Higher Order Component) which adds additional properties and methods to wrapped component
 * @param {React.Component} ComposedComponent
 * @constructor
 */
var CasinoMixin = ComposedComponent => class CasinoMixin extends React.Component {

    constructor (props) {
        super(props);
        this.getFavoritesList = this.getFavoritesList.bind(this);
        this.loadMore = this.loadMore.bind(this);
        this.selectCategory = this.selectCategory.bind(this);
        this.openPopupForGame = this.openPopupForGame.bind(this);
        this.getCategoriesForSelectedProvider = this.getCategoriesForSelectedProvider.bind(this);
        this.selectProvider = HandleProviderClick.bind(this);
        this.openMostPopularGame = this.openMostPopularGame.bind(this);
    }

    componentDidMount () {
        (!this.props.casino.categoriesAndProviders.loaded && !this.props.casino.categoriesAndProviders.loading) && this.props.dispatch(CmsLoadData('getGroupedProviderOptions')); //eslint-disable-line react/prop-types
        (!this.props.casino.mostPopularGame.loaded && !this.props.casino.mostPopularGame.loading) && this.props.dispatch(CmsLoadData('mostPopularGame')); //eslint-disable-line react/prop-types
    }

    componentWillReceiveProps (nextProps) {
        let self = this;
        !self.inited && nextProps.casino.categoriesAndProviders && nextProps.casino.categoriesAndProviders.loaded && (function () {
            let providers = nextProps.casino.categoriesAndProviders.providers,
                keys,
                openByDefault;

            self.inited = true;
            if (nextProps.persistentUIState.expanded && (keys = Object.keys(nextProps.persistentUIState.expanded)).length) {
                for (let i = 0, length = keys.length; i < length; i++) {
                    if (keys[i].indexOf("casino_categories_") === 0 && nextProps.persistentUIState.expanded[keys[i]]) {
                        openByDefault = keys[i];
                        break;
                    }
                }
            }

            if (openByDefault) {
                (openByDefault = openByDefault.split("casino_categories_")[1].split("::"));
            } else {
                (openByDefault = [providers[0].categories[0].id, providers[0].name]) &&
                (self.props.dispatch(UIExpandElement("casino_categories_" + openByDefault[0] + "::" + openByDefault[1])));
            }

            if (!self.getFavoritesList().length && openByDefault[0] === openByDefault[1] && openByDefault[1] === 'favorite') {
                self.props.dispatch(UICollapseElement("casino_categories_" + openByDefault[0] + "::" + openByDefault[1]));
                openByDefault[0] = openByDefault[1] = 'all';
                self.props.dispatch(UIExpandElement("casino_categories_" + openByDefault[0] + "::" + openByDefault[1]));
            } else {
                self.getFavoritesList().length && (openByDefault[0] = openByDefault[1] = 'favorite') && (function () {
                    if (nextProps.persistentUIState.expanded && (keys = Object.keys(nextProps.persistentUIState.expanded)).length) {
                        for (let i = 0, length = keys.length; i < length; i++) {
                            if (keys[i].indexOf("casino_categories_") === 0 && nextProps.persistentUIState.expanded[keys[i]]) {
                                self.props.dispatch(UICollapseElement(keys[i]));
                            }
                        }
                    }
                    openByDefault[0] === openByDefault[1] && openByDefault[0] === 'favorite' && (self.props.dispatch(UIExpandElement("casino_categories_" + openByDefault[0] + "::" + openByDefault[1])));
                })();
            }
            self.props.dispatch(SelectCategory(openByDefault[0]));
            self.props.dispatch(SelectProvider(openByDefault[1] === 'favorite' ? 'all' : openByDefault[1]));
            openByDefault[0] !== 'favorite' && !self.props.casino.gamesList[`casino_categories_${openByDefault[0]}::${openByDefault[1]}`] && self.props.dispatch(CmsLoadData('getGames', openByDefault[0], openByDefault[1]));
        })();
    }

    /**
     * @name getCategoriesForSelectedProvider
     * @description It's a helper function to get a list of categories for selected provider
     * @returns {Array}
     */
    getCategoriesForSelectedProvider () {
        let self = this,
            i = 0,
            length = this.props.casino.categoriesAndProviders.providers.length, //eslint-disable-line react/prop-types
            temp = {};
        if (this.props.casino.selectedProvider === 'all') { //eslint-disable-line react/prop-types
            if (!this.allCategories) {
                this.allCategories = this.allCategories || [];
                this.props.casino.categoriesAndProviders.providers.map((provider) => { //eslint-disable-line react/prop-types
                    provider.categories.forEach((category) => {
                        if (!temp[category.id]) {
                            temp[category.id] = true;
                            self.allCategories.push(category);
                        }
                    });
                });
            }
            return self.allCategories;
        } else {
            for (; i < length; i++) {
                if (this.props.casino.categoriesAndProviders.providers[i].name === this.props.casino.selectedProvider) { //eslint-disable-line react/prop-types
                    return this.props.casino.categoriesAndProviders.providers[i].categories; //eslint-disable-line react/prop-types
                }
            }
            return [];
        }
    }

    /**
     * @name openPopupForGame
     * @description Opening popup witch includes two kind of option how to play real or fun
     * @returns {undefined}
     * @fire event:openPopup
     */
    openPopupForGame (game) {
        this.props.dispatch(OpenPopup("GamePopup", {game}));
    }

    /**
     * @name openMostPopularGame
     * @description Event listener function
     * @returns {undefined}
     */
    openMostPopularGame (game) {
        var self = this;
        HandleOpenGameClick.apply(this, [game, 'real', self.props.loggedIn, true]);
    }

    /**
     * @name getFavoritesList
     * @description Helper function to get a list of favorite games
     * @returns {Array}
     */
    getFavoritesList () {
        let self = this;
        return Object.keys(self.props.favorites.casinoGame);
    }

    /**
     * @name loadMore
     * @description Event listener function that loads more games for selected category
     * @returns {undefined}
     * @fire event:CmsLoadData
     */
    loadMore (currentWatchingList) {
        let self = this;
        this.props.dispatch(CmsLoadData('getGames', self.props.casino.selectedCategory, self.props.casino.selectedProvider, currentWatchingList.to, currentWatchingList.to + (Config.casino.games.loaderStep || 9)));
    }

    /**
     * @name selectCategory
     * @description Helper function to load games
     * @returns {*}
     * @fire event:CmsLoadData
     */
    selectCategory (categoryId, expanded) {
        expanded && this.props.dispatch(UICollapseElement(`casino_categories_${this.props.casino.selectedCategory}::${this.props.casino.selectedCategory === 'favorite' ? 'favorite' : this.props.casino.selectedProvider}`)); //eslint-disable-line react/prop-types
        this.props.dispatch(SelectCategory(categoryId));
        if (categoryId === 'favorite') {
            return;
        }
        if (this.props.casino.gamesList[`casino_categories_${categoryId}::${this.props.casino.selectedProvider}`]) { //eslint-disable-line react/prop-types
            return;
        }
        return this.props.dispatch(CmsLoadData('getGames', categoryId, this.props.casino.selectedProvider)); //eslint-disable-line react/prop-types
    }

    render () {
        return <ComposedComponent.Component
            {...this.props}
            {...this.state}
            getFavoritesList={this.getFavoritesList}
            getCategoriesForSelectedProvider={this.getCategoriesForSelectedProvider}
            loadMore={this.loadMore}
            openPopupForGame={this.openPopupForGame}
            openMostPopularGame={this.openMostPopularGame}
            selectProvider={this.selectProvider}
            selectCategory={this.selectCategory}
        />;
    }
};

CasinoMixin.propTypes = {
    favorites: React.PropTypes.object,
    casino: React.PropTypes.object,
    loggedIn: React.PropTypes.Boolean
};

export default CasinoMixin;