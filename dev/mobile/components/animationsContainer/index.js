import React from "react";
import Config from '../../../config/main';
import PropTypes from 'prop-types';

let attempt = 0;

/**
 * @name playVideo
 * @description helper function to play video
 * @param resetCounter
 * @returns {undefined}
 * */
const playVideo = (resetCounter) => {
    resetCounter && (attempt = 0);
    attempt++;
    setTimeout(function () {
        let video = document.getElementById("live_game_video");
        if (video) {
            video.pause();
            Config.main.video.autoPlay && video.play();
            attempt = 0;
        } else {
            attempt < 25 ? playVideo() : null;
        }
    }, 200);
};


/**
 * @name pauseVideo
 * @description  pause video function
 * @returns {undefined}
 * */
const pauseVideo = () => {
    let video = document.getElementById("live_game_video");
    if (video) {
        video.pause();
    }
};

const AnimationsContainer = React.createClass({

    /**
     * @name toggleTab
     * @description  activating video tab and playing video if tab's type is video
     * @param tab
     * @returns {undefined}
     * */
    toggleTab (tab) {
        this.activeTab = tab;
        if (tab === 'video' && !this.toggleEnabled) {
            playVideo();
        }
        this.forceUpdate();
    },

    /**
     * @name toggleExpanded
     * @description function which is forcing to update the component for opening video
     * @returns {undefined}
     * */
    toggleExpanded () {
        if (this.activeTab === 'video') {
            !this.toggleEnabled ? pauseVideo() : playVideo(true);
        }
        this.toggleEnabled = !this.toggleEnabled;
        this.forceUpdate();
    },
    componentWillMount () {
        this.activeTab = this.props.hasAnimation ? 'animation' : 'video';
        if (this.activeTab === 'video') {
            this.toggleEnabled = true;
        }
    },
    componnentWillUnmount () {
        let video = document.getElementById("live_game_video");
        video && video.pause();
    },
    render () {
        return Template.apply(this); //eslint-disable-line no-undef
    }
});

AnimationsContainer.propTypes = {
    hasVideo: PropTypes.bool.isRequired,
    videoLoadStarted: PropTypes.bool.isRequired,
    loggedIn: PropTypes.bool.isRequired,
    balance: PropTypes.number.isRequired,
    hasAnimation: PropTypes.bool.isRequired,
    streamURL: PropTypes.string.isRequired,
    game: PropTypes.object.isRequired,
    sport: PropTypes.string.isRequired
};

export default AnimationsContainer;