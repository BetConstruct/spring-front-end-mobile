import React from 'react';
import {t} from '../../../helpers/translator';
import Loader from "../../components/loader/";
import QuizListItem from "./pices/quizListItem";
import Config from "../../../config/main";

module.exports = function freeQuizTemplate () {
    if (!this.props.freeQuiz.loaded || (this.props.freeQuiz.loaded && !this.props.freeQuiz.data.victorinas)) {
        if (!this.props.freeQuiz.failed) {
            return <Loader />;
        } else {
            return null; //TODO create user friendly message;
        }
    }
    let victorinas = this.props.freeQuiz.data.victorinas;
    return (
        <div className="freequiz-wrapper">
            <div className="freequiz-provider-nav">
                <div className="title-separator-contain-b">
                    <h1>{t("Free Quiz")}</h1>
                    <div onClick={this.openInfo.bind(this, true)} className="freequiz-info-b" />
                </div>
            </div>
            {
                this.infoOpened && (
                    <div className="info-content-f">
                        <div className="header-freequize-i">
                        <span onClick={this.openInfo.bind(this, false)} />
                            <h2>{!Config.main.freeQuiz.disableLabel ? t("Free Quiz") : ""}</h2>
                        </div>
                        <div className="freequize-text-i">
                            <p>{t("Vivaro betting company offers its customers a free quiz.")}</p>
                            <p>{t("Customers will be offered 3 types of express, which contains 6, 8 or 10 events. If the customer guesses correctly 6 out of 6 events and the winning amount will be 7000 AMD, 8 out of 8 events the payout will be 15.000 AMD, and if you guess 10 out of 10 events the payoff will be 20.000 AMD. The winning amount will be transferred to the customer's account within 5 days after completion of all events are included in all 3 express bets.")}</p>
                            <p>{t("If there are events, which have not taken place in this variant of express, the quiz will be lost.")}</p>
                        </div>
                    </div>
                )
            }
            {
                this.props.reallyLoggedIn && Config.main.freeQuiz && !Config.main.freeQuiz.disableDaysFilter && (
                    <div className="events-i">
                        <ul>
                            <li>
                                {
                                    this.props.freeQuiz.filtersData.map((filter) => <span onClick={this.setDateFilter.bind(this, filter.day)}>{filter.text}</span>)
                                }
                            </li>
                            <li><span /></li>
                        </ul>
                    </div>
                )
            }
            {
                victorinas.map(id => <QuizListItem key={id} id={id}/>)
            }
        </div>
    );
};