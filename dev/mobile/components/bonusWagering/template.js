import React from 'react';

function bonusWageringTemplate () {
    let userData = this.props.user && this.props.user.profile,
        calculatedBalance = userData.balance - (userData.frozen_balance !== undefined ? userData.frozen_balance : 0),
        calculatedBonus = userData.bonus_balance + userData.bonus_win_balance + userData.frozen_balance || 0,
        progressWidthInPercents = isNaN((calculatedBonus / (calculatedBalance + calculatedBonus)) * 100) ? 0 : (calculatedBonus / (calculatedBalance + calculatedBonus)) * 100,
        totalBalance = (calculatedBalance + calculatedBonus).toFixed(2);

    return (
        <div className="balance-view-progress-b">
            <ul>
                <li>
                    <div className="bonus-progress-info">
                        <p><span>{calculatedBonus + " " + userData.currency_name}</span><span>Total bonus</span></p>
                        <p><span>{calculatedBalance + " " + userData.currency_name}</span><span>Withdrawable funds</span></p>
                        <progressbar className="bonus-statistic-box">
                            <div className="progress-bonus-view-b" style={{width: progressWidthInPercents + "%"}}/>
                        </progressbar>
                    </div>
                </li>
                <li>
                    <div className="total-balance-view-b"><h4>Total Balance</h4><p>{totalBalance}</p></div>
                </li>
            </ul>
        </div>
    );
}

module.exports = bonusWageringTemplate;