import React from 'react';

//stateless functional component
function HorizontalLoader () {
    return (
        <span className="spinner">
            <i className="bounce1"></i>
            <i className="bounce2"></i>
            <i className="bounce3"></i>
        </span>
    );
}
export default HorizontalLoader;