import React, {PropTypes} from "react";
import HistoryBetItem from "./historyBetItem";
import {t} from "../../../../helpers/translator";

class BetsList extends React.Component {
    componentWillUnmount () {
        this.props.destroing();
    }
    render () {
        return (
            <div className="open-bets">
                {
                    !this.props.bets || !this.props.bets.length
                        ? <p className="no-bets">{t("No bets to show")}</p>
                        : this.props.bets.map((betId, index) => (
                            <HistoryBetItem
                                key={betId}
                                sliceFromSubscriptions={this.sliceFromSubscriptions}
                                index={index}
                                dataSelectorKey={this.props.dataSelectorKey}
                                betId={betId}/>
                        ))
                }
            </div>
        );
    }
}

BetsList.propTypes = {
    bets: PropTypes.array.isRequired,
    dataSelectorKey: PropTypes.string.isRequired
};

export default BetsList;