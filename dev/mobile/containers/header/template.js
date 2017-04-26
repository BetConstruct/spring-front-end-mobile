import React from 'react';
import {Link} from 'react-router';
import Swipeable from 'react-swipeable';

module.exports = function headerTemplate () {
    return (
        <div className={"header-wrapper-m " + (this.props.loggedIn ? "logged-in" : "")}>
            <div className="import-view-container">
                <div className="header-construction">
                    <div className="header-separator-m">
                        <Swipeable className="sw-contain-b" onSwipingRight={this.props.openLeftMenu()}>
                            <label className="left-top-nav" onClick={this.props.openLeftMenu()}>
                                <span>Menu</span>
                            </label>
                        </Swipeable>

                        <Swipeable className="logo-wrapper-m" onSwipingRight={this.props.openLeftMenu()} onSwipingLeft={this.props.openRightMenu()}>
                            <Link to="/">logo</Link>
                        </Swipeable>
                        <Swipeable className="sw-contain-b" onSwipingLeft={this.props.openRightMenu()}>
                            <label className="right-top-nav" onClick={this.props.openRightMenu()}>
                                <span/>
                            </label>
                        </Swipeable>
                    </div>
                </div>
            </div>
        </div>
    );
};
