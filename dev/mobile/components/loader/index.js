import React from 'react';

//stateless functional components
function Loader () {
    return (
        <div className="md-progress-circular md-theme">
            <div className="md-spinner-wrapper">
                <div className="md-inner">
                    <div className="md-gap"/>
                    <div className="md-left">
                        <div className="md-half-circle"/>
                    </div>
                    <div className="md-right">
                        <div className="md-half-circle"/>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Loader;