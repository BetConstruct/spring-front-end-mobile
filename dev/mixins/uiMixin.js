import React from 'react';
import {OpenPopup, ClosePopup, UIOpen, UIClose} from "../actions/ui";

/**
 * UIMixin is a HOC(Higher Order Component) which adds possibility for component to call UI related actions.
 * Methods are added to wrapped components "props", i.e. they should be called like onClick={this.props.uiMethod()}
 *
 * To enable the functionality component should be "wrapped" by UIMixin, i.e. you should use
 * UIMixin({Component: YourComponent}) instead of just YourComponent.
 *
 * @param ComposedComponent
 * @constructor
 */
export var UIMixin = ComposedComponent => class UIMixin extends React.Component {
    openPopup (popup, additionalParams = null) {
        return () => this.dispatch(OpenPopup(popup, additionalParams));
    }
    closePopup () {
        return () => this.dispatch(ClosePopup(this.popupParams && this.popupParams.additionalCloseCallback && this.popupParams.additionalCloseCallback()));
    }
    openBetslip () {
        return () => this.dispatch(UIOpen("betslip"));
    }
    openLeftMenu () {
        return () => this.dispatch(UIOpen("leftMenu"));
    }
    openRightMenu () {
        return () => this.dispatch(UIOpen("rightMenu"));
    }
    closeRightMenu () {
        return () => this.dispatch(UIClose("rightMenu"));
    }
    closeLeftMenu () {
        return () => this.dispatch(UIClose("leftMenu"));
    }
    closeBetslip () {
        return () => this.dispatch(UIClose("betslip"));
    }
    uiClose (key) {
        return () => this.dispatch(UIClose(key));
    }
    uiOpen (key) {
        return () => this.dispatch(UIOpen(key));
    }

    render () {
        return <ComposedComponent.Component {...this.props} {...this.state}
            openPopup={this.openPopup}
            closePopup={this.closePopup}
            closeRightMenu={this.closeRightMenu}
            closeLeftMenu={this.closeLeftMenu}
            openLeftMenu={this.openLeftMenu}
            openRightMenu={this.openRightMenu}
            openBetslip={this.openBetslip}
            closeBetslip={this.closeBetslip}
            uiClose={this.uiClose}
            uiOpen={this.uiOpen}
        />;
    }
};