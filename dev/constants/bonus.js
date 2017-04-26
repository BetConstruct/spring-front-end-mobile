let t = str => str;  // all strings here have to be inside t() to be recognizable by translation extraction script

export const BONUS_ACCEPTANCE_TYPE_NONE = 0;
export const BONUS_ACCEPTANCE_TYPE_ACCEPTED = 1;
export const BONUS_ACCEPTANCE_TYPE_ACTIVATED = 2;
export const BONUS_ACCEPTANCE_TYPE_REJECTED = 3;
export const BONUS_ACCEPTANCE_TYPE_EXPIRED = 4;

export const BONUS_TYPE_SPORT = 1;
export const BONUS_TYPE_WAGERING = 2;
export const BONUS_TYPE_NODEPOSIT = 3;
export const BONUS_TYPE_CASH = 4;
export const BONUS_TYPE_FREESPIN = 5;
export const BONUS_TYPE_FREEBET = 6;

export const bonusAcceptanceTypes = {
    [BONUS_ACCEPTANCE_TYPE_NONE]: t("Available"),
    [BONUS_ACCEPTANCE_TYPE_ACCEPTED]: t("Accepted"),
    [BONUS_ACCEPTANCE_TYPE_ACTIVATED]: t("Activated"),
    [BONUS_ACCEPTANCE_TYPE_REJECTED]: t("Rejected"),
    [BONUS_ACCEPTANCE_TYPE_EXPIRED]: t("Expired")
};

