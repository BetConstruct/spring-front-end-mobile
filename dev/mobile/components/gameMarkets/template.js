import React from 'react';
import Helpers from "../../../helpers/helperFunctions";
import {niceEventName} from "../../../helpers/sport/eventNames";
import Event from "../../components/event/";
import Expandable from "../../containers/expandable/";
import {t} from "../../../helpers/translator";

module.exports = function gameMarketsTemplate () {

    let isCashOutEnabledForPartner = this.props.partnerConfig && ((this.props.game.type === 1 && this.props.partnerConfig.is_cashout_live) ||
        (this.props.game.type !== 1 && this.props.partnerConfig.is_cashout_prematch));

    /**
     * @name groupMarketsByType
     * @description helper function for grouping markets by their types
     * @param {object} marketsObj
     * @returns {object}
     * */
    let groupMarketsByType = (marketsObj) => {
        let markets = {};
        Object.keys(marketsObj).map(
            marketId => {
                var type = (marketsObj[marketId].market_type + marketsObj[marketId].name) || "Other";
                markets[type] = markets[type] || {markets: []};
                markets[type].markets.push(marketsObj[marketId]);
            }
        );
        Object.keys(markets).map(
            marketType => {
                markets[marketType].markets.sort(Helpers.byOrderSortingFunc);
                markets[marketType].order = markets[marketType].markets[0].order;
                markets[marketType].type = marketType;
            }
        );
        markets = Helpers.objectToArray(markets).sort(Helpers.byOrderSortingFunc);
        markets = Helpers.objectToArray(markets).sort((m1, m2) => {
            if (this.props.isMarketFavorite(m1.type) !== this.props.isMarketFavorite(m2.type)) {
                return this.props.isMarketFavorite(m1.type) ? -1 : 1;
            } else {
                return Helpers.byOrderSortingFunc(m1, m2);
            }
        });
        return markets;
    };

    var Markets, marketKeys = [];

    if (this.props.game && this.props.game.market) {
        Markets = groupMarketsByType(this.props.game.market).map(
            (marketObj, index) => {
                let marketKey = "g" + this.props.game.id + "m" + marketObj.markets[0].id;
                marketKeys.push(marketKey);
                return <div className="singe-market-view-m" key={index}>
                    <Expandable className="single-market-title-m" uiKey={marketKey} initiallyExpanded={index < 3}>
                        <span className={"fav-star-m" + (this.props.isMarketFavorite(marketObj.type) ? " active" : "")}
                              onClick={(ev) => { this.props.toggleMarketFavorite(marketObj.type)(); ev.stopPropagation(); ev.preventDefault(); }}/>
                        <h4>
                            <span className="name-market-contain-cell-m"><i>{marketObj.markets[0].name}</i></span>
                            <span className="market-icons-cell-m">
                                {marketObj.markets[0].cashout && isCashOutEnabledForPartner ? <i className="cash-out-icon-view-m"/> : null}
                                {marketObj.markets[0].express_id ? <i className="chain-icon-view-m">{marketObj.markets[0].express_id }</i> : null}
                            </span>
                        </h4>
                        <div className="markets-closed-open-arrow-m"></div>
                    </Expandable>
                    <div className="coefficient-game-view">
                    {marketObj.markets.map(
                        market => {
                            var events = Helpers.objectToArray(market.event).sort(Helpers.byOrderSortingFunc);
                            var colCount = market.col_count ? (market.col_count > 3 ? 1 : market.col_count) : 1;
                            var rows = [];
                            while (events.length) {
                                rows.push(events.splice(0, colCount));
                            }
                            return rows.map((row, i) =>
                                    <ul key={i}>
                                        {row.map(event =>
                                                <li key={event.id}>
                                                    <Event event={event} name={niceEventName(event.name, this.props.game)} price={event.price} game={this.props.game} market={market}/>
                                                </li>
                                        )}
                                    </ul>
                            );
                        }
                    )}
                    </div>
                </div>;
            }
        );
    }

    return (

        Markets.length
            ? <div className={"markets-list-wrapper" + (this.props.game.is_blocked ? " blocked" : "")}>
            <Expandable className="market-group-title-m" uiKey={"g" + this.props.game.id + "m_parent"} childrenKeys={marketKeys} initiallyExpanded={true}>
                <h3>{t("Markets")}</h3>
                <div className="markets-closed-open-arrow-m"></div>
            </Expandable>
            <div className="all-markets-view-m">
                {Markets}
            </div>
        </div>
            : <div className="empty-text-wrapper-m"><p>{t("We're not accepting bets on this event at the moment.")}</p></div>
    );
};
