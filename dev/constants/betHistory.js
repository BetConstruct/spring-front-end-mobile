let t = str => str;  // all strings here have to be inside t() to be recognizable by translation extraction script

export const BET_OUTCOME_ONHOLD = "-5";
export const BET_OUTCOME_DECLINED = "-4";
export const BET_OUTCOME_UNSETTLED = "0";
export const BET_OUTCOME_LOST = "1";
export const BET_OUTCOME_RETURNED = "2";
export const BET_OUTCOME_WON = "3";
export const BET_OUTCOME_CASHEDOUT = "5";

export const betOutcomes = {
    [BET_OUTCOME_ONHOLD]: t("On Hold"),
    [BET_OUTCOME_DECLINED]: t("Declined"),
    [BET_OUTCOME_UNSETTLED]: t("Unsettled"),
    [BET_OUTCOME_LOST]: t("Lost"),
    [BET_OUTCOME_RETURNED]: t("Returned"),
    [BET_OUTCOME_WON]: t("Won"),
    [BET_OUTCOME_CASHEDOUT]: t("Cashed out")
};
