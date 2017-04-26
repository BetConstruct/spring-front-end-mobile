import React from 'react';
import GameAnimation from "../../../components/gameAnimation/";
import GameVideo from "../gameVideo/";
import {t} from "../../../helpers/translator";

module.exports = function gameAnimationTemplate () {
    if (!this.props.hasAnimation && !this.props.hasVideo || !this.props.game.is_started) {
        return (null);
    }

    return (
        <div className="animation-video-wrapper">
            <div className={`animation-v-nav-view ${this.toggleEnabled ? 'collapsed' : 'expanded'}`}>
                <div className="tab-video-nav-b">
                {
                    (this.props.hasVideo && this.props.game.is_started)
                        ? (<div className={`video-animation-button-m ${(this.activeTab === 'video' && this.props.hasAnimation) ? 'active' : ''}`} onClick={() => { this.toggleTab('video'); }}>{t("Video")}</div>)
                        : (null)
                }

                {
                    (this.props.hasAnimation)
                        ? (<div className={`video-animation-button-m ${(this.activeTab === 'animation' && this.props.hasVideo) ? 'active' : ''}`} onClick={() => { this.toggleTab('animation'); }}>{t("Animation")}</div>)
                        : (null)
                }
                </div>
                <div className="arrow-toggle-view" onClick={() => { this.toggleExpanded(); }}/>
            </div>
            <div className="wrapper-v-a-view">
                {(() => {
                    switch (this.activeTab) {
                        case 'animation':
                            return (<GameAnimation game={this.props.game} sport={this.props.sport.alias}/>);
                        case 'video':
                            return (<GameVideo streamURL={this.props.streamURL} loggedIn={this.props.loggedIn} balance={this.props.balance}/>);
                        default :
                            return (null);
                    }
                })()}
            </div>
        </div>
    );
};
