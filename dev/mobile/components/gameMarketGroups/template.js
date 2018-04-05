import React from 'react';
import {t} from '../../../helpers/translator';

module.exports = function gameMarketGroupsTemplate () {
    let marketsObj = this.props.game.market, arr = [], filterMarketNames, marketNames;
    for (let obj in marketsObj) {
        arr.push(marketsObj[obj].group_name || "Other");
    }
    arr.unshift('all');
    filterMarketNames = arr.filter((val, index, array) => array.indexOf(val) === index);
    marketNames = filterMarketNames.map((marketName) => {
        return <li className={this.props.activeFilter === marketName ? 'active' : ''} onClick={() => { this.setMarketFilter(marketName); }}><p>{t(marketName === 'all' ? "All" : marketName)}</p></li>;
    });
    return (
        <div className="time-filter-m game-markets-f">
            <ul>
                {marketNames}
            </ul>
        </div>
    );
};