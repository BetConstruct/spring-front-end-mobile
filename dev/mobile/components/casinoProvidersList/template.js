import React from 'react';
import {t} from '../../../helpers/translator';
import {HandleProviderClick} from '../../../helpers/casino/helpers';
import {SelectLiveCasinoProvider} from '../../../actions/casino';

module.exports = function ProvidersList () {
    let self = this;
    return (
        <div className="provider-left-menu">
            {
                (() => {
                    if (self.props.isInLive) {
                        return self.props.casino.liveCasino.loaded
                            ? Object.keys(self.props.casino.liveCasino.providers).map((providerName, index) => {
                                return (
                                    <div
                                        onClick={() => {
                                            self.props.dispatch(self.props.closeLeftMenu(self.props.dispatch(SelectLiveCasinoProvider(providerName))));
                                        }}
                                        key={index} className="menu-provider-view">
                                        <p className={self.props.casino.liveCasino.selectedProvider === providerName ? 'active' : ''}>
                                            <i>{t(providerName)}</i>
                                            <span className="arrow-view-nav"/></p>
                                    </div>
                                );
                            })
                            : (null);
                    } else {
                        return self.props.casino.categoriesAndProviders.loaded && self.props.casino.categoriesAndProviders.providers.map((provider, index) => {
                            return (
                                <div
                                    onClick={() => {
                                        HandleProviderClick.apply(this, [provider.name, function () { self.props.dispatch(self.props.closeLeftMenu()); }]);
                                    }}
                                    key={index} className="menu-provider-view">
                                    <p className={self.props.casino.selectedProvider === provider.name ? 'active' : ''}>
                                        <i>{t(provider.title)}</i>
                                        <span className="arrow-view-nav"/></p>
                                </div>
                            );
                        });
                    }
                })()
            }
        </div>
    );
};