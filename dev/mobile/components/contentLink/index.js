import React from 'react';
import PropTypes from 'prop-types';

export default function ContentLink ({title, isLiveChat}) {

    /**
     * @name clickHandler
     * @description open contact support
     * @returns {undefined}
     * */
    function clickHandler () {
        isLiveChat && window.openContactSupport && window.openContactSupport();
    }

    return <a href="javascript:;" onClick={() => {
        clickHandler();
    }}>{title}</a>;
}

ContentLink.propTypes = {
    title: PropTypes.string.isRequired,
    isLiveChat: PropTypes.bool.isRequired
};