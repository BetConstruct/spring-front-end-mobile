import React, {Component} from "react";
import {connect} from "react-redux";
import {MakeQuizListItemSelector} from "../../../../helpers/selectors";
import QuizGameListItem from "./quizGameListItem";
import PropTypes from "prop-types";
import {DoFreeQuizBet, GetFreeQuizData, SetQuizDateFilter, SetSelectedEvents} from "../../../../actions/freeQuiz";
import {t} from "../../../../helpers/translator";
import {OpenPopup} from "../../../../actions/ui";

function getRandomGeneratedEvent (i, selected) {
    let data = this.props.data,
        keys = Object.keys(data[i].events),
        randomGenerated = Math.floor(Math.random() * keys.length);

    if (selected && selected[data[i].gameId] && data[i].events[keys[randomGenerated]].event_id === selected[data[i].gameId]) {
        return getRandomGeneratedEvent.apply(this, [i, selected]);
    }
    return {
        [data[i].gameId]: data[i].events[keys[randomGenerated]].event_id
    };
}

class QuizListItem extends Component {

    shouldComponentUpdate (nextProps) {
        return this.props.data !== nextProps.data || Object.keys(nextProps.selectedEvents).length === nextProps.data.length ||
            (this.props.selectedEvents && nextProps.selectedEvents &&
            (Object.keys(this.props.selectedEvents).length === this.props.data.length && Object.keys(nextProps.selectedEvents).length !== nextProps.data.length));
    }

    favoriteChoose () {
        let data = this.props.data,
            length = data.length,
            favorites = {};

        for (let i = 0; i < length; i++) {
            let min = Infinity, choose = {};
            Object.keys(data[i].events).map((key) => {
                if (+data[i].events[key].k < min) {
                    min = data[i].events[key].k;
                    choose = {[data[i].gameId]: data[i].events[key].event_id};
                }
            });
            favorites = {
                ...favorites,
                ...choose
            };
        }
        this.props.dispatch(SetSelectedEvents({[this.props.id]: favorites}));
    }

    componentWillUnmount () {
        this.props.dispatch(SetSelectedEvents({[this.props.id]: {}}));
    }

    makeQuizBet () {
        if (!this.props.reallyLoggedIn) {
            return this.props.dispatch(OpenPopup("LoginForm"));
        }
        let selections = [];
        Object.keys(this.props.selectedEvents).map((gameId) => {
            let temp = {
                [gameId]: +this.props.selectedEvents[gameId]
            };
            selections.push(temp);
        });
        this.props.dispatch(DoFreeQuizBet({selections: selections, victorina_id: this.props.id}, this.handleBetResult.bind(this)));
    }

    handleBetResult (result) {
        this.props.dispatch(GetFreeQuizData({day: 0}));
        this.props.dispatch(SetQuizDateFilter(0));
        this.props.dispatch(
            OpenPopup("message", {
                title: t("Quiz Bet"),
                type: (result.result !== 0) ? 'warning' : 'accept',
                body: result.result === 0
                    ? t("Your Bet request is accepted.")
                    : ('message_' + result.result) !== t('message_' + result.result)
                        ? t('message_' + result.result)
                        : t("Your is not accepted.")
            })
        );
    }

    randomChoose () {
        let randomSelections = {},
            length = this.props.data.length;
        for (let i = 0; i < length; i++) {
            randomSelections = {
                ...randomSelections,
                ...getRandomGeneratedEvent.apply(this, [i, this.props.selectedEvents])
            };
        }
        this.props.dispatch(SetSelectedEvents({[this.props.id]: randomSelections}));
    }
    render () {
        let data = this.props.data,
            disableBet = false,
            disableFavoriteButton;
        if (!(data || data.length)) {
            return null;
        }
        this.props.data.map((gameInfo) => {
            !disableBet && (disableBet = gameInfo.have_bet);
            let keys = gameInfo.events && gameInfo.events.constructor === Object && Object.keys(gameInfo.events);
            !disableFavoriteButton && (disableFavoriteButton = keys.reduce((initial, current) => !initial ? isNaN(gameInfo.events[current].k) : initial, false));
        });
        return (
            <div className="list-games-m">
                <div className="game-date-view-m">
                    <ul>
                        <li><p className="live-game-competition-m"><span className="flag-view-m icon-world" /># {this.props.id}</p></li>
                    </ul>
                </div>
                <div className="date-list-games-m">
                    {
                        this.props.data.map((gameInfo) => {
                            return <QuizGameListItem quizId={this.props.id} gameId={gameInfo.gameId}/>;
                        })
                    }
                </div>
                {
                    !disableBet && (
                        <div className="freequize-button-container">
                            <button type="button" className="button-view-normal-m" onClick={this.randomChoose.bind(this)}>{t("Random choose")}</button>
                            { !disableFavoriteButton && (<button type="button" className="button-view-normal-m trans-m fav" onClick={this.favoriteChoose.bind(this)}><span>{t("Favourite Choose")}</span></button>) }
                            <button type="button" className="button-view-normal-m trans-m"
                                    onClick={this.makeQuizBet.bind(this)}
                                    disabled={!this.props.selectedEvents || (this.props.selectedEvents && Object.keys(this.props.selectedEvents).length !== data.length)}>{t("Place Bet")}</button>
                        </div>
                    )
                }
            </div>
        );
    }
}

QuizListItem.propTypes = {
    id: PropTypes.string.isRequired,
    data: PropTypes.array.isRequired,
    reallyLoggedIn: PropTypes.bool,
    selectedEvents: PropTypes.object,
};

const makeMapStateToProps = (state, ownParams) => {
    const getQuizListItem = MakeQuizListItemSelector(ownParams.id);
    return (state, props) => {
        return {
            reallyLoggedIn: state.user.reallyLoggedIn,
            data: getQuizListItem(state, props),
            selectedEvents: state.freeQuiz.selected[ownParams.id]
        };
    };
};

export default connect(makeMapStateToProps)(QuizListItem);