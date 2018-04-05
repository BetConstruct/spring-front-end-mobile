import React from 'react';
import {CmsLoadData, SelectLiveCasinoProvider} from '../actions/casino';
import {HandleOpenGameClick} from '../helpers/casino/helpers';
import {OpenPopup} from "../actions/ui";
import Config from "../config/main";
import PropTypes from 'prop-types';

/**
 * @name LiveCasinoMixin
 * @description CasinoMixin is a HOC(Higher Order Component) which adds additional properties and methods to wrapped component
 * @param {React.Component} ComposedComponent
 * @constructor
 */
const LiveCasinoMixin = ComposedComponent => class LiveCasinoMixin extends React.Component {

    constructor (props) {
        super(props);
        this.selectProvider = this.selectProvider.bind(this);
        this.openGame = this.openGame.bind(this);
        this.getStudiosList = this.getStudiosList.bind(this);
        this.openHelp = this.openHelp.bind(this);
    }

    /**
     * @name openHelp
     * @description redirecting to casino help page
     */
    openHelp () {
        let config = Config.liveCasino;
        // this.props.dispatch(OpenPopup("iframe", {
        //     title: t("Rules"),
        //     iframeUrl: `${config.helpUrl}?clv=${config.clv}&drg=${config.drg}&lang=${Config.env.lang}`
        // }));
        //TODO: replace window.open below with commented code above when CSS is done
        window.open(`${config.helpUrl}?clv=${config.clv}&drg=${config.drg}&lang=${Config.env.lang}`);
    }

    componentDidMount () {
        !this.props.casino.liveCasino.loaded && !this.props.casino.liveCasino.loading && this.props.dispatch(CmsLoadData('getLiveCasinoGames'));  //eslint-disable-line react/prop-types
    }

    componentWillReceiveProps (nextProps) {
        let self = this;
        !self.inited && nextProps.casino.liveCasino && nextProps.casino.liveCasino.loaded && (function () {
            let providers = nextProps.casino.liveCasino.providers,
                providersNames = Object.keys(providers);

            self.props.dispatch(SelectLiveCasinoProvider(providersNames[0]));
            self.inited = true;
        })();
        if (!this.props.reallyLoggedIn && nextProps.reallyLoggedIn && this.bufferedAction) {
            this.openGame(this.bufferedAction.game, this.bufferedAction.studioId, true);
            this.bufferedAction = undefined;
        }
    }

    /**
     * @name selectProvider
     * @description Switch between providers
     * @fire event:selectLiveCasinoProvider
     */
    selectProvider (providerName) {
        this.props.dispatch(SelectLiveCasinoProvider(providerName));
    }

    /**
     * @name getStudiosList
     * @description Helper function to separate studio ids
     * @returns {Array} array of studio ids
     */
    getStudiosList () {
        let self = this,
            selectedProvider = self.props.casino.liveCasino.selectedProvider,
            currentProviderGamesList = self.props.casino.liveCasino.providers[selectedProvider],
            studioIds = [],
            retValue = [];

        currentProviderGamesList.forEach((game) => {
            let market = game.markets;

            if (market && typeof market !== 'object') {
                market = JSON.parse(market);
            }
            if (market && market.available && market.available.length) {
                studioIds = studioIds.concat(market.available);
            }
        });

        studioIds.forEach((id) => {
            retValue.indexOf(id) === -1 ? retValue.push(id) : '';
        });

        return retValue;
    }

    /**
     * @name openGame
     * @description Helper function for handle click and open login form if user not logged in or process to open game
     * @param {object} game
     * @param {string|number} studioId
     * @param {boolean} forceToOpen
     * @fire event:openPopup
     */
    openGame (game, studioId, forceToOpen) {
        if (!this.props.reallyLoggedIn && !forceToOpen) { //eslint-disable-line react/prop-types
            this.bufferedAction = {
                game,
                studioId
            };
        }

        if (this.props.reallyLoggedIn || forceToOpen) {  //eslint-disable-line react/prop-types
            HandleOpenGameClick.apply(this, [game, 'real', this.props.reallyLoggedIn || forceToOpen || false, false, studioId]);  //eslint-disable-line react/prop-types
        } else if (game.types.viewMode === 1) {
            HandleOpenGameClick.apply(this, [game, 'fun', this.props.reallyLoggedIn, false, studioId]);  //eslint-disable-line react/prop-types
        } else {
            this.props.dispatch(OpenPopup("LoginForm"));
        }
    }

    render () {
        return <ComposedComponent.Component
            {...this.props}
            {...this.state}
            selectProvider={this.selectProvider}
            openGame={this.openGame}
            openHelp={this.openHelp}
            getStudiosList={this.getStudiosList}
        />;
    }
};

LiveCasinoMixin.propTypes = {
    casino: PropTypes.object.isRequired,
    reallyLoggedIn: PropTypes.bool
};

export default LiveCasinoMixin;