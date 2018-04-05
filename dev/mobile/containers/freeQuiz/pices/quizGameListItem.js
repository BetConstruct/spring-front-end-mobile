import React, {Component} from "react";
import {connect} from "react-redux";
import moment from "moment";
import Config from "../../../../config/main";
import PropTypes from "prop-types";
import {ToggleSelectedEvents} from "../../../../actions/freeQuiz";
import Helpers from "../../../../helpers/helperFunctions";

class QuizGameListItem extends Component {

    toggleSelected (quizId, gameId, event) {
        return () => {
            event.event_id !== this.props.selected && this.props.dispatch(ToggleSelectedEvents({[gameId]: event.event_id}, quizId));
        };
    }

    render () {
        let {gameInfo, selected} = this.props;
        return (
            <div className="single-game-list-item-m">
                <div className="game-information-m freequiz">
                    <ul className="">
                        <li className="teams-name-info-m">
                            <a className="game-info-mini-m live" href="javascript:;">
                                {
                                    Helpers.CheckIfPathExists(Config, "main.freeQuiz.separateTeams")
                                        ? (() => {
                                            let temp = gameInfo.game_name.split("-");
                                            return temp.length > 1
                                                ? temp.map((teamName) => (
                                                    <p><span className="team-name-m-box"><i>{teamName}</i></span></p>))
                                                : (
                                                    <p><span className="team-name-m-box"><i>{gameInfo.game_name}</i></span></p>
                                                );
                                        })()
                                        : (
                                        <p><span className="team-name-m-box"><i>{gameInfo.game_name}</i></span></p>
                                    )
                                }
                                <span className="time-markets-count-m">
                                    <span className="time-view-game-m">
                                        <b className="b-row-view-m">{moment(gameInfo.game_start_date).format(Config.main.dateTimeFormat)}</b>
                                    </span>
                                    <span className="icons-game-info-m"/>
                                </span>
                            </a>
                        </li>

                        <li className="factor-m"
                            onClick={!gameInfo.have_bet && this.toggleSelected(this.props.quizId, this.props.gameId, gameInfo.events.p1)}>
                            <div
                                className={`single-coefficient-m${gameInfo.events.p1 ? (selected === gameInfo.events.p1.event_id) ? ' active' : '' : ''}`}>
                                <span><i>{gameInfo.events.p1 ? gameInfo.events.p1.k || gameInfo.events.p1.status : ''}</i></span>
                            </div>
                        </li>

                        <li className="factor-m"
                            onClick={!gameInfo.have_bet && this.toggleSelected(this.props.quizId, this.props.gameId, gameInfo.events.x)}>
                            <div
                                className={`single-coefficient-m${gameInfo.events.x ? (selected === gameInfo.events.x.event_id) ? ' active' : '' : ''}`}>
                                <span><i>{gameInfo.events.x ? gameInfo.events.x.k || gameInfo.events.x.status : ''}</i></span>
                            </div>
                        </li>

                        <li className="factor-m"
                            onClick={!gameInfo.have_bet && this.toggleSelected(this.props.quizId, this.props.gameId, gameInfo.events.p2)}>
                            <div
                                className={`single-coefficient-m${gameInfo.events.p2 ? (selected === gameInfo.events.p2.event_id) ? ' active' : '' : ''}`}>
                                <span><i>{gameInfo.events.p2 ? gameInfo.events.p2.k || gameInfo.events.p2.status : ''}</i></span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
}

QuizGameListItem.propTypes = {
    quizId: PropTypes.string.isRequired,
    gameId: PropTypes.string.isRequired,
    selected: PropTypes.string,
    gameInfo: PropTypes.object
};

export default connect((state, ownParams) => {
    return {
        gameInfo: state.freeQuiz.data[state.freeQuiz.day].victorinas[ownParams.quizId][ownParams.gameId],
        selected: state.freeQuiz.selected && state.freeQuiz.selected[ownParams.quizId] && state.freeQuiz.selected[ownParams.quizId][ownParams.gameId]
    };
})(QuizGameListItem);