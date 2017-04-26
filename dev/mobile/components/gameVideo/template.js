import React from 'react';
import Config from "../../../config/main";
import {t} from "../../../helpers/translator";

import posterImg from "../../../images/video_poster.png";

module.exports = function gameVideoTemplate () {
    // console.log("game video props", this.props);
    return (
        <div className="game-video">
            {this.props.loggedIn ? null : <p>{t("Please login to be able to play video.")}</p>}
            {(this.props.loggedIn && !(this.props.balance > 0)) ? <p>{t("You need to have non-zero balance to be able to play video.")}</p> : null}
            { (this.props.loggedIn && this.props.balance > 0)
                ? <div>
                    {this.props.streamURL
                        ? <video id="live_game_video" src={this.props.streamURL} controls poster={posterImg} autoPlay={Config.main.video.autoPlay}>
                            {t("Playing video is not supported in this browser")}
                        </video>
                        : <p>{t("Cannot play video, please try later")}</p> }
                </div>
                : null }
        </div>
    );
};
